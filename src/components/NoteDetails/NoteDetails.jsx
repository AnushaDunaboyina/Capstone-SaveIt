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
      className={`note-details ${isExpanded ? "note-details--expanded" : ""}`}
      style={{ backgroundColor: note.color }}
      onClick={toggleView}
    >
      <div className="note-details__header">
        <h3 className="note-details__title">{note.title}</h3>
        <p className="note-details__date">{note.displayDate}</p>
      </div>
      
      <div className="note-details__divider"></div>

      <div className="note-details__content">
        <p className="note-details__text">
          {isExpanded ? note.content : `${note.content.slice(0, 30)}.....`}
        </p>

        {note.tags && note.tags.length > 0 && (
          <div className="note-details__tags">
            <ul className="note-details__tags-list">
              {note.tags.map((tag, index) => (
                <li key={index} className="note-details__tag-item">
                  {tag}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {showActions && (
        <div className="note-details__actions">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="note-details__edit-button"
          >
            Edit
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="note-details__delete-button"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
