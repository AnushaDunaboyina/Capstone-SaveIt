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
        console.error ("Error fetching documents.")
      } finally {
        setLoading(false);
      }
    }
    fetchDocuments();
  }, []);

  if(loading) {
    return <p>Loading documents...</p>
  }
  if (error) {
    return <p className='error'>{error}</p>
  }

  // Sort documents by createdAt (newest first)
  const sortedDocuments = [...documents]

}