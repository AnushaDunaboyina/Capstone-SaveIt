import React from "react";

const LinkDetails = ({ link, showActions, onEdit, onDelete }) => {
  return (
    <div className="link-details">
      <h3>{link.title}</h3>
      <p>{link.description}</p>
      <a href={link.url} target="_blank" rel="noopener noreferrer">
        {link.url}
      </a>
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
