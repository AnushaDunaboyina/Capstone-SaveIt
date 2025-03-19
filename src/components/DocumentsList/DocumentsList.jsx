import axios from "axios";
import React, { useState, useEffect } from "react";
import { API_URL } from "../../config";
import DocumentUploadForm from "../DocumentUploadForm/DocumentUploadForm"; // Import the upload form component
import SearchBar from "../SearchBar/SearchBar";
import { useNavigate } from "react-router-dom";
import DeleteModal from "../DeleteModal/DeleteModal";
import "./DocumentsList.scss";

export default function DocumentList() {
  const navigate = useNavigate();

  const [documents, setDocuments] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [viewAll, setViewAll] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteDocument, setDeleteDocument] = useState(null);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");

  // Function to fetch documents
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

  // Fetch documents when the component is mounted
  useEffect(() => {
    fetchDocuments();
  }, []);

  // Handle Edit document
  const handleEditDocument = (document) => {
    navigate(`/documents/${document.id}/edit`);
  };

  // Handle Search Query
  const handleSearch = (query) => {
    if (query.trim() === "") {
      setSearchResults(documents); // Reset to all documents if the query is empty
    } else {
      const filtered = documents.filter((doc) => {
        const filenameMatches = doc.filename
          .toLowerCase()
          .includes(query.toLowerCase());

        const tags =
          typeof doc.tags === "string"
            ? doc.tags
            : JSON.stringify(doc.tags || []);
        const tagsMatches = tags.toLowerCase().includes(query.toLowerCase());

        return filenameMatches || tagsMatches;
      });

      setSearchResults(filtered); // Update the search results
    }
  };

  // Function to Delete Document
  const handleDeleteClick = (document) => {
    setDeleteDocument(document); // Stor the document to be deleted
    setShowModal(true); // Show the modal
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await axios.delete(
        `${API_URL}/api/documents/${deleteDocument.id}`
      );
      alert("Document deleted successfully!");
      setShowModal(false); // Close the modal
      fetchDocuments(); // refresh the list
      console.log(response.data);
    } catch (err) {
      console.error("Error deleting document:", err);
      alert("Failed to delete the document.");
    }
  };

  if (loading) {
    return <p>Loading documents...</p>;
  }
  if (error) {
    return <p className="error">{error}</p>;
  }

  // Sorting the documents
  const sortedDocuments = [...searchResults].sort((a, b) => {
    let comparison = 0;
    if (sortBy === "createdAt") {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      comparison = dateB - dateA; // Sorting in descending order initially
    } else if (sortBy === "filename") {
      comparison = a.filename.localeCompare(b.filename);
    }

    // Apply sort order (ascending or descending)
    return sortOrder === "asc" ? comparison : -comparison;
  });

  const displayDocuments = viewAll
    ? sortedDocuments
    : sortedDocuments.slice(0, 3);
    

  return (
    <>
      <div>
        <SearchBar
          onSearch={handleSearch}
          placeholder="Search by filename or tags..."
        />
      </div>

      <div>
        <h2>Upload a Document</h2>
        <DocumentUploadForm onUploadSuccess={fetchDocuments} />
      </div>
      <div>
        <div className="sorting-controls">
          <label htmlFor="sortBy">Sort by:</label>
          <select
            id="sortBy"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="createdAt">Date</option>
            <option value="filename">Filename</option>
          </select>

          <select
            id="sortOrder"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </div>
        <h2>Documents</h2>
        <div>
          {!viewAll ? (
            <button onClick={() => setViewAll(true)}>View All</button>
          ) : (
            <button onClick={() => setViewAll(false)}>View Sorted</button>
          )}
        </div>
        <ul>
          {displayDocuments.length > 0 ? (
            displayDocuments.map((document) => (
              <li key={document.id}>
                <p>Filename: {document.filename}</p>

                {document.tags && document.tags.length > 0 && (
                  <div className="document-tags">
                    <p>Tags:</p>
                    <ul>
                      {Array.isArray(document.tags)
                        ? document.tags.map((tag, index) => (
                            <li key={index} className="document-tag">
                              {tag}
                            </li>
                          ))
                        : typeof document.tags === "string" &&
                          document.tags.startsWith("[")
                        ? JSON.parse(document.tags).map((tag, index) => (
                            <li key={index} className="document-tag">
                              {tag}
                            </li>
                          ))
                        : "No tags"}
                    </ul>
                  </div>
                )}
                <a
                  href={`http://localhost:5050${document.filepath}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Preview
                </a>
                <button onClick={() => handleEditDocument(document)}>
                  Edit
                </button>

                <button onClick={() => handleDeleteClick(document)}>
                  Delete
                </button>
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
          itemName={deleteDocument?.filename}
        />
      </div>
    </>
  );
}
