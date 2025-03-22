
import React from "react";

export default function SearchBar({ onSearch, placeholder = "Search..." }) {
  return (
    <input
      type="text"
      placeholder={placeholder}
      onChange={(e) => onSearch(e.target.value)} // Pass the raw input directly
    />
  );
}
