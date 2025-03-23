import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { API_URL } from "../../config";
import Quill from "quill";
import "quill/dist/quill.snow.css"; // Quill's default styling
import "./NoteEdit.scss";
import backButton from "../../assets/icons/back3.png";

export default function NoteEditForm() {
  const navigate = useNavigate();
  const { id } = useParams(); // Get the ID from the URL

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [color, setColor] = useState("#ffffff"); // Default color
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const editorRef = useRef(null);
  let quillInstance = useRef(null); // Reference for the Quill instance

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/notes/${id}`);
        setTitle(response.data.title);
        setTags(response.data.tags.join(", "));
        setColor(response.data.color || "#ffffff"); // Set color from response

        // Set the content in state
        const noteContent = response.data.content || "<p></p>"; // Default to empty paragraph
        setContent(noteContent);

        // If Quill is already initialized, update the editor content
        if (quillInstance.current) {
          quillInstance.current.root.innerHTML = noteContent;
        }
      } catch (err) {
        console.error("Error fetching note:", err);
        setError("Failed to load the note details.");
      }
    };

    fetchNote();
  }, [id]);

  // Initialize Quill editor
  useEffect(() => {
    if (!quillInstance.current) {
      quillInstance.current = new Quill(editorRef.current, {
        theme: "snow",
        modules: {
          toolbar: [
            ["bold", "italic", "underline"],
            [{ list: "ordered" }, { list: "bullet" }],
            [{ color: [] }, { background: [] }],
            ["clean"],
          ],
        },
      });

      quillInstance.current.root.innerHTML = content; // Set initial content

      // Listen for content changes
      quillInstance.current.on("text-change", () => {
        const editorContent = quillInstance.current.root.innerHTML;
        setContent(editorContent); // Update content dynamically
      });
    }

    return () => {
      if (quillInstance.current) {
        quillInstance.current.off("text-change");
      }
    };
  }, [content]);

  const handleSave = async () => {
    if (!title.trim() || !content.trim() || !tags.trim()) {
      setError("All fields must be filled.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Extract plain text from the editor
      const plainTextContent = quillInstance.current.getText().trim();
      const updatedTags = tags.split(",").map((tag) => tag.trim());

      // Update the note in the backend
      await axios.patch(`${API_URL}/api/notes/${id}`, {
        title: title.trim(),
        content: plainTextContent,
        tags: updatedTags,
        color,
      });

      navigate("/notes");
    } catch (err) {
      console.error("Error saving note:", err);
      setError("Failed to save the note. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="note-edit">
      <div
        className="note-edit__back"
        onClick={() => {
          navigate("/notes");
        }}
      >
        <img
          src={backButton}
          alt="Back button icon"
          className="note-edit__back-icon"
          title="Go back"
        />
      </div>

      <h2 className="note-edit__title">Edit Note</h2>

      {error && <p className="note-edit__error-message">{error}</p>}

      <div className="note-edit__title-color-field">
        <div className="note-edit__title-field">
          <input
            type="text"
            title="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="note-edit__input"
            style={{
              background: color, // Apply the selected color as the background
            }}
          />
        </div>

        {/* Color Options */}
        <div className="note-edit__color-options">
          <div className="note-edit__color-options-container">
            {[
              "#ffe5e5", // Soft pink
              "#fff5e6", // Soft peach
              "#e6ffe6", // Soft green
              "#f5f5f5", // Very light gray
              "#e6f7ff", // Soft blue
              "#f9e6ff", // Soft lavender
            ].map((colorOption) => (
              <div
                key={colorOption}
                className={`note-edit__color-option ${
                  color === colorOption
                    ? "note-edit__color-option--selected"
                    : ""
                }`}
                style={{
                  backgroundColor: colorOption,
                }}
                onClick={() => setColor(colorOption)} // Change color state
                title={`Color ${colorOption}`}
              ></div>
            ))}
          </div>
        </div>
      </div>

      <div className="note-edit__content-field">
        <div
          ref={editorRef}
          className="note-edit__quill-editor"
          style={{
            background: color, // Apply selected color to the editor
          }}
        />
      </div>

      <div className="note-edit__tags">
        <input
          type="text"
          value={tags}
          placeholder="Tags: comma-separated.."
          onChange={(e) => setTags(e.target.value)}
          required
          className="note-edit__tags-input"
          style={{
            background: color, // Apply selected color to the background
          }}
        />
      </div>

      <div className="note-edit__actions">
        <button
          onClick={handleSave}
          disabled={loading}
          className="note-edit__save-button"
        >
          {loading ? "Saving..." : "Save"}
        </button>
        <button
          onClick={() => {
            navigate("/notes");
          }}
          disabled={loading}
          className="note-edit__cancel-button"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
