import { initialState } from "./initialState";
import { abortAndClear } from "./abortController";
import { DEFAULT_ERROR_STATUS, UNKNOWN_ERROR } from "../../constants";

export const reducers = {
  resetUploadState() {
    abortAndClear();
    return initialState;
  },

  setAreFilesValid(state, action) {
    state.areFilesValid = action.payload;
  },

  setQuotaError(state, action) {
    state.quotaError = action.payload;
  },

  clearQuotaError(state) {
    state.quotaError = null;
  },

  uploadStarted(state, action) {
    state.uploading = true;
    state.error = { status: null, message: "" };
    state.success = false;
    state.quotaError = null;
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
};
