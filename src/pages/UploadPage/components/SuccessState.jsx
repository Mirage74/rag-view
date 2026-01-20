import { styles } from "../styles/uploadStyles";

const SuccessState = ({ filesCount, onUploadAgain, onGoHome }) => {
  return (
    <>
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
        <button style={styles.button} onClick={onUploadAgain}>
          Upload more
        </button>
        <button style={styles.buttonSecondary} onClick={onGoHome}>
          Home
        </button>
      </div>
    </>
  );
};

export default SuccessState;
