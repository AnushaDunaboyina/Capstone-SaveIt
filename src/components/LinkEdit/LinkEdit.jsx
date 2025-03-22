import { useParams, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../../config";
import "./LinkEdit.scss";

import back from "../../assets/icons/back3.png";

export default function LinkEdit() {
  const { id } = useParams(); // Extract the link ID from the URL
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [tags, setTags] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLink = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/links/${id}`);
        setTitle(response.data.title);
        setUrl(response.data.url);
        setDescription(response.data.description || "");
        setThumbnail(response.data.thumbnail || "");
        setTags(
          Array.isArray(response.data.tags) ? response.data.tags.join(", ") : ""
        );
      } catch (err) {
        console.error("Error fetching link:", err);
        setError("Failed to load the link details.");
      }
    };

    fetchLink();
  }, [id]);

  const handleSave = async () => {
    if (
      !title.trim() ||
      !url.trim() ||
      !tags.trim() ||
      !description.trim() ||
      !thumbnail.trim()
    ) {
      setError("All fields must be filled.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Split and trim tags
      const updatedTags = tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag); // Remove empty tags

      if (updatedTags.length === 0) {
        setError("Tags cannot be empty.");
        return;
      }

      console.log("Payload being sent to server:", {
        title: title.trim(),
        url: url.trim(),
        description: description.trim(),
        thumbnail: thumbnail.trim(),
        tags: updatedTags,
      });

      const response = await axios.patch(`${API_URL}/api/links/${id}`, {
        title: title.trim(),
        url: url.trim(),
        description: description.trim(),
        thumbnail: thumbnail.trim(),
        tags: updatedTags,
      });

      navigate("/links");
    } catch (err) {
      console.error("Error updating link:", err);
      if (err.response) {
        console.error("Server responded with:", err.response.data);
      }
      setError("Failed to update the link. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="link-edit">
      {/* Back Button */}
      <div className="link-edit__back" onClick={() => navigate("/links")}>
        <img
          src={back}
          alt="Back"
          className="link-edit__back-icon"
          title="Go Back"
        />
      </div>

      <h2 className="link-edit__title">Edit Link</h2>

      {error && <p className="link-edit__error-message">{error}</p>}

      <div className="link-edit__field">
        <input
          title="Title"
          type="text"
          className="link-edit__input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          placeholder="Title.."
        />
      </div>

      <div className="link-edit__field">
        <input
          title="URL"
          type="text"
          className="link-edit__input"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
          placeholder="Enter URL (with or without http/https)"
        />
      </div>

      <div className="link-edit__field">
        <textarea
          title="Description"
          className="link-edit__textarea"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          placeholder="Description..."
        />
      </div>

      <div className="link-edit__field">
        <input
          title="Tags: comma separated"
          type="text"
          className="link-edit__input"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          required
          placeholder="Tags: comma-separated..."
        />
      </div>

      <div className="link-edit__actions">
        <button
          className="link-edit__save-button"
          onClick={handleSave}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save"}
        </button>
        <button
          className="link-edit__cancel-button"
          onClick={() => navigate("/links")}
          disabled={loading}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
