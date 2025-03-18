import axios from "axios";
import React, { useState, useEffect } from "react";
import { API_URL } from "../../config";
import DocumentUploadForm from "../DocumentUploadForm/DocumentUploadForm"; // Import the upload form component
import SearchBar from "../SearchBar/SearchBar";
import { useNavigate } from "react-router-dom";
import DeleteModal from "../DeleteModal/DeleteModal";

export default function DocumentList() {
  const navigate = useNavigate();

  const [documents, setDocuments] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [viewAll, setViewAll] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteDocument, setDeleteDocument] = useState(null);

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
    navigate(`/documents/${document.id}/edit`); // Open the DocumentEdit componet for the selected document
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

        // Safely handle tags, treating undefined/null cases as an empty string
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

  // Replace the local filtering logic in handleSearch with an API call to the /search endpoint.
  // const handleSearch = async (query) => {
  //   console.log("Search query:", query);

  //   if (query.trim() === "") {
  //     setSearchResults(documents); // Reset to all documents if the query is empty
  //   } else {
  //     try {
  //       const response = await axios.get(`${API_URL}/api/documents/search`, {
  //         params: { query },
  //       });
  //       console.log("Filtered results from backend:", response.data);
  //       setSearchResults(response.data); // Use backend response for search results
  //     } catch (err) {
  //       console.error("Error fetching search results:", err);
  //       setSearchResults([]); // Clear results if there's an error
  //     }
  //   }
  // };

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

  // Sort and limit searchResults
  const displayDocuments = viewAll
    ? [...searchResults].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      ) // Sort searchResults
    : [...searchResults]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 3); // Show top 3

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
                <p>
                  Tags:{" "}
                  {Array.isArray(document.tags)
                    ? document.tags.join(", ") // For arrays
                    : typeof document.tags === "string" &&
                      document.tags.startsWith("[")
                    ? JSON.parse(document.tags).join(", ") // Parse JSON strings
                    : "No tags"}
                </p>
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
