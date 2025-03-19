import React from "react";
import NoteDetails from "../NoteDetails/NoteDetails"; // Component for individual notes

export default function NotesList({ notes, onEdit, onDelete }) {
  return (
    <div className="note-list">
      {notes.map((note) => (
        <NoteDetails
          key={note.id}
          note={note}
          showActions={true}
          onEdit={() => onEdit(note.id)}
          onDelete={() => onDelete(note)}
        />
      ))}
    </div>
  );
};


