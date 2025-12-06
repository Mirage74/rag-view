import { createSlice } from "@reduxjs/toolkit";
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
  UNKNOWN_ERROR,
} from "./constants";

const initialState = {
  uploading: false,
  error: {
    status: null,
    message: "",
  },
  success: false,
  areFilesValid: true,
  uploadedFiles: [],
  progress: {
    percent: 0,
    processedFiles: 0,
    totalFiles: 0,
    currentFile: "",
    status: "",
  },
};

// Store AbortController outside Redux state
let currentAbortController = null;

const uploadFilesSlice = createSlice({
  name: "uploadFiles",
  initialState,
  reducers: {
    resetUploadState() {
      // Abort any ongoing upload when resetting
      if (currentAbortController) {
        currentAbortController.abort();
        currentAbortController = null;
      }
      return initialState;
    },
    setAreFilesValid(state, action) {
      state.areFilesValid = action.payload;
    },
    uploadStarted(state, action) {
      state.uploading = true;
      state.error = { status: null, message: "" };
      state.success = false;
      state.progress = {
        percent: 0,
        processedFiles: 0,
        totalFiles: action.payload.totalFiles,
        currentFile: "",
        status: "starting",
      };
    },
    progressUpdated(state, action) {
      state.progress = action.payload;
    },
    uploadCompleted(state, action) {
      state.uploading = false;
      state.success = true;
      state.uploadedFiles = action.payload.fileNames;
    },
    uploadFailed(state, action) {
      state.uploading = false;
      state.success = false;
      state.error = {
        status: action.payload.status ?? DEFAULT_ERROR_STATUS,
        message: action.payload.message ?? UNKNOWN_ERROR,
      };
    },
    uploadCancelled(state) {
      state.uploading = false;
      state.success = false;
      state.error = { status: null, message: "" };
      state.progress = initialState.progress;
    },
  },
});

export const {
  resetUploadState,
  setAreFilesValid,
  uploadStarted,
  progressUpdated,
  uploadCompleted,
  uploadFailed,
  uploadCancelled,
} = uploadFilesSlice.actions;

/**
 * Cancel the current upload
 */
export const cancelUpload = () => (dispatch) => {
  if (currentAbortController) {
    currentAbortController.abort();
    currentAbortController = null;
  }
  dispatch(uploadCancelled());
};

/**
 * Thunk for uploading files with SSE progress streaming.
 */
export const uploadFilesWithProgress =
  (files) => async (dispatch, getState) => {
    const filesArray = Array.from(files);
    const fileNames = filesArray.map((f) => f.name);

    // Create new AbortController for this upload
    currentAbortController = new AbortController();
    const signal = currentAbortController.signal;

    dispatch(uploadStarted({ totalFiles: filesArray.length }));

    const formData = new FormData();
    filesArray.forEach((file) => {
      formData.append(FORM_DATA_FILES, file);
    });

    const state = getState();
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
          signal, // Pass abort signal to fetch
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

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        // Check if aborted before reading
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
          if (line.startsWith("data:")) {
            const jsonStr = line.slice(5).trim();
            if (jsonStr && jsonStr.startsWith("{")) {
              try {
                const progressData = JSON.parse(jsonStr);
                dispatch(progressUpdated(progressData));

                if (progressData.status === PROGRESS_STATUS_COMPLETED) {
                  dispatch(uploadCompleted({ fileNames }));
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
          }
        }
      }

      // Ensure completion if stream ended without explicit completed status
      const currentState = getState();
      if (currentState.uploadFiles.uploading) {
        dispatch(uploadCompleted({ fileNames }));
      }
    } catch (err) {
      // Don't dispatch error if it was an intentional abort
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
      currentAbortController = null;
    }
  };

export default uploadFilesSlice.reducer;
