import React, { useState, useEffect } from "react"; // Need state management to track form inputs (file, filename, tags)
import axios from "axios"; // axios used to send http requests to the backend
import { API_URL } from "../../config"; // API_URL is the base URL

console.log("API_URL in DocumentUploadForm:", API_URL);

export default function DocumentUploadForm({ onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [filename, setFilename] = useState("");
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(false); // A flsg to shoe loading state while the file is loading
  const [error, setError] = useState(null); // Stores any error message if the upload fails
  const [success, setSuccess] = useState(false); // Tracks upload success
  // Handling user input

  // Event handler to update the "file" state when a user selects a file
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setSuccess(false);
  };

  const handleFilenameChange = (e) => {
    setFilename(e.target.value);
    setSuccess(false);
  };

  const handleTagsChange = (e) => {
    setTags(e.target.value);
    setSuccess(false);
  };

  // Function to handle form submission and file upload
  const handleUpload = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    // Check for missing fields before proceeding
    if (!file || !filename || !tags) {
      setError("Please fill out all fields before uploading.");
      console.error("File, filename, or tags are missing!");
      setLoading(false);
      return;
    }

    // Debug: Log the current input values
    console.log("Preparing to upload:");
    console.log("File:", file);
    console.log("Filename:", filename);
    console.log("Tags:", tags);

    // Prepare Form Data
    const formData = new FormData();
    formData.append("file", file);
    formData.append("filename", filename);
    formData.append("tags", JSON.stringify(tags.split(",")));

    try {
      const response = await axios.post(
        `${API_URL}/api/documents/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("File uploaded successfully:", response.data);

      setSuccess(true);
      setError(null);

      if (typeof onUploadSuccess === "function") {
        onUploadSuccess();
      }
    } catch (error) {
      console.error("Error uploading file:", error);

      setError("Failed to upload the document. Please try again.");
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleUpload}>
      <div>
        <label>File:</label>
        <input type="file" onChange={handleFileChange} />
      </div>

      <div>
        <label>Filename:</label>
        <input type="text" value={filename} onChange={handleFilenameChange} />
      </div>

      <div>
        <label>Tags (comma seperated)</label>
        <input type="text" value={tags} onChange={handleTagsChange} />
      </div>

      {/* <div>
        <label>Filename:</label>
        <input type="text" value={filename} onChange={handleFilenameChange} />
        {filenameError && <p className="error-message">{filenameError}</p>}
      </div>

      <div>
        <label>Tags (comma separated):</label>
        <input type="text" value={tags} onChange={handleTagsChange} />
        {tagsError && <p className="error-message">{tagsError}</p>}
      </div> */}

      <button type="submit" disabled={loading || !file || !filename || !tags}>
        {loading ? "Uploading..." : "Upload"}
      </button>

      {error && <p className="error-message">{error}</p>}
      {success && (
        <p className="success-message">File uploaded successfully!</p>
      )}
    </form>
  );
}
