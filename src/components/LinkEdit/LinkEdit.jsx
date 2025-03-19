import { useParams, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../../config";

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
    // Fetch the link details using the ID from the URL
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

      // const tagsJson = JSON.stringify(updatedTags);
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

      console.log("Response from Server:", response.data);
      alert("Link updated successfully!");
      navigate("/links"); // Navigate back to links page
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
      <div onClick={() => navigate("/links")}>
        <button>Back</button>
      </div>
      <h2>Edit Link</h2>

      {error && <p className="error-message">{error}</p>}

      <div>
        <label>Title:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div>
        <label>URL:</label>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Description:</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Thumbnail URL:</label>
        <input
          type="text"
          value={thumbnail}
          onChange={(e) => setThumbnail(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Tags (comma-separated):</label>
        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          required
        />
      </div>

      <button onClick={handleSave} disabled={loading}>
        {loading ? "Saving..." : "Save"}
      </button>
      <button onClick={() => navigate("/links")} disabled={loading}>
        Cancel
      </button>
    </div>
  );
}
