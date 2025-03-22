import { useParams, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../../config";
import "./DocumentEdit.scss";

import back from "../../assets/icons/back3.png";

export default function DocumentEdit({
  onCancelEditDocument,
  onSaveEditDocument,
}) {
  const { id } = useParams(); // Extract the document ID from the URL
  const navigate = useNavigate();

  const [filename, setFilename] = useState("");
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch the document details using the ID from the URL
    const fetchDocument = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/documents/${id}`);
        setFilename(response.data.filename);
        setTags(
          Array.isArray(response.data.tags) ? response.data.tags.join(", ") : ""
        );
      } catch (err) {
        console.error("Error fetching document:", err);
        setError("Failed to load the document details.");
      }
    };

    fetchDocument();
  }, [id]);

  const handleSave = async () => {
    if (!filename.trim() || !tags.trim()) {
      setError("Filename and tags cannot be empty.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Split and trim tags
      const updatedTags = tags.split(",").map((tag) => tag.trim());
      console.log("Payload being sent to server:", {
        filename: filename.trim(),
        tags: updatedTags, // Use updatedTags here
      });

      console.log("Payload being sent to the server:", {
        filename: filename.trim(),
        tags: tags.trim(),
      });

      const response = await axios.patch(`${API_URL}/api/documents/${id}`, {
        filename: filename.trim(),
        tags: updatedTags,
      });

      console.log("Response from Server:", response.data);

      alert("Documents updated successfully!");

      navigate("/documents"); // Navigate back to documents page
    } catch (err) {
      console.error("Error updating document:", err);
      if (err.response) {
        console.error("Server responded with:", err.response.data);
      }
      setError("Failed to update the document. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="document-edit">
      {/* Back Button */}
      <div
        className="document-edit__back"
        onClick={() => navigate("/documents")}
      >
        <img
          src={back}
          alt="Back"
          className="document-edit__back-icon"
          title="Go Back"
        />
      </div>

      <h2 className="document-edit__title">Edit Document</h2>

      {error && <p className="document-edit__error-message">{error}</p>}

      <div className="document-edit__field">
        <input
          title="Filename"
          type="text"
          className="document-edit__input"
          value={filename}
          onChange={(e) => setFilename(e.target.value)}
          required
          placeholder="Enter filename..."
        />
      </div>

      <div className="document-edit__field">
        <input
          title="Tags: comma separated"
          type="text"
          className="document-edit__input"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          required
          placeholder="Enter tags (comma-separated)..."
        />
      </div>

      <div className="document-edit__actions">
        <button
          className="document-edit__save-button"
          onClick={handleSave}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save"}
        </button>
        <button
          className="document-edit__cancel-button"
          onClick={() => navigate("/documents")}
          disabled={loading}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
