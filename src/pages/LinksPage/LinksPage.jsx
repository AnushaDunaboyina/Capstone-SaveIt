import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../../components/SearchBar/SearchBar";
import DeleteModal from "../../components/DeleteModal/DeleteModal";
import LinkList from "../../components/LinksList/LinksList";
import { API_URL } from "../../config";
import axios from "axios";

const LinksPage = () => {
  const [links, setLinks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewAll, setViewAll] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLink, setDeleteLink] = useState(null);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");

  const navigate = useNavigate();

  // Fetch links from the backend
  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/links`, {
          params: { search: searchQuery },
        });
        setLinks(response.data);
      } catch (error) {
        console.error("Failed to fetch links:", error);
      }
    };
    fetchLinks();
  }, [searchQuery]);

  // Handle delete link
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/links/${id}`);
      setLinks(links.filter((link) => link.id !== id));
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Failed to delete link:", error);
    }
  };

  // Sorting the links
  const sortedLinks = [...links].sort((a, b) => {
    // Determine sort order
    let comparison = 0;
    if (sortBy === "createdAt") {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      comparison = dateB - dateA; // Sorting in descending order initially
    } else if (sortBy === "title") {
      comparison = a.title.localeCompare(b.title);
    }

    // Apply sort order (ascending or descending)
    return sortOrder === "asc" ? comparison : -comparison;
  });

  const displayedLinks = viewAll ? sortedLinks : sortedLinks.slice(0, 3);

  return (
    <div className="links-page">
      <div>
        <SearchBar onSearch={setSearchQuery} placeholder="Search links..." />
      </div>
      <div>
        <button onClick={() => navigate("/links/add")} className="add-button">
          Add Link
        </button>
      </div>

      <div className="sorting-controls">
        <label htmlFor="sortBy">Sort by:</label>
        <select
          id="sortBy"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="createdAt">Date</option>
          <option value="title">Title</option>
        </select>

        {/* <label htmlFor="sortOrder">Order:</label> */}
        <select
          id="sortOrder"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </select>
      </div>
      <div>
        {!viewAll ? (
          <button onClick={() => setViewAll(true)}>View All</button>
        ) : (
          <button onClick={() => setViewAll(false)}>Show Less</button>
        )}
      </div>
      <div></div>
      <LinkList
        links={displayedLinks}
        onEdit={(id) => navigate(`/links/${id}/edit`)}
        onDelete={(link) => {
          setDeleteLink(link);
          setShowDeleteModal(true);
        }}
      />

      {showDeleteModal && (
        <DeleteModal
          show={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={() => handleDelete(deleteLink.id)}
          itemName={deleteLink?.title}
        />
      )}
    </div>
  );
};

export default LinksPage;
