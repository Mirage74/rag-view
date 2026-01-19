import { MAX_FILES_TO_UPLOAD } from "../../constants";

const getQuotaInfo = (state) => {
  const loadedFiles = state.userDetails?.loadedFiles || [];
  const maxFilesToLoad = state.userDetails?.maxFilesToLoad || 0;
  const loadedCount = loadedFiles.length;
  const remainingSlots = Math.max(0, maxFilesToLoad - loadedCount);

  return { loadedFiles, maxFilesToLoad, loadedCount, remainingSlots };
};

export const validateFilesQuota =
  (files, { setQuotaError, setAreFilesValid, clearQuotaError }) =>
  (dispatch, getState) => {
    const state = getState();
    const { maxFilesToLoad, loadedCount, remainingSlots } = getQuotaInfo(state);
    const filesCount = files.length;

    if (filesCount > MAX_FILES_TO_UPLOAD) {
      const errorMsg = `You can upload maximum ${MAX_FILES_TO_UPLOAD} files at once`;
      dispatch(setQuotaError(errorMsg));
      dispatch(setAreFilesValid(false));
      return { valid: false, error: errorMsg };
    }

    if (filesCount > remainingSlots) {
      const errorMsg =
        remainingSlots === 0
          ? `You have reached the maximum number of files (${maxFilesToLoad})`
          : `You can only upload ${remainingSlots} more file(s). Already loaded: ${loadedCount}/${maxFilesToLoad}`;
      dispatch(setQuotaError(errorMsg));
      dispatch(setAreFilesValid(false));
      return { valid: false, error: errorMsg };
    }

    dispatch(clearQuotaError());
    dispatch(setAreFilesValid(true));
    return { valid: true, error: null };
  };

export const canUploadFiles = () => (dispatch, getState) => {
  const state = getState();
  const { remainingSlots } = getQuotaInfo(state);
  return remainingSlots > 0;
};

export const getRemainingSlots = () => (dispatch, getState) => {
  const state = getState();
  const { remainingSlots } = getQuotaInfo(state);
  return remainingSlots;
};

export const validateQuotaBeforeUpload = (state, filesCount) => {
  const { maxFilesToLoad, loadedCount, remainingSlots } = getQuotaInfo(state);

  if (filesCount > MAX_FILES_TO_UPLOAD) {
    return {
      status: 400,
      message: `You can upload maximum ${MAX_FILES_TO_UPLOAD} files at once`,
    };
  }

  if (filesCount > remainingSlots) {
    return {
      status: 400,
      message:
        remainingSlots === 0
          ? `You have reached the maximum number of files (${maxFilesToLoad})`
          : `You can only upload ${remainingSlots} more file(s). Already loaded: ${loadedCount}/${maxFilesToLoad}`,
    };
  }

  return null;
};
