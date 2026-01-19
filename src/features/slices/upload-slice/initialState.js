export const initialState = {
  uploading: false,
  error: {
    status: null,
    message: "",
  },
  success: false,
  areFilesValid: true,
  quotaError: null,
  uploadedFiles: [],
  progress: {
    percent: 0,
    processedFiles: 0,
    totalFiles: 0,
    currentFile: "",
    status: "",
  },
};
