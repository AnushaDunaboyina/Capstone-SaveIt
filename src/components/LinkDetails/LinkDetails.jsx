import React from "react";
import "./LinkDetails.scss";

export default function LinkDetails({ link, showActions, onEdit, onDelete }) {
  return (
    <div className="link-details">
      <h3>{link.title}</h3>
      <p>{link.displayDate}</p>
      <p>{link.description}</p>

      <a href={link.url} target="_blank" rel="noopener noreferrer">
        {link.url}
      </a>

      {/* Display the thumbnail */}
      {link.thumbnail && (
        <div className="thumbnail-container">
          <img
            src={
              link.thumbnail ||
              "http://localhost:5050/assets/default-thumbnail1.jpg"
            }
            alt={`${link.title} Thumbnail`}
            className="link-thumbnail"
            onError={(e) => {
              if (!e.target.src.includes("default-thumbnail1.jpg")) {
                e.target.src =
                  "http://localhost:5050/assets/default-thumbnail1.jpg"; // Apply fallback
              }
            }}
          />
        </div>
      )}

      {link.tags && link.tags.length > 0 && (
        <div className="link-tags">
          <ul>
            {link.tags.map((tag, index) => (
              <li key={index} className="link-tag">
                {tag}
              </li>
            ))}
          </ul>
        </div>
      )}
      {showActions && (
        <div className="link-actions">
          <button onClick={onEdit} className="edit-button">
            Edit
          </button>
          <button onClick={onDelete} className="delete-button">
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
