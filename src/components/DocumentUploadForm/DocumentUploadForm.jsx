import React, { useState, useEffect } from 'react'; // Need state management to track form inputs (file, filename, tags)
import axios from "axios"; // axios used to send http requests to the backend
import { API_URL } from "../../App"; // API_URL is the base URL

const DocumentUploadForm = () => {
    const [file, setFile] = useState(null);
    const [filename, setFilename] = useState('');
    const [tags, setTags] = useState('');
    const [loading, setLoading] = useState(false); // A flsg to shoe loading state while the file is loading
    const [error, setError] = useState(null); // Stores any error message if the upload fails

    // Handling user input

    // Event handler to update the "file" state when a user selects a file
    const handleFileChange = (e) => {
        setFile(e.target.files[0]); // gets the selected file and stores it in 'file'
    }

    const handleFilenameChange = (e) => {
        setFilename(e.target.value);
    }

    const handleTagsChange = (e) => {
        setTags(e.target.value);
    }

  return (
    <form onSubmit={handleUpload}>

        <div>
            <label>File:</label>
            <input type="file" onChange={handleFileChange} />
        </div>

        <div>
            <label>Filename:</label>
            <input type="text" value={filename} onChange={handleFilenameChange} />
        </div>

        <div>
            <label>Tags (comma seperated)</label>
            <input type="text" value={tags} onChange={handleTagsChange} />
        </div>

    </form>
  )
}

export default DocumentUploadForm;