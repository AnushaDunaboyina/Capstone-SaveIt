import React from "react";
import "./NoteDetails.scss"; 

export default function NoteDetails({ note, showActions, onEdit, onDelete }) {
  return (
    <div className="note-details" style={{ backgroundColor: note.color }}> {/* Apply note color */}
      <h3>{note.title}</h3>
      {/* <p className="note-date">Created on: {note.createdAt}</p> */}
      <p>Created on: {note.displayDate}</p>
      <p>
        {note.content.split("\n").map((line, index) => ( // Handle bullet points
          <span key={index}>
            {line}
            <br />
          </span>
        ))}
      </p>
      {note.tags && note.tags.length > 0 && (
        <div className="note-tags">
          <p>Tags:</p>
          <ul>
            {note.tags.map((tag, index) => (
              <li key={index} className="note-tag">{tag}</li>
            ))}
          </ul>
        </div>
      )}
      {showActions && (
        <div className="note-actions">
          <button onClick={onEdit} className="edit-button">
            Edit
          </button>
          <button onClick={onDelete} className="delete-button">
            Delete
          </button>
        </div>
      )}
    </div>
  );
};
