import { getStatusIcon, getStatusText } from "../utils/statusHelpers";
import { styles } from "../styles/uploadStyles";

const UploadProgress = ({ progress, onCancel }) => {
  return (
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
        <button style={styles.cancelButton} onClick={onCancel}>
          Cancel Upload
        </button>
      </div>
    </div>
  );
};

export default UploadProgress;
