import { styles } from "../styles/uploadStyles";

const QuotaInfo = ({ loadedCount, maxFilesToLoad, remainingSlots }) => {
  const percentage =
    maxFilesToLoad > 0 ? (loadedCount / maxFilesToLoad) * 100 : 0;

  return (
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
            width: `${percentage}%`,
          }}
        />
      </div>
    </div>
  );
};

export default QuotaInfo;
