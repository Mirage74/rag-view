import { useRef } from "react";
import { styles } from "../styles/uploadStyles";

const FileSelector = ({ disabled, onFilesChange }) => {
  const fileInputRef = useRef(null);

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
      fileInputRef.current.click();
    }
  };

  return (
    <>
      <button
        style={{
          ...styles.uploadButton,
          ...(disabled && styles.buttonDisabled),
        }}
        onClick={handleClick}
        disabled={disabled}
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
        onChange={onFilesChange}
      />
    </>
  );
};

export default FileSelector;
