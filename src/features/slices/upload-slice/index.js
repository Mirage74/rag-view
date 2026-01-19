import { createSlice } from "@reduxjs/toolkit";
import { initialState } from "./initialState";
import { reducers } from "./reducers";
import { createUploadThunks } from "./thunks";
import {
  validateFilesQuota as createValidateFilesQuota,
  canUploadFiles,
  getRemainingSlots,
} from "./selectors";

const uploadFilesSlice = createSlice({
  name: "uploadFiles",
  initialState,
  reducers,
});

export const {
  resetUploadState,
  setAreFilesValid,
  setQuotaError,
  clearQuotaError,
  uploadStarted,
  progressUpdated,
  uploadCompleted,
  uploadFailed,
  uploadCancelled,
} = uploadFilesSlice.actions;

const { cancelUpload, uploadFilesWithProgress } = createUploadThunks(
  uploadFilesSlice.actions
);

const validateFilesQuota = (files) =>
  createValidateFilesQuota(files, {
    setQuotaError,
    setAreFilesValid,
    clearQuotaError,
  });

export {
  cancelUpload,
  uploadFilesWithProgress,
  validateFilesQuota,
  canUploadFiles,
  getRemainingSlots,
};

export default uploadFilesSlice.reducer;
