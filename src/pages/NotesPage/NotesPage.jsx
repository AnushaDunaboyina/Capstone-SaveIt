import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DeleteModal from "../../components/DeleteModal/DeleteModal";
import NotesList from "../../components/NotesList/NotesList"; 
import { API_URL } from "../../config";
import axios from "axios";
import "./NotesPage.scss";

import addNote from "../../assets/icons/add-note2.png";
import sort from "../../assets/icons/sort.png";

export default function NotesPage() {
  const [notes, setNotes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewAll, setViewAll] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteNote, setDeleteNote] = useState(null);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");

  const navigate = useNavigate();

  // Fetch notes from the backend
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/notes`, {
          params: { search: searchQuery },
        });

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

  const displayedNotes = viewAll ? sortedNotes : sortedNotes.slice(0, 5);

  return (
    <main className="main-content">
      <div className="notes-page">
        <h2 className="notes-page__title">Welcome to notes page</h2>
        <div className="notes-page__header-container">
          <div className="notes-page__toolbar">
            <div className="notes-page__search-bar">
              <input
                type="text"
                className="notes-page__search-bar-input"
                placeholder="Search notes..."
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <span className="notes-page__search-bar-icon">🔍</span>
            </div>

            <div className="notes-page__sorting-controls">
              <img
                className="notes-page__sort-icon"
                src={sort}
                alt="sort icon"
                title="sort by"
              />

              <div className="notes-page__sort-buttons">
                <select
                  id="Sort by"
                  className="notes-page__sort-by"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option className="notes-page__sort-option" value="createdAt">
                    Date
                  </option>
                  <option className="notes-page__sort-option" value="title">
                    Title
                  </option>
                </select>

                <select
                  id="sortOrder"
                  className="notes-page__sort-order"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                >
                  <option className="notes-page__sort-option" value="desc">
                    Desc
                  </option>
                  <option className="notes-page__sort-option" value="asc">
                    Asc
                  </option>
                </select>
              </div>
            </div>

            <div className="notes-page__add-note">
              <img
                title="Add Note"
                src={addNote}
                alt="Add Note"
                className="notes-page__add-note-icon"
                onClick={() => navigate("/notes/add")}
              />
            </div>
          </div>

          <div className="notes-page__view-all">
            {!viewAll ? (
              <button
                className="notes-page__view-all-button"
                onClick={() => setViewAll(true)}
              >
                View All
              </button>
            ) : (
              <button
                className="notes-page__show-less-button"
                onClick={() => setViewAll(false)}
              >
                Show Less
              </button>
            )}
          </div>
        </div>
        <div>
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
      </div>
    </main>
  );
}
