import React from "react";
import NoteDetails from "../NoteDetails/NoteDetails";
import "./NotesList.scss";

export default function NotesList({ notes, onEdit, onDelete, onView }) {
  return (
    <div className="note-list">
      {notes.map((note) => (
        <NoteDetails
          key={note.id}
          note={note}
          showActions={true}
          onEdit={() => onEdit(note.id)}
          onDelete={() => onDelete(note)}
          onView={() => onView(note)}
        />
      ))}
    </div>
  );
}
