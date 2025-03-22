import axios from "axios";
import React, { useState, useEffect } from "react";
import { API_URL } from "../../config";
import DocumentUploadForm from "../DocumentUploadForm/DocumentUploadForm";
import SearchBar from "../SearchBar/SearchBar";
import { useNavigate } from "react-router-dom";
import DeleteModal from "../DeleteModal/DeleteModal";
import "./DocumentsList.scss";

import sort from "../../assets/icons/sort.png";
import addDocument from "../../assets/icons/add-file.png";
import editDocument from "../../assets/icons/edit1.png";
import deleteDocument from "../../assets/icons/delete.png";

export default function DocumentList() {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [viewAll, setViewAll] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteDoc, setDeleteDoc] = useState(null);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/documents`);
        setDocuments(response.data);
        setSearchResults(response.data);
      } catch (err) {
        setError("Failed to fetch documents.");
      } finally {
        setLoading(false);
      }
    };
    fetchDocuments();
  }, []);

  const handleEditDocument = (document) => {
    navigate(`/documents/${document.id}/edit`);
  };

  const handleDeleteClick = (document) => {
    setDeleteDoc(document);
    setShowModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`${API_URL}/api/documents/${deleteDoc.id}`);
      setShowModal(false);
      setDocuments(documents.filter((doc) => doc.id !== deleteDoc.id));
      setSearchResults(searchResults.filter((doc) => doc.id !== deleteDoc.id));
    } catch (err) {
      console.error("Error deleting document:", err);
      alert("Failed to delete the document.");
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setSearchResults(
      query.trim()
        ? documents.filter(
            (doc) =>
              doc.filename.toLowerCase().includes(query.toLowerCase()) ||
              JSON.stringify(doc.tags || [])
                .toLowerCase()
                .includes(query.toLowerCase())
          )
        : documents
    );
  };

  if (loading) return <p>Loading documents...</p>;
  if (error) return <p className="error">{error}</p>;

  const sortedDocuments = [...searchResults].sort((a, b) => {
    let comparison =
      sortBy === "filename"
        ? a.filename.localeCompare(b.filename)
        : new Date(b.createdAt) - new Date(a.createdAt);
    return sortOrder === "asc" ? comparison : -comparison;
  });

  const displayDocuments = viewAll
    ? sortedDocuments
    : sortedDocuments.slice(0, 3);

  return (
    <div className="documents-list">
      <div className="documents-list__header">
        <div className="documents-list__toolbar">
          <div className="documents-list__search-bar">
            <input
              type="text"
              className="documents-list__search-bar-input"
              placeholder="Search by filename or tags..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
            <span className="documents-list__search-bar-icon">🔍</span>
          </div>

          <div className="documents-list__sorting-controls">
            <img className="documents-list__sort-icon" src={sort} alt="Sort" />
            <select
              className="documents-list__sort-by"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="createdAt">Date</option>
              <option value="filename">Filename</option>
            </select>
            <select
              className="documents-list__sort-order"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="desc">Desc</option>
              <option value="asc">Asc</option>
            </select>
          </div>

          <div className="documents-list__upload">
            <DocumentUploadForm
              onUploadSuccess={() => setSearchResults([...documents])}
            />
          </div>
        </div>

        <div className="documents-list__header-divider"></div>
        <div>
          {!viewAll ? (
            <button onClick={() => setViewAll(true)}>View All</button>
          ) : (
            <button onClick={() => setViewAll(false)}>View Sorted</button>
          )}
        </div>
      </div>

      <div className="documents-list__items-container">
        <ul className="documents-list__items">
          {displayDocuments.length > 0 ? (
            displayDocuments.map((document) => (
              <li key={document.id} className="documents-list__item">
                <p className="documents-list__filename">
                  Filename: {document.filename}
                </p>
                {document.tags?.length > 0 && (
                  <ul className="documents-list__tags-list">
                    {JSON.parse(
                      typeof document.tags === "string"
                        ? document.tags
                        : JSON.stringify(document.tags)
                    ).map((tag, index) => (
                      <li key={index} className="documents-list__tag-item">
                        {tag}
                      </li>
                    ))}
                  </ul>
                )}
                <a
                  className="documents-list__file-preview"
                  href={`http://localhost:5050${document.filepath}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Preview
                </a>
                <img
                  className="documents-list__icon documents-list__icon--edit"
                  src={editDocument}
                  alt="Edit"
                  onClick={() => handleEditDocument(document)}
                />
                <img
                  className="documents-list__icon documents-list__icon--delete"
                  src={deleteDocument}
                  alt="Delete"
                  onClick={() => handleDeleteClick(document)}
                />
              </li>
            ))
          ) : (
            <p>No documents found.</p>
          )}
        </ul>
        <DeleteModal
          show={showModal}
          onClose={() => setShowModal(false)}
          onConfirm={handleConfirmDelete}
          itemName={deleteDoc?.filename}
        />
      </div>
    </div>
  );
}
