import { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { uploadFiles, resetUploadState } from "../features/uploadFilesSlice";

export default function UploadPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { uploading, error, success } = useSelector(
    (state) => state.uploadFiles
  );
  const [selectedFiles, setSelectedFiles] = useState([]);
  const fileInputRef = useRef(null);

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
      fileInputRef.current.click();
    }
  };

  const handleFilesChange = (event) => {
    const files = Array.from(event.target.files || []);
    setSelectedFiles(files);
  };

  const handleSend = () => {
    if (!selectedFiles.length || uploading) return;
    dispatch(uploadFiles(selectedFiles));
  };

  const handleClear = () => {
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

  if (uploading) {
    return (
      <div style={{ padding: "1rem" }}>
        <h1>
          Here you can upload yours text files .txt for context searching in LLM
        </h1>
        <div style={{ marginTop: "1rem", fontSize: "1.2rem" }}>Loading ⏳</div>
      </div>
    );
  }

  if (error !== null) {
    return (
      <div style={{ padding: "1rem" }}>
        <h1>
          Here you can upload yours text files .txt for context searching in LLM
        </h1>
        <div style={{ marginTop: "1rem", color: "red" }}>Error: {error}</div>
        <div style={{ marginTop: "1rem", display: "flex", gap: "0.5rem" }}>
          <button onClick={handleTryAgain}>Try again</button>
          <button onClick={handleGoHome}>Home</button>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div style={{ padding: "1rem" }}>
        <h1>
          Here you can upload yours text files .txt for context searching in LLM
        </h1>
        <div style={{ marginTop: "1rem", fontSize: "1.2rem" }}>Success</div>
        <div style={{ marginTop: "1rem", display: "flex", gap: "0.5rem" }}>
          <button onClick={handleUploadAgain}>Upload</button>
          <button onClick={handleGoHome}>Home</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "1rem" }}>
      <h1>
        Here you can upload yours text files .txt for context searching in LLM
      </h1>

      <button style={{ marginTop: "1rem" }} onClick={handleUploadClick}>
        Upload
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
        <div style={{ marginTop: "1rem" }}>
          <h2>Selected files:</h2>
          <ul>
            {selectedFiles.map((file, index) => (
              <li key={index}>{file.webkitRelativePath || file.name}</li>
            ))}
          </ul>
        </div>
      )}

      <div style={{ marginTop: "1rem", display: "flex", gap: "0.5rem" }}>
        <button
          onClick={handleSend}
          disabled={!selectedFiles.length || uploading}
        >
          Send
        </button>
        <button
          onClick={handleClear}
          disabled={!selectedFiles.length || uploading}
        >
          Clear
        </button>
      </div>
    </div>
  );
}
