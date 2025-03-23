import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../config";
import "./LinkAddForm.scss";

import back from "../../assets/icons/back3.png";

export default function LinkAddForm() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [protocol, setProtocol] = useState("https://");
  const [tags, setTags] = useState("");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSave = async () => {
    if (!title.trim() || !url.trim() || !tags.trim() || !description.trim()) {
      setError("All fields must be filled.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Check if the user input URL already includes a protocol
      const fullUrl =
        url.trim().startsWith("http://") || url.trim().startsWith("https://")
          ? url.trim()
          : `${protocol}${url.trim()}`;

      // Split and trim tags
      const updatedTags = tags.split(",").map((tag) => tag.trim());

      const response = await axios.post(`${API_URL}/api/links`, {
        title: title.trim(),
        url: fullUrl,
        description: description.trim(),
        tags: updatedTags,
      });

      navigate("/links");
    } catch (err) {
      console.error("Error adding link:", err);
      if (err.response) {
        console.error("Server responded with:", err.response.data);
      }
      setError("Failed to add the link. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="link-add">
      {/* Back Button */}
      <div className="link-add__back" onClick={() => navigate("/links")}>
        <img
          src={back}
          alt="Back"
          className="link-add__back-icon"
          title="Go Back"
        />
      </div>

      <h2 className="link-add__title">Add New Link</h2>

      {error && <p className="link-add__error-message">{error}</p>}

      <div className="link-add__field">
        <input
          title="Title"
          type="text"
          className="link-add__input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          placeholder="Title.."
        />
      </div>

      <div className="link-add__field link-add__field--url-protocol">
        <div className="link-add__protocol">
          <select
            className="link-add__protocol-select"
            value={protocol}
            onChange={(e) => setProtocol(e.target.value)}
          >
            <option value="http://">http://</option>
            <option value="https://">https://</option>
          </select>
        </div>
        <input
          type="text"
          className="link-add__input"
          placeholder="Enter Enter URL (with or without http/https)"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
        />
      </div>

      <div className="link-add__field">
        <textarea
          className="link-add__textarea"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          placeholder="Description..."
        />
      </div>

      <div className="link-add__field">
        <input
          type="text"
          className="link-add__input"
          value={tags}
          placeholder="Tags: comma-separated.."
          onChange={(e) => setTags(e.target.value)}
          required
        />
      </div>

      <div className="link-add__actions">
        <button
          className="link-add__save-button"
          onClick={handleSave}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save"}
        </button>
        <button
          className="link-add__cancel-button"
          onClick={() => navigate("/links")}
          disabled={loading}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
