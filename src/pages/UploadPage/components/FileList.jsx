import { styles } from "../styles/uploadStyles";

const FileList = ({ files }) => {
  if (files.length === 0) return null;

  return (
    <div style={styles.selectedFilesContainer}>
      <h4 style={styles.selectedFilesTitle}>
        Selected files ({files.length}):
      </h4>
      <ul style={styles.fileList}>
        {files.map((file, index) => (
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
  );
};

export default FileList;
