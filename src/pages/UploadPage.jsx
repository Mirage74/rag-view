import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  uploadFilesWithProgress,
  resetUploadState,
  setAreFilesValid,
  setQuotaError,
  clearQuotaError,
  cancelUpload,
} from "../features/uploadFilesSlice";
import {
  MAX_FILE_SIZE_KB,
  MAX_FILES_TO_UPLOAD,
  PROGRESS_STATUS_PROCESSING,
  PROGRESS_STATUS_COMPLETED,
  PROGRESS_STATUS_ERROR,
  PROGRESS_STATUS_SKIPPED,
} from "../features/constants";

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
    (state) => state.userDetails.maxFilesToLoad
  );

  const loadedCount = loadedFiles?.length || 0;
  const remainingSlots = Math.max(0, maxFilesToLoad - loadedCount);

  const [selectedFiles, setSelectedFiles] = useState([]);
  const fileInputRef = useRef(null);

  useEffect(() => {
    dispatch(resetUploadState());
  }, [dispatch]);

  const handleUploadClick = () => {
    if (remainingSlots === 0) {
      dispatch(setQuotaError("You have reached the maximum number of files"));
      return;
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
      fileInputRef.current.click();
    }
  };

  const handleFilesChange = (event) => {
    const files = Array.from(event.target.files || []);
    dispatch(clearQuotaError());

    // Check max files per upload
    if (files.length > MAX_FILES_TO_UPLOAD) {
      dispatch(resetUploadState());
      dispatch(setAreFilesValid(false));
      dispatch(
        setQuotaError(
          `You can upload maximum ${MAX_FILES_TO_UPLOAD} files at once`
        )
      );
      setSelectedFiles([]);
      return;
    }

    // Check remaining slots
    if (files.length > remainingSlots) {
      dispatch(resetUploadState());
      dispatch(setAreFilesValid(false));
      dispatch(
        setQuotaError(
          `You can only upload ${remainingSlots} more file(s). Already loaded: ${loadedCount}/${maxFilesToLoad}`
        )
      );
      setSelectedFiles([]);
      return;
    }

    // Check file size
    const isSizeCorrect = files.every(
      (file) => file.size <= MAX_FILE_SIZE_KB * 1024
    );
    if (!isSizeCorrect) {
      dispatch(resetUploadState());
      dispatch(setAreFilesValid(false));
      dispatch(
        setQuotaError(`Each file must be no more than ${MAX_FILE_SIZE_KB} KB`)
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

  const getStatusIcon = (status) => {
    switch (status) {
      case PROGRESS_STATUS_PROCESSING:
        return "⏳";
      case PROGRESS_STATUS_COMPLETED:
        return "✅";
      case PROGRESS_STATUS_ERROR:
        return "❌";
      case PROGRESS_STATUS_SKIPPED:
        return "⏭️";
      default:
        return "📄";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case PROGRESS_STATUS_PROCESSING:
        return "Processing...";
      case PROGRESS_STATUS_COMPLETED:
        return "Completed";
      case PROGRESS_STATUS_ERROR:
        return "Error";
      case PROGRESS_STATUS_SKIPPED:
        return "Skipped (duplicate)";
      default:
        return "Waiting...";
    }
  };

  // Loading state with progress
  if (uploading) {
    return (
      <div style={styles.container}>
        <h1 style={styles.title}>
          Upload text files for context searching in LLM
        </h1>

        <div style={styles.progressContainer}>
          <div style={styles.progressHeader}>
            <span style={styles.progressIcon}>📤</span>
            <span>Uploading files...</span>
          </div>

          <div style={styles.progressBarContainer}>
            <div
              style={{
                ...styles.progressBarFill,
                width: `${progress.percent}%`,
              }}
            />
          </div>

          <div style={styles.progressStats}>
            <div style={styles.statItem}>
              <span style={styles.statValue}>{progress.percent}%</span>
              <span style={styles.statLabel}>Complete</span>
            </div>
          </div>

          {progress.currentFile && (
            <div style={styles.currentFile}>
              <span>{getStatusIcon(progress.status)}</span>
              <span style={styles.currentFileName}>{progress.currentFile}</span>
              <span style={styles.currentFileStatus}>
                {getStatusText(progress.status)}
              </span>
            </div>
          )}

          <div style={styles.cancelButtonContainer}>
            <button style={styles.cancelButton} onClick={handleCancel}>
              Cancel Upload
            </button>
          </div>
        </div>
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
        <div style={styles.errorBox}>
          <span style={styles.errorIcon}>⚠️</span>
          <div>
            <div style={styles.errorMessage}>{error.message}</div>
            <div style={styles.errorStatus}>Status: {error.status}</div>
          </div>
        </div>
        <div style={styles.buttonGroup}>
          <button style={styles.button} onClick={handleTryAgain}>
            Try again
          </button>
          <button style={styles.buttonSecondary} onClick={handleGoHome}>
            Home
          </button>
        </div>
      </div>
    );
  }

  // Success state
  if (success) {
    const filesCount = uploadedFiles.length;
    return (
      <div style={styles.container}>
        <h1 style={styles.title}>
          Upload text files for context searching in LLM
        </h1>
        <div style={styles.successBox}>
          <span style={styles.successIcon}>✅</span>
          <div>
            <div style={styles.successMessage}>Upload completed!</div>
            <div style={styles.successStats}>
              {filesCount} of {filesCount} files processed
            </div>
          </div>
        </div>
        <div style={styles.buttonGroup}>
          <button style={styles.button} onClick={handleUploadAgain}>
            Upload more
          </button>
          <button style={styles.buttonSecondary} onClick={handleGoHome}>
            Home
          </button>
        </div>
      </div>
    );
  }

  // Default state - file selection
  return (
    <div style={styles.container}>
      <h3 style={styles.title}>
        Upload text files for context searching in LLM
      </h3>
      <p style={styles.subtitle}>
        Each file must be no more than {MAX_FILE_SIZE_KB} KB. You can upload up
        to {MAX_FILES_TO_UPLOAD} files at once.
      </p>

      {/* File quota info */}
      <div style={styles.quotaContainer}>
        <div style={styles.quotaRow}>
          <span style={styles.quotaLabel}>Files loaded:</span>
          <span style={styles.quotaValue}>
            {loadedCount} / {maxFilesToLoad}
          </span>
        </div>
        <div style={styles.quotaRow}>
          <span style={styles.quotaLabel}>Remaining slots:</span>
          <span
            style={{
              ...styles.quotaValue,
              color: remainingSlots > 0 ? "#38a169" : "#e53e3e",
            }}
          >
            {remainingSlots}
          </span>
        </div>
        <div style={styles.quotaProgressContainer}>
          <div
            style={{
              ...styles.quotaProgressFill,
              width: `${
                maxFilesToLoad > 0 ? (loadedCount / maxFilesToLoad) * 100 : 0
              }%`,
            }}
          />
        </div>
      </div>

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

      <button
        style={{
          ...styles.uploadButton,
          ...(remainingSlots === 0 && styles.buttonDisabled),
        }}
        onClick={handleUploadClick}
        disabled={remainingSlots === 0}
      >
        <span style={styles.uploadIcon}>📁</span>
        Select files
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept=".txt"
        multiple
        style={{ display: "none" }}
        onChange={handleFilesChange}
      />

      {selectedFiles.length > 0 && (
        <div style={styles.selectedFilesContainer}>
          <h4 style={styles.selectedFilesTitle}>
            Selected files ({selectedFiles.length}):
          </h4>
          <ul style={styles.fileList}>
            {selectedFiles.map((file, index) => (
              <li key={index} style={styles.fileItem}>
                <span style={styles.fileIcon}>📄</span>
                <span style={styles.fileName}>{file.name}</span>
                <span style={styles.fileSize}>
                  {(file.size / 1024).toFixed(1)} KB
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

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

const styles = {
  container: {
    padding: "2rem",
    maxWidth: "600px",
    margin: "0 auto",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  title: {
    fontSize: "1.5rem",
    fontWeight: 600,
    color: "#1a1a2e",
    marginBottom: "0.5rem",
  },
  subtitle: {
    color: "#666",
    marginBottom: "1.5rem",
    lineHeight: 1.5,
  },
  quotaContainer: {
    backgroundColor: "#f8f9fa",
    borderRadius: "8px",
    padding: "1rem",
    marginBottom: "1rem",
    border: "1px solid #e0e0e0",
  },
  quotaRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "0.5rem",
  },
  quotaLabel: {
    color: "#666",
    fontSize: "0.9rem",
  },
  quotaValue: {
    fontWeight: 500,
    color: "#1a1a2e",
  },
  quotaProgressContainer: {
    width: "100%",
    height: "6px",
    backgroundColor: "#e0e0e0",
    borderRadius: "3px",
    overflow: "hidden",
    marginTop: "0.5rem",
  },
  quotaProgressFill: {
    height: "100%",
    backgroundColor: "#667eea",
    borderRadius: "3px",
    transition: "width 0.3s ease",
  },
  progressContainer: {
    backgroundColor: "#f8f9fa",
    borderRadius: "12px",
    padding: "1.5rem",
    marginTop: "1.5rem",
  },
  progressHeader: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    fontSize: "1.1rem",
    fontWeight: 500,
    marginBottom: "1rem",
  },
  progressIcon: {
    fontSize: "1.5rem",
  },
  progressBarContainer: {
    width: "100%",
    height: "8px",
    backgroundColor: "#e0e0e0",
    borderRadius: "4px",
    overflow: "hidden",
    marginBottom: "1rem",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#4caf50",
    borderRadius: "4px",
    transition: "width 0.3s ease",
  },
  progressStats: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "1rem",
  },
  statItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  statValue: {
    fontSize: "1.5rem",
    fontWeight: 600,
    color: "#1a1a2e",
  },
  statLabel: {
    fontSize: "0.85rem",
    color: "#666",
  },
  currentFile: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    padding: "0.75rem",
    backgroundColor: "#fff",
    borderRadius: "8px",
    border: "1px solid #e0e0e0",
  },
  currentFileName: {
    flex: 1,
    fontWeight: 500,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  currentFileStatus: {
    fontSize: "0.85rem",
    color: "#666",
  },
  cancelButtonContainer: {
    display: "flex",
    justifyContent: "center",
    marginTop: "1.5rem",
  },
  cancelButton: {
    padding: "0.75rem 2rem",
    fontSize: "1rem",
    fontWeight: 500,
    color: "#fff",
    backgroundColor: "#e53e3e",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
  errorBox: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    padding: "1rem",
    backgroundColor: "#fff5f5",
    border: "1px solid #feb2b2",
    borderRadius: "8px",
    marginTop: "1rem",
    marginBottom: "1rem",
  },
  errorIcon: {
    fontSize: "2rem",
  },
  errorMessage: {
    color: "#c53030",
    fontWeight: 500,
  },
  errorStatus: {
    color: "#666",
    fontSize: "0.85rem",
  },
  successBox: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    padding: "1rem",
    backgroundColor: "#f0fff4",
    border: "1px solid #9ae6b4",
    borderRadius: "8px",
    marginTop: "1rem",
  },
  successIcon: {
    fontSize: "2rem",
  },
  successMessage: {
    color: "#276749",
    fontWeight: 500,
    fontSize: "1.1rem",
  },
  successStats: {
    color: "#666",
    fontSize: "0.9rem",
  },
  warningBox: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.75rem 1rem",
    backgroundColor: "#fffaf0",
    border: "1px solid #fbd38d",
    borderRadius: "8px",
    color: "#c05621",
    marginBottom: "1rem",
  },
  uploadButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    width: "100%",
    padding: "1rem",
    fontSize: "1rem",
    backgroundColor: "#f8f9fa",
    border: "2px dashed #ccc",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  uploadIcon: {
    fontSize: "1.25rem",
  },
  selectedFilesContainer: {
    marginTop: "1.5rem",
    padding: "1rem",
    backgroundColor: "#f8f9fa",
    borderRadius: "8px",
  },
  selectedFilesTitle: {
    margin: "0 0 0.75rem 0",
    fontSize: "1rem",
    color: "#333",
  },
  fileList: {
    listStyle: "none",
    margin: 0,
    padding: 0,
  },
  fileItem: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.5rem 0",
    borderBottom: "1px solid #e0e0e0",
  },
  fileIcon: {
    fontSize: "1rem",
  },
  fileName: {
    flex: 1,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  fileSize: {
    color: "#666",
    fontSize: "0.85rem",
  },
  buttonGroup: {
    display: "flex",
    gap: "0.75rem",
    marginTop: "1.5rem",
  },
  button: {
    padding: "0.75rem 1.5rem",
    fontSize: "1rem",
    fontWeight: 500,
    color: "#fff",
    backgroundColor: "#4a5568",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
  buttonSecondary: {
    padding: "0.75rem 1.5rem",
    fontSize: "1rem",
    fontWeight: 500,
    color: "#4a5568",
    backgroundColor: "#e2e8f0",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
  buttonDisabled: {
    opacity: 0.5,
    cursor: "not-allowed",
  },
};
