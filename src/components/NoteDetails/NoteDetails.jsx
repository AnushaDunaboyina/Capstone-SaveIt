import React, { useState } from "react";
import "./NoteDetails.scss";
import editNote from "../../assets/icons/edit1.png";
import deleteNote from "../../assets/icons/delete.png";

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

      <div className="note-details__action-buttons">
        {showActions && (
          <div className="note-details__actions">
            <img
              src={editNote}
              alt="Edit"
              className="note-details__action-icon"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(note);
              }}
            />

            <img
              src={deleteNote}
              alt="Delete"
              className="note-details__action-icon"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(note);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
