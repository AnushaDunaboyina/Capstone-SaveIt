import React from "react";
import "./LinkDetails.scss";

const LinkDetails = ({ link, showActions, onEdit, onDelete }) => {
  return (
    <div className="link-details">
      <h3>{link.title}</h3>
      <p>{link.description}</p>
      <a href={link.url} target="_blank" rel="noopener noreferrer">
        {link.url}
      </a>
      {link.tags && link.tags.length > 0 && (
        <div className="link-tags">
            <p>Tags:</p>
            <ul>
                {link.tags.map((tag, index) => (
                    <li key={index} className="link-tag">{tag}</li>
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
};

export default LinkDetails;
