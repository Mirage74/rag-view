import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  uploadFilesWithProgress,
  resetUploadState,
  setAreFilesValid,
  setQuotaError,
  clearQuotaError,
  cancelUpload,
} from "../../features/uploadFilesSlice";
import {
  MAX_FILE_SIZE_KB,
  MAX_FILES_TO_UPLOAD,
} from "../../features/constants";

import UploadProgress from "./components/UploadProgress";
import ErrorState from "./components/ErrorState";
import SuccessState from "./components/SuccessState";
import QuotaInfo from "./components/QuotaInfo";
import FileSelector from "./components/FileSelector";
import FileList from "./components/FileList";
import { styles } from "./styles/uploadStyles";

export default function UploadPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    uploading,
    error,
    success,
    areFilesValid,
    quotaError,
    progress,
    uploadedFiles,
  } = useSelector((state) => state.uploadFiles);

  const loadedFiles = useSelector((state) => state.userDetails.loadedFiles);
  const maxFilesToLoad = useSelector(
    (state) => state.userDetails.maxFilesToLoad,
  );

  const loadedCount = loadedFiles?.length || 0;
  const remainingSlots = Math.max(0, maxFilesToLoad - loadedCount);

  const [selectedFiles, setSelectedFiles] = useState([]);

  useEffect(() => {
    dispatch(resetUploadState());
  }, [dispatch]);

  const handleFilesChange = (event) => {
    const files = Array.from(event.target.files || []);
    dispatch(clearQuotaError());

    if (files.length > MAX_FILES_TO_UPLOAD) {
      dispatch(resetUploadState());
      dispatch(setAreFilesValid(false));
      dispatch(
        setQuotaError(
          `You can upload maximum ${MAX_FILES_TO_UPLOAD} files at once`,
        ),
      );
      setSelectedFiles([]);
      return;
    }

    if (files.length > remainingSlots) {
      dispatch(resetUploadState());
      dispatch(setAreFilesValid(false));
      dispatch(
        setQuotaError(
          `You can only upload ${remainingSlots} more file(s). Already loaded: ${loadedCount}/${maxFilesToLoad}`,
        ),
      );
      setSelectedFiles([]);
      return;
    }

    const isSizeCorrect = files.every(
      (file) => file.size <= MAX_FILE_SIZE_KB * 1024,
    );
    if (!isSizeCorrect) {
      dispatch(resetUploadState());
      dispatch(setAreFilesValid(false));
      dispatch(
        setQuotaError(`Each file must be no more than ${MAX_FILE_SIZE_KB} KB`),
      );
      setSelectedFiles([]);
      return;
    }

    dispatch(setAreFilesValid(true));
    setSelectedFiles(files);
  };

  const handleSend = () => {
    if (!selectedFiles.length || uploading) return;
    dispatch(uploadFilesWithProgress(selectedFiles));
  };

  const handleClear = () => {
    setSelectedFiles([]);
    dispatch(clearQuotaError());
  };

  const handleCancel = () => {
    dispatch(cancelUpload());
    setSelectedFiles([]);
  };

  const handleTryAgain = () => {
    dispatch(resetUploadState());
    setSelectedFiles([]);
  };

  const handleGoHome = () => {
    dispatch(resetUploadState());
    navigate("/");
  };

  const handleUploadAgain = () => {
    dispatch(resetUploadState());
    setSelectedFiles([]);
  };

  // Loading state
  if (uploading) {
    return (
      <div style={styles.container}>
        <h1 style={styles.title}>
          Upload text files for context searching in LLM
        </h1>
        <UploadProgress progress={progress} onCancel={handleCancel} />
      </div>
    );
  }

  // Error state
  if (error.status !== undefined && error.status !== null) {
    return (
      <div style={styles.container}>
        <h1 style={styles.title}>
          Upload text files for context searching in LLM
        </h1>
        <ErrorState
          error={error}
          onTryAgain={handleTryAgain}
          onGoHome={handleGoHome}
        />
      </div>
    );
  }

  // Success state
  if (success) {
    return (
      <div style={styles.container}>
        <h1 style={styles.title}>
          Upload text files for context searching in LLM
        </h1>
        <SuccessState
          filesCount={uploadedFiles.length}
          onUploadAgain={handleUploadAgain}
          onGoHome={handleGoHome}
        />
      </div>
    );
  }

  // Default state
  return (
    <div style={styles.container}>
      <h3 style={styles.title}>
        Upload text files for context searching in LLM
      </h3>
      <p style={styles.subtitle}>
        Each file must be no more than {MAX_FILE_SIZE_KB} KB. You can upload up
        to {MAX_FILES_TO_UPLOAD} files at once.
      </p>

      <QuotaInfo
        loadedCount={loadedCount}
        maxFilesToLoad={maxFilesToLoad}
        remainingSlots={remainingSlots}
      />

      {!areFilesValid && !quotaError && (
        <div style={styles.warningBox}>
          <span>⚠️</span>
          <span>File requirements not met. Please adjust your selection.</span>
        </div>
      )}

      {quotaError && (
        <div style={styles.warningBox}>
          <span>⚠️</span>
          <span>{quotaError}</span>
        </div>
      )}

      {remainingSlots === 0 && !quotaError && (
        <div style={styles.errorBox}>
          <span style={styles.errorIcon}>🚫</span>
          <div>
            <div style={styles.errorMessage}>
              You have reached the maximum number of files
            </div>
          </div>
        </div>
      )}

      <FileSelector
        disabled={remainingSlots === 0}
        onFilesChange={handleFilesChange}
      />

      <FileList files={selectedFiles} />

      <div style={styles.buttonGroup}>
        <button
          style={{
            ...styles.button,
            ...((!selectedFiles.length || uploading) && styles.buttonDisabled),
          }}
          onClick={handleSend}
          disabled={!selectedFiles.length || uploading}
        >
          Send
        </button>
        <button
          style={{
            ...styles.buttonSecondary,
            ...((!selectedFiles.length || uploading) && styles.buttonDisabled),
          }}
          onClick={handleClear}
          disabled={!selectedFiles.length || uploading}
        >
          Clear
        </button>
      </div>
    </div>
  );
}
