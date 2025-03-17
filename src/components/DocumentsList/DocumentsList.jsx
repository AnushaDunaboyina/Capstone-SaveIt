import axios from "axios";
import React, { useState, useEffect } from "react";
import { API_URL } from "../../config";
import DocumentUploadForm from "../DocumentUploadForm/DocumentUploadForm"; // Import the upload form component
import SearchBar from "../SearchBar/SearchBar";

export default function DocumentList() {
  const [documents, setDocuments] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [viewAll, setViewAll] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingDocument, setEditingDocument] = useState(null);

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
    setEditingDocument(document); // Open the DocumentEdit componet for the selected document
  };

  // Handle Cancel Edit document
  const handleCancelEditDocument = () => {
    setEditingDocument(null);
  };

  // Handle Save Edit document
  // const handleSaveEdit

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

  if (loading) {
    return <p>Loading documents...</p>;
  }
  if (error) {
    return <p className="error">{error}</p>;
  }

  // // Sort documents by createdAt (newest first)
  // const sortedDocuments = [...documents].sort(
  //   (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  // );

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
        {/* Pass the refresh function as a prop to DocumentUploadForm */}
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
                <a
                  href={`http://localhost:5050${document.filepath}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Preview Document
                </a>
              </li>
            ))
          ) : (
            <p>No documents found.</p>
          )}
        </ul>
      </div>
    </>
  );
}
