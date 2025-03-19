import React from "react";
import LinkDetails from "../LinkDetails/LinkDetails";

export default function LinkList({ links, onEdit, onDelete }) {
  return (
    <div className="link-list">
      {links.map((link) => (
        <LinkDetails
          key={link.id}
          link={link}
          showActions={true}
          onEdit={() => onEdit(link.id)}
          onDelete={() => onDelete(link)}
        />
      ))}
    </div>
  );
}
