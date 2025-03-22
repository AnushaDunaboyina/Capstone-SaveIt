import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../config";

export default function NoteAddForm() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState(""); 
  const [tags, setTags] = useState("");
  const [color, setColor] = useState("#ffffff"); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [bulletMode, setBulletMode] = useState(false); 
  const [aiLoading, setAiLoading] = useState(false); 
  const [originalContent, setOriginalContent] = useState(""); 
  const [showSuggestion, setShowSuggestion] = useState(false); 

  // Handle AI feature (grammar correction or summarization)
  const handleAIProcess = async (task) => {
    try {
      if (!content.trim()) {
        setError("Content cannot be empty for AI processing.");
        return;
      }

      setAiLoading(true);
      setError(null);

      setOriginalContent(content); 

      const response = await axios.post(`${API_URL}/api/notes/process-ai`, {
        content: content.trim(),
        task, 
      });

      const bestSuggestion = response.data.processedContent; 
      setContent(bestSuggestion); 
      setShowSuggestion(true); 
      
    } catch (err) {
      console.error("Error with AI processing:", err);
      setError("Failed to process content with AI. Please try again.");
    } finally {
      setAiLoading(false);
    }
  };

  // Accept the AI suggestion
  const handleAcceptSuggestion = () => {
    setShowSuggestion(false); 
  };

  // Discard the AI suggestion and revert to the original content
  const handleDiscardSuggestion = () => {
    setContent(originalContent); 
    setShowSuggestion(false); 
  };

  // Handle content changes and apply bullet points if enabled
  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  // Handle Enter key for bullet points if bullet mode is active
  const handleKeyDown = (e) => {
    if (bulletMode && e.key === "Enter") {
      e.preventDefault(); 
      setContent((prevContent) => `${prevContent}\n• `); 
    }
  };

  // Save the note
  const handleSave = async () => {
    if (!title.trim() || !content.trim() || !tags.trim()) {
      setError("All fields must be filled.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const updatedTags = tags.split(",").map((tag) => tag.trim());
      await axios.post(`${API_URL}/api/notes`, {
        title: title.trim(),
        content: content.trim(),
        tags: updatedTags,
        color, // Include color
      });

      navigate("/notes");
    } catch (err) {
      console.error("Error adding note:", err);
      setError("Failed to add the note. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="note-add">
      <div onClick={() => navigate("/notes")}>
        <button>Back</button>
      </div>
      <h2>Add New Note</h2>

      {error && <p className="error-message">{error}</p>}

      {/* Color Picker and Bullet Mode Toggle */}
      <div>
        {/* <label>Note Color:</label> */}
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />
        <button
          onClick={() => setBulletMode(!bulletMode)}
          type="button"
          className={bulletMode ? "active" : ""}
        >
          {bulletMode ? "Disable Bullet Points" : "Enable Bullet Points"}
        </button>
      </div>

      {/* Title Field */}
      <div>
        {/* <label>Title:</label> */}
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

      {/* Content Field */}
      <div>
        {/* <label>Content:</label> */}
        <textarea
          value={content}
          onChange={handleContentChange}
          onKeyDown={handleKeyDown}
          placeholder="Type your content here..."
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

      {/* AI Features */}
      <div>
        <button
          onClick={() => handleAIProcess("grammar_correction")}
          disabled={aiLoading || !content}
        >
          {aiLoading ? "Processing Grammar..." : "Correct Grammar"}
        </button>
        <button
          onClick={() => handleAIProcess("summarize")}
          disabled={aiLoading || !content}
        >
          {aiLoading ? "Summarizing..." : "Summarize"}
        </button>
      </div>

      {/* Accept/Discard Buttons */}
      {showSuggestion && (
        <div>
          <button onClick={handleAcceptSuggestion}>Accept Suggestion</button>
          <button onClick={handleDiscardSuggestion}>Discard Suggestion</button>
        </div>
      )}

      {/* Tags Field */}
      <div>
        <label>Tags (comma-separated):</label>
        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          required
        />
      </div>

      {/* Save and Cancel Buttons */}
      <button onClick={handleSave} disabled={loading}>
        {loading ? "Saving..." : "Save"}
      </button>
      <button onClick={() => navigate("/notes")} disabled={loading}>
        Cancel
      </button>
    </div>
  );
}
