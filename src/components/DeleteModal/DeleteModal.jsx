import React from "react";
import "./DeleteModal.scss";

export default function DeleteModal({ show, onClose, onConfirm, itemName }) {
  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Delete Confirmation</h3>
        <p>Are you sure you want to delete "{itemName}"?</p>
        <div className="modal-buttons">
          <button onClick={onConfirm} className="confirm-button">
            Delete
          </button>
          <button onClick={onClose} className="cancel-button">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
