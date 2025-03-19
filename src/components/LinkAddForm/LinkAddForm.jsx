import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../config";

export default function LinkAddForm() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [protocol, setProtocol] = useState("https://");
  const [tags, setTags] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

      // Check if the user input URL already includes a protocol
      const fullUrl =
        url.trim().startsWith("http://") || url.trim().startsWith("https://")
          ? url.trim() // Use the user-provided URL as is
          : `${protocol}${url.trim()}`; // Otherwise, prepend the selected protocol
      console.log("Final URL being sent:", fullUrl); // Debug log

      // Split and trim tags
      const updatedTags = tags.split(",").map((tag) => tag.trim());
    

      const response = await axios.post(`${API_URL}/api/links`, {
        title: title.trim(),
        url: fullUrl,
        description: description.trim(),
        thumbnail: thumbnail.trim(),
        tags: updatedTags, // Send as an array
      });

      console.log("Response from Server:", response.data);
      alert("Link added successfully!");
      navigate("/links"); // Navigate back to links page
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
      <div onClick={() => navigate("/links")}>
        <button>Back</button>
      </div>
      <h2>Add New Link</h2>

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
        <label>Protocol:</label>
        <select
          value={protocol}
          onChange={(e) => setProtocol(e.target.value)} // Update protocol state
        >
          <option value="http://">http://</option>
          <option value="https://">https://</option>
        </select>
      </div>

      <div>
        <label>URL:</label>
        <input
          type="text"
          placeholder="Enter the URL (e.g., example.com) OR (e.g., https://www.example.com/)"
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
