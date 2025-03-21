import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../../components/SearchBar/SearchBar";
import DeleteModal from "../../components/DeleteModal/DeleteModal";
import NotesList from "../../components/NotesList/NotesList"; // Reusable NotesList Component
import { API_URL } from "../../config";
import axios from "axios";

export default function NotesPage() {
  const [notes, setNotes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewAll, setViewAll] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteNote, setDeleteNote] = useState(null);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedNote, setSelectedNote] = useState(null);

  const navigate = useNavigate();

  // Fetch notes from the backend
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/notes`, {
          params: { search: searchQuery },
        });
        // console.log("Filtered Notes:", response.data);
        setNotes(response.data);
      } catch (error) {
        console.error("Failed to fetch notes:", error);
      }
    };
    fetchNotes();
  }, [searchQuery]);

  // Handle delete note
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/notes/${id}`);
      setNotes(notes.filter((note) => note.id !== id));
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Failed to delete note:", error);
    }
  };

  // Sorting the notes
  const sortedNotes = [...notes].sort((a, b) => {
    if (sortBy === "createdAt") {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    } else if (sortBy === "title") {
      return sortOrder === "asc"
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title);
    }
    return 0;
  });

  const displayedNotes = viewAll ? sortedNotes : sortedNotes.slice(0, 3);

  return (
    <div className="notes-page">
      <h2>NOTES</h2>
      <div>
        <SearchBar onSearch={setSearchQuery} placeholder="Search notes..." />
      </div>
      <div>
        <button onClick={() => navigate("/notes/add")} className="add-button">
          Add Note
        </button>
      </div>

      <div className="sorting-controls">
        <label htmlFor="sortBy">Sort by:</label>
        <select
          id="sortBy"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="createdAt">Date</option>
          <option value="title">Title</option>
        </select>

        <select
          id="sortOrder"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="desc">Desc</option>
          <option value="asc">Asc</option>
        </select>
      </div>
      <div>
        {!viewAll ? (
          <button onClick={() => setViewAll(true)}>View All</button>
        ) : (
          <button onClick={() => setViewAll(false)}>Show Less</button>
        )}
      </div>
      <div></div>
      <NotesList
        notes={displayedNotes}
        onEdit={(id) => navigate(`/notes/${id}/edit`)}
        onDelete={(note) => {
          setDeleteNote(note);
          setShowDeleteModal(true);
        }}
        onView={(note) => {
          {
            note.title;
          }
        }}
      />

      {showDeleteModal && (
        <DeleteModal
          show={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={() => handleDelete(deleteNote.id)}
          itemName={deleteNote?.title}
        />
      )}
    </div>
  );
}
