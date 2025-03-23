import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../config";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import "./NoteAddForm.scss";
import backButton from "../../assets/icons/back3.png";
import accept from "../../assets/icons/Accept.png";
import discard from "../../assets/icons/discard.png";

export default function NoteAddForm() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [color, setColor] = useState("#ffffff");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [originalContent, setOriginalContent] = useState("");
  const [showSuggestion, setShowSuggestion] = useState(false);

  const editorRef = useRef(null);
  let quillInstance = useRef(null); 

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

      // Listen for content changes
      quillInstance.current.on("text-change", () => {
        const editorContent = quillInstance.current.root.innerHTML;

        setContent(editorContent); 
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
      console.error("Content cannot be empty for AI processing.");
      return;
    }

    try {
      setAiLoading(true);
      setError(null);
      setOriginalContent(content);

      // Send API request
      const response = await axios.post(`${API_URL}/api/notes/process-ai`, {
        content: content.trim(),
        task,
      });

      // Apply AI suggestion
      const bestSuggestion = response.data.processedContent.trim();
      if (bestSuggestion !== content.trim()) {
        quillInstance.current.root.innerHTML = bestSuggestion; 
        setContent(bestSuggestion); 
        setShowSuggestion(true); 
      } else {
        console.warn("No changes detected from AI.");
        setError("No changes detected. The content might already be correct.");
      }
    } catch (err) {
      console.error("Error with AI processing:", err.response || err.message);
      setError("Failed to process content with AI. Please try again.");
    } finally {
      setAiLoading(false);
    }
  };

  // Accept the AI suggestion
  const handleAcceptSuggestion = () => {
    setShowSuggestion(false); 
  };

  // Discard the AI suggestion and revert to original content
  const handleDiscardSuggestion = () => {
    if (!originalContent) {
      setError("No original content to restore.");
      return;
    }

    quillInstance.current.root.innerHTML = originalContent; 
    setContent(originalContent); 
    setShowSuggestion(false); 
  };

  // Save the note
  const handleSave = async () => {
    // Validate fields
    if (!title.trim() || !content.trim() || !tags.trim()) {
      setError("All fields must be filled.");
      console.error("All fields must be filled.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Extract plain text from Quill editor
      const plainTextContent = quillInstance.current.getText().trim(); 

      // Prepare tags for saving
      const updatedTags = tags.split(",").map((tag) => tag.trim());

      // Send data to the backend
      const response = await axios.post(`${API_URL}/api/notes`, {
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
    <div className="note-add">
      <div
        className="note-add__back"
        onClick={() => {
          navigate("/notes");
        }}
      >
        <img
          src={backButton}
          alt="Back button icon"
          className="note-add__back-icon"
          title="Go back"
        />
      </div>

      <h2 className="note-add__title">Add New Note</h2>

      {error && <p className="note-add__error-message">{error}</p>}


      <div className="note-add__title-color-field">
        <div className="note-add__title-field">
          <input
            type="text"
            title="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title.."
            required
            className="note-add__input"
            style={{
              background: color, 
            }}
          />
        </div>

       {/* Color Options  */}
        <div className="note-add__color-options">
          <div className="note-add__color-options-container">
            {[
              "#ffe5e5", // Soft pink
              "#fff5e6", // Soft peach
              "#e6ffe6", // Soft green
              "#f5f5f5", // Very light gray
              "#e6f7ff", // Soft blue
              "#f9e6ff", // Soft lavender
            ].map((colorOption) => {
              return (
                <div
                  key={colorOption}
                  className={`note-add__color-option ${
                    color === colorOption
                      ? "note-add__color-option--selected"
                      : ""
                  }`}
                  style={{ backgroundColor: colorOption }}
                  onClick={() => setColor(colorOption)}
                  title={`Color ${colorOption}`}
                ></div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quill Editor */}
      <div className="note-add__content-field">
        <div
          ref={editorRef}
          className="note-add__quill-editor"
          style={{
            background: color, 
          }}
        />
      </div>

      {/* Tags Field */}
      <div className="note-add__tags">
        <input
          type="text"
          value={tags}
          placeholder="Tags: comma-separated.."
          onChange={(e) => setTags(e.target.value)}
          required
          className="note-add__tags-input"
          style={{
            background: color, 
          }}
        />
      </div>

      {/* AI Tools */}
      <div className="note-add__ai-tools">
        <button
          onClick={() => handleAIProcess("grammar_correction")}
          disabled={aiLoading || !content}
          className="note-add__ai-button"
        >
          {aiLoading ? "Processing Grammar..." : "Correct Grammar"}
        </button>
        <button
          onClick={() => handleAIProcess("summarize")}
          disabled={aiLoading || !content}
          className="note-add__ai-button"
        >
          {aiLoading ? "Summarizing..." : "Summarize"}
        </button>

        {showSuggestion && (
          <div className="note-add__suggestions">
            <img
              src={accept}
              alt="Accept Suggestion"
              title="Accept Suggestion"
              className="note-add__suggestion-icon"
              onClick={handleAcceptSuggestion}
            />
            <img
              src={discard}
              alt="Discard Suggestion"
              title="Discard Suggestion"
              className="note-add__suggestion-icon"
              onClick={handleDiscardSuggestion}
            />
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="note-add__actions">
        <button
          onClick={handleSave}
          disabled={loading}
          className="note-add__save-button"
        >
          {loading ? "Saving..." : "Save"}
        </button>
        <button
          onClick={() => {
            navigate("/notes");
          }}
          disabled={loading}
          className="note-add__cancel-button"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
