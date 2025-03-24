import React, { useState } from "react";
import axios from "axios";
import { API_URL } from "../../config";
import "./DocumentUploadForm.scss";

import upload from "../../assets/icons/upload.png";
import goBack from "../../assets/icons/back3.png";

export default function DocumentUploadForm({ onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [filename, setFilename] = useState("");
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setFilename(selectedFile.name);
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

  const handleUpload = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    if (!file || !filename || !tags) {
      setError("Please fill out all fields before uploading.");
      setLoading(false);
      return;
    }

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

      setSuccess(true);
      setError(null);

      if (typeof onUploadSuccess === "function") {
        onUploadSuccess();
      }

      setShowForm(false);
    } catch (error) {
      setError("Failed to upload the document. Please try again.");
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="document-upload-form">
      {!showForm && (
        <img
          title="Upload a file"
          src={upload}
          onClick={() => setShowForm(true)}
          className="document-upload-form__upload-icon"
          alt="Upload"
        />
      )}

      {showForm && (
        <div className="document-upload-form__modal-overlay">
          <div className="document-upload-form__modal-content">
            <img
              title="Go back"
              src={goBack}
              alt="Go Back"
              onClick={() => setShowForm(false)}
              className="document-upload-form__go-back-icon"
            />
            <form
              onSubmit={handleUpload}
              className="document-upload-form__form"
            >
              <div className="document-upload-form__form-group">
                <label
                  className="document-upload-form__file-label"
                  htmlFor="uploadFile"
                >
                  Choose File
                </label>
                <input
                  id="uploadFile"
                  type="file"
                  className="document-upload-form__file-input"
                  onChange={handleFileChange}
                />

                {file && (
                  <p className="document-upload-form__file-name">{filename}</p>
                )}
              </div>

              <div className="document-upload-form__form-group">
                <input
                  id="filenameInput"
                  title="Filename"
                  type="text"
                  className="document-upload-form__text-input"
                  placeholder="Enter filename"
                  value={filename}
                  onChange={handleFilenameChange}
                />
              </div>

              <div className="document-upload-form__form-group">
                <input
                  id="tagsInput"
                  title="Tags: comma separated"
                  type="text"
                  className="document-upload-form__text-input"
                  placeholder="Enter tags (comma separated)"
                  value={tags}
                  onChange={handleTagsChange}
                />
              </div>

              <button
                type="submit"
                className="document-upload-form__submit-button"
                disabled={loading || !file || !filename || !tags}
              >
                {loading ? "Uploading..." : "Upload"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
