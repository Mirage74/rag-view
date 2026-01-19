import fetchUserProfile from "../../fetch-async/fetchUserProfile";
import {
  BASE_URL,
  METHOD_POST_QUERY,
  PREFIX_DOCUMENT,
  PREFIX_UPLOAD_STREAM,
  FORM_DATA_FILES,
  DEFAULT_ERROR_STATUS,
  PROGRESS_STATUS_COMPLETED,
  PROGRESS_STATUS_ERROR,
  ERROR_NO_RESPONSE,
} from "../../constants";
import {
  createAbortController,
  abortAndClear,
  clearAbortController,
} from "./abortController";
import { validateQuotaBeforeUpload } from "./selectors";

export const createUploadThunks = (actions) => {
  const {
    uploadStarted,
    progressUpdated,
    uploadCompleted,
    uploadFailed,
    uploadCancelled,
  } = actions;

  const cancelUpload = () => (dispatch) => {
    abortAndClear();
    dispatch(uploadCancelled());
  };

  const uploadFilesWithProgress = (files) => async (dispatch, getState) => {
    const filesArray = Array.from(files);
    const fileNames = filesArray.map((f) => f.name);
    const state = getState();
    const quotaError = validateQuotaBeforeUpload(state, filesArray.length);

    if (quotaError) {
      dispatch(uploadFailed(quotaError));
      return;
    }

    const abortController = createAbortController();
    const signal = abortController.signal;

    dispatch(uploadStarted({ totalFiles: filesArray.length }));

    const formData = new FormData();
    filesArray.forEach((file) => {
      formData.append(FORM_DATA_FILES, file);
    });

    const token = state.userDetails?.token;
    const headers = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(
        `${BASE_URL}${PREFIX_DOCUMENT}${PREFIX_UPLOAD_STREAM}`,
        {
          method: METHOD_POST_QUERY,
          headers,
          body: formData,
          signal,
        }
      );

      if (!response.ok) {
        dispatch(
          uploadFailed({
            status: response.status,
            message: `Server error: ${response.statusText}`,
          })
        );
        return;
      }

      await processSSEStream(response, signal, dispatch, fileNames, {
        progressUpdated,
        uploadCompleted,
        uploadFailed,
      });

      const currentState = getState();
      if (currentState.uploadFiles.uploading) {
        dispatch(uploadCompleted({ fileNames }));
        dispatch(fetchUserProfile());
      }
    } catch (err) {
      if (err.name === "AbortError") {
        console.log("Upload cancelled by user");
        return;
      }

      console.error("Upload stream error:", err);
      dispatch(
        uploadFailed({
          status: DEFAULT_ERROR_STATUS,
          message: `${ERROR_NO_RESPONSE}: ${err.message}`,
        })
      );
    } finally {
      clearAbortController();
    }
  };

  return {
    cancelUpload,
    uploadFilesWithProgress,
  };
};

async function processSSEStream(
  response,
  signal,
  dispatch,
  fileNames,
  actions
) {
  const { progressUpdated, uploadCompleted, uploadFailed } = actions;
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  try {
    while (true) {
      if (signal.aborted) {
        reader.cancel();
        return;
      }

      const { done, value } = await reader.read();

      if (done) {
        break;
      }

      buffer += decoder.decode(value, { stream: true });

      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        processSSELine(line, dispatch, fileNames, {
          progressUpdated,
          uploadCompleted,
          uploadFailed,
        });
      }
    }
  } finally {
    reader.releaseLock();
  }
}

function processSSELine(line, dispatch, fileNames, actions) {
  const { progressUpdated, uploadCompleted, uploadFailed } = actions;

  if (!line.startsWith("data:")) {
    return;
  }

  const jsonStr = line.slice(5).trim();
  if (!jsonStr || !jsonStr.startsWith("{")) {
    return;
  }

  try {
    const progressData = JSON.parse(jsonStr);
    dispatch(progressUpdated(progressData));

    if (progressData.status === PROGRESS_STATUS_COMPLETED) {
      dispatch(uploadCompleted({ fileNames }));
      dispatch(fetchUserProfile());
    } else if (progressData.status === PROGRESS_STATUS_ERROR) {
      dispatch(
        uploadFailed({
          status: DEFAULT_ERROR_STATUS,
          message: `Error processing file: ${progressData.currentFile}`,
        })
      );
    }
  } catch (parseError) {
    console.error("Failed to parse SSE data:", parseError);
  }
}
