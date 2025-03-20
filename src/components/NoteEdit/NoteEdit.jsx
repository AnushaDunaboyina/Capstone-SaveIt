import { useParams, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../../config";

export default function NoteEdit() {
  const { id } = useParams(); // Extract the note ID from the URL
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [color, setColor] = useState("#ffffff"); // Default color
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch the note details using the ID from the URL
    const fetchNote = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/notes/${id}`);
        setTitle(response.data.title);
        setContent(response.data.content);
        setColor(response.data.color || "#ffffff");
        setTags(
          Array.isArray(response.data.tags) ? response.data.tags.join(", ") : ""
        );
      } catch (err) {
        console.error("Error fetching note:", err);
        setError("Failed to load the note details.");
      }
    };

    fetchNote();
  }, [id]);

  const handleSave = async () => {
    if (!title.trim() || !content.trim() || !tags.trim()) {
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

      // Payload for the server
      const payload = {
        title: title.trim(),
        content: content.trim(),
        color: color.trim(),
        tags: updatedTags,
      };

      // console.log("Payload being sent to server:", payload);

      const response = await axios.patch(`${API_URL}/api/notes/${id}`, payload);

      console.log("Response from Server:", response.data);
      alert("Note updated successfully!");
      navigate("/notes"); // Navigate back to notes page
    } catch (err) {
      console.error("Error updating note:", err);
      if (err.response) {
        console.error("Server responded with:", err.response.data);
      }
      setError("Failed to update the note. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="note-edit">
      <div onClick={() => navigate("/notes")}>
        <button>Back</button>
      </div>
      <h2>Edit Note</h2>

      {error && <p className="error-message">{error}</p>}

      <div>
        <label>Title:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={{
            backgroundColor: color, 
            color: "#333", 
            padding: "8px",
            borderRadius: "4px",
          }}
        />
      </div>

      <div>
        <label>Content:</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows="10"
          cols="50"
          required
          style={{
            backgroundColor: color, 
            color: "#333", 
            padding: "8px",
            borderRadius: "4px",
          }}
        />
      </div>

      <div>
        <label>Note Color:</label>
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
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
      <button onClick={() => navigate("/notes")} disabled={loading}>
        Cancel
      </button>
    </div>
  );
}
