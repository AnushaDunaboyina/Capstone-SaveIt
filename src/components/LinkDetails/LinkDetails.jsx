import React from "react";
import "./LinkDetails.scss";
import editLink from "../../assets/icons/edit1.png";
import deleteLink from "../../assets/icons/delete.png";

export default function LinkDetails({ link, showActions, onEdit, onDelete }) {
  return (
    <div className="link-details">
      <div className="link-details__header">
        <h3 className="link-details__title">{link.title}</h3>
        <p className="link-details__date">{link.displayDate}</p>
      </div>

      <div className="link-details__divider"></div>

      <p className="link-details__description">{link.description}</p>

      <a
        href={link.url}
        target="_blank"
        rel="noopener noreferrer"
        className="link-details__url"
      >
        {link.url}
      </a>

      {/* Display the thumbnail */}
      {link.thumbnail && (
        <div className="link-details__thumbnail-container">
          <img
            src={
              link.thumbnail ||
              "http://localhost:5050/assets/default-thumbnail1.jpg"
            }
            alt={`${link.title} Thumbnail`}
            className="link-details__thumbnail"
            onError={(e) => {
              if (!e.target.src.includes("default-thumbnail1.jpg")) {
                e.target.src =
                  "http://localhost:5050/assets/default-thumbnail1.jpg";
              }
            }}
          />
        </div>
      )}

      <div className="link-details__tags-action-icons">
        {link.tags && link.tags.length > 0 && (
          <div className="link-details__tags">
            <ul className="link-details__tags-list">
              {link.tags.map((tag, index) => (
                <li key={index} className="link-details__tag-item">
                  {tag}
                </li>
              ))}
            </ul>
          </div>
        )}

        {showActions && (
          <div className="link-details__actions">
            <img
              title="Edit"
              src={editLink}
              alt="Edit"
              className="link-details__action-icon"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(link);
              }}
            />
            <img
              title="Delete"
              src={deleteLink}
              alt="Delete"
              className="link-details__action-icon"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(link);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
