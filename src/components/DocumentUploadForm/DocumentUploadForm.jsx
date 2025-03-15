import React, { useState, useEffect } from "react"; // Need state management to track form inputs (file, filename, tags)
import axios from "axios"; // axios used to send http requests to the backend
import { API_URL } from "../../config"; // API_URL is the base URL

console.log("API_URL in DocumentUploadForm:", API_URL);

export default function DocumentUploadForm() {
  const [file, setFile] = useState(null);
  const [filename, setFilename] = useState("");
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(false); // A flsg to shoe loading state while the file is loading
  const [error, setError] = useState(null); // Stores any error message if the upload fails

  // Handling user input

  // Event handler to update the "file" state when a user selects a file
  const handleFileChange = (e) => {
    setFile(e.target.files[0]); // gets the selected file and stores it in 'file'
  };

  const handleFilenameChange = (e) => {
    setFilename(e.target.value);
  };

  const handleTagsChange = (e) => {
    setTags(e.target.value);
  };

  // Function to handle form submission and file upload
  const handleUpload = async (e) => {
    e.preventDefault(); // Prevent default form submission behaviour
    setLoading(true); // Indicate that an upload is in progress
    setError(null); // Clear any previous error message before starting a new upload attempt.

    // Prepare Form Data
    const formData = new FormData();
    formData.append("file", file);
    formData.append("filename", filename);
    formData.append("tags", JSON.stringify(tags.split(",")));

    try {
        const response = await axios.post(`${API_URL}/api/documents`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            }
        });
    } catch (error) {
        console.error("Error uploading file:", error)
        setError("Failed to upload the document. Please try again.")
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

      <button type="submit" disabled={loading}>
        {loading ? "Uploading..." : "Upload"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
};

