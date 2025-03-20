import React from "react";
import "./NoteDetails.scss";
import { useState } from "react";

export default function NoteDetails({
  note,
  showActions,
  onEdit,
  onDelete,
  onView,
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleView = () => {
    setIsExpanded(!isExpanded);
    
    if (!isExpanded && onView) {
      onView(note);
    }
  };

  return (
    <div
      className={`note-details ${isExpanded ? "expanded" : ""}`}
      style={{ backgroundColor: note.color }}
      onClick={toggleView}
    >
     
      
      <h3>{note.title}</h3>
      <p> {note.displayDate}</p>
      <p>{isExpanded ? note.content : `${note.content.slice(0, 10)}...`}</p>
      
      {note.tags && note.tags.length > 0 && (
        <div className="note-tags">
          
          <ul>
            {note.tags.map((tag, index) => (
              <li key={index} className="note-tag">
                {tag}
              </li>
            ))}
          </ul>
        </div>
      )}
      {showActions && (
        <div className="note-actions">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="edit-button"
          >
            Edit
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="delete-button"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
