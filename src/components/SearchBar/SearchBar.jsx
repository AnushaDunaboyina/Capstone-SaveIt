import React from "react";

export default function SearchBar({ onSearch, placeholder = "Search..." }) {

    const handleInputChange = (e) => {
        console.log("User typed:", e.target.value); 
        onSearch(e.target.value);
    }
  return (
    <input type="text" placeholder={placeholder} onChange={handleInputChange} />
  );
}
