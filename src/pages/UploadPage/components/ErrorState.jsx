import { styles } from "../styles/uploadStyles";

const ErrorState = ({ error, onTryAgain, onGoHome }) => {
  return (
    <>
      <div style={styles.errorBox}>
        <span style={styles.errorIcon}>⚠️</span>
        <div>
          <div style={styles.errorMessage}>{error.message}</div>
          <div style={styles.errorStatus}>Status: {error.status}</div>
        </div>
      </div>
      <div style={styles.buttonGroup}>
        <button style={styles.button} onClick={onTryAgain}>
          Try again
        </button>
        <button style={styles.buttonSecondary} onClick={onGoHome}>
          Home
        </button>
      </div>
    </>
  );
};

export default ErrorState;
