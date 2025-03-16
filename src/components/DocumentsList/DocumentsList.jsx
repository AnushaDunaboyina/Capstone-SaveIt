import axios from "axios";
import React, { useState, useEffect } from "react";
import { API_URL } from "../../config";

export default function DocumentList() {
  const [documents, setDocuments] = useState([]);
  const [viewAll, setViewAll] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/documents`);
        setDocuments(response.data);
      } catch (err) {
        setError("Failed to fetch documents.");
      } finally {
        setLoading(false);
      }
    };
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

  // Show the latest 3 documents or all documents based on viewAll state
  const displayDocuments = viewAll
    ? sortedDocuments
    : sortedDocuments.slice(0, 3);

  return (
    <>
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
              <p>Filename:{document.filename}</p>
              <p>
                {typeof document.tags === "string"
                  ? document.tags.split(",").join(", ")
                  : document.tags}
              </p>
              <a
                href={document.filepath}
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
