import { useParams, useNavigate } from "react-router-dom";
import React, { useState, useEffect, useRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css"; // Import Quill's styling
import axios from "axios";
import { API_URL } from "../../config";
import "./NoteEdit.scss";

import back from "../../assets/icons/back3.png";
import accept from "../../assets/icons/Accept.png";
import discard from "../../assets/icons/discard.png";

export default function NoteEdit() {
  const { id } = useParams(); // Extract the note ID from the URL
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [color, setColor] = useState("#ffffff"); // Default color
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [originalContent, setOriginalContent] = useState("");
  const [showSuggestion, setShowSuggestion] = useState(false);

  const editorRef = useRef(null); // Reference for the editor container
  let quillInstance = useRef(null); // Reference for the Quill instance

  // Fetch existing note details
  useEffect(() => {
    const fetchNote = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/notes/${id}`);
        setTitle(response.data.title);
        setContent(response.data.content);
        setColor(response.data.color || "#ffffff");
        setTags(
          Array.isArray(response.data.tags) ? response.data.tags.join(", ") : ""
        );

        // Set content in Quill editor if it's already initialized
        if (quillInstance.current) {
          quillInstance.current.root.innerHTML = response.data.content; // Set initial HTML content
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

      // Listen for content changes and save plain text
      quillInstance.current.on("text-change", () => {
        const plainTextContent = quillInstance.current.getText().trim(); // Extract plain text
        setContent(plainTextContent); // Update state with plain text
      });
    }

    return () => {
      if (quillInstance.current) {
        quillInstance.current.off("text-change");
      }
    };
  }, []);

  // Handle AI feature (Grammar Correction or Summarization)
  const handleAIProcess = async (task) => {
    if (!content.trim()) {
      setError("Content cannot be empty for AI processing.");
      return;
    }

    try {
      setAiLoading(true);
      setError(null);
      setOriginalContent(content); // Save original content before AI processing

      const response = await axios.post(`${API_URL}/api/notes/process-ai`, {
        content: content.trim(),
        task,
      });

      const bestSuggestion = response.data.processedContent.trim();
      if (bestSuggestion !== content.trim()) {
        quillInstance.current.root.innerHTML = bestSuggestion; // Update editor content
        setContent(bestSuggestion); // Sync state
        setShowSuggestion(true); // Show Accept/Discard buttons
      } else {
        setError("No changes detected. The content might already be correct.");
      }
    } catch (err) {
      setError("Failed to process content with AI. Please try again.");
    } finally {
      setAiLoading(false);
    }
  };

  // Accept the AI suggestion
  const handleAcceptSuggestion = () => {
    setShowSuggestion(false); // Hide Accept/Discard buttons
  };

  // Discard the AI suggestion and revert to original content
  const handleDiscardSuggestion = () => {
    if (!originalContent) {
      setError("No original content to restore.");
      return;
    }

    quillInstance.current.root.innerHTML = originalContent; // Restore original content in editor
    setContent(originalContent); // Sync state
    setShowSuggestion(false); // Hide Accept/Discard buttons
  };

  // Save the edited note
  const handleSave = async () => {
    if (!title.trim() || !content.trim() || !tags.trim()) {
      setError("All fields must be filled.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const plainTextContent = quillInstance.current.getText().trim(); // Get plain text content
      const updatedTags = tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag);

      const payload = {
        title: title.trim(),
        content: plainTextContent, // Save plain text to the backend
        color: color.trim(),
        tags: updatedTags,
      };

      await axios.patch(`${API_URL}/api/notes/${id}`, payload);
      navigate("/notes");
    } catch (err) {
      setError("Failed to update the note. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="note-edit">
      {/* Back Button */}
      <div className="note-edit__back" onClick={() => navigate("/notes")}>
        <img
          src={back}
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
            style={{
              backgroundColor: color,
            }}
          />
        </div>

        <div className="note-add__color-picker">
          <input
            className="note-add__color-picker-input"
            title="Pick a color"
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          />
        </div>
      </div>

      {/* Quill Editor */}
      <div>
        <div
          ref={editorRef}
          style={{
            height: "300px",
            backgroundColor: color,
          }}
        ></div>
      </div>

      <div className="note-edit__tags">
        <input
          title="tags: comma seperated"
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          required
          className="note-edit__tags-input"
        />
      </div>

      {/* AI Tools */}
      <div className="note-edit__ai-tools">
        <button
          onClick={() => handleAIProcess("grammar_correction")}
          disabled={aiLoading || !content}
          className="note-edit__ai-button"
        >
          {aiLoading ? "Processing Grammar..." : "Correct Grammar"}
        </button>
        <button
          onClick={() => handleAIProcess("summarize")}
          disabled={aiLoading || !content}
          className="note-edit__ai-button"
        >
          {aiLoading ? "Summarizing..." : "Summarize"}
        </button>

        {showSuggestion && (
          <div className="note-edit__suggestions">
            <img
              src={accept}
              alt="Accept Suggestion"
              title="Accept Suggestion"
              className="note-edit__suggestion-icon"
              onClick={handleAcceptSuggestion}
            />
            <img
              src={discard}
              alt="Discard Suggestion"
              title="Discard Suggestion"
              className="note-edit__suggestion-icon"
              onClick={handleDiscardSuggestion}
            />
          </div>
        )}
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
          onClick={() => navigate("/notes")}
          disabled={loading}
          className="note-edit__cancel-button"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
