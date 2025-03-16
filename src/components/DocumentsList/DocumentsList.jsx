import axios from "axios";
import React, { useState, useEffect } from "react";
import { API_URL } from "../../config";
import DocumentUploadForm from "../DocumentUploadForm/DocumentUploadForm"; // Import the upload form component
console.log("Rendering DocumentList");

export default function DocumentList() {
  const [documents, setDocuments] = useState([]);
  const [viewAll, setViewAll] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch documents
  const fetchDocuments = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/documents`);
      console.log("Fetched documents:", response.data); // Debug log
      setDocuments(response.data);
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

  if (loading) {
    return <p>Loading documents...</p>;
  }
  if (error) {
    return <p className="error">{error}</p>;
  }

  // Sort documents by createdAt (newest first)
  const sortedDocuments = [...documents].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
  console.log("Sorted Documents:", sortedDocuments); // Debug log

  // Show the latest 3 documents or all documents based on viewAll state
  const displayDocuments = viewAll
    ? sortedDocuments
    : sortedDocuments.slice(0, 3);
  console.log("Displayed Documents:", displayDocuments); // Debug log

  return (
    <>
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
          {displayDocuments.map((document) => (
            
            <li key={document.id}>
              <p>Filename: {document.filename}</p>
              <p>
                {typeof document.tags === "string"
                  ? document.tags.split(",").join(", ")
                  : document.tags}
              </p>
              <a
                href={`http://localhost:5050${document.filepath}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Preview Document
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
