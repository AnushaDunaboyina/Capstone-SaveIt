import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../../components/SearchBar/SearchBar";
import DeleteModal from "../../components/DeleteModal/DeleteModal";
import LinkList from "../../components/LinksList/LinksList";
import { API_URL } from "../../config";

const LinksPage = () => {
  const [links, setLinks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewAll, setViewAll] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLink, setDeleteLink] = useState(null);

  const navigate = useNavigate();

  // Fetch links from the backend
  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/links?search=${searchQuery}`
        );
        const data = await response.json();
        setLinks(data);
      } catch (error) {
        console.error("Failed to fetch links:", error);
      }
    };
    fetchLinks();
  }, [searchQuery]);

  // Handle delete link
  const handleDelete = async (id) => {
    try {
      await fetch(`${API_URL}/api/links/${id}`, {
        method: "DELETE",
      });
      setLinks(links.filter((link) => link.id !== id));
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Failed to delete link:", error);
    }
  };

  const displayedLinks = viewAll ? links : links.slice(0, 3);

  return (
    <div className="links-page">
      <SearchBar onSearch={setSearchQuery} placeholder="Search links..." />
      <button onClick={() => navigate("/links/add")} className="add-button">
        Add Link
      </button>
      <LinkList
        links={displayedLinks}
        onEdit={(id) => navigate(`/links/${id}/edit`)}
        onDelete={(link) => {
          setDeleteLink(link);
          setShowDeleteModal(true);
        }}
      />

      {!viewAll ? (
        <button onClick={() => setViewAll(true)}>View All</button>
      ) : (
        <button onClick={() => setViewAll(false)}>Show Less</button>
      )}
      {showDeleteModal && (
        <DeleteModal
          show={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={() => handleDelete(deleteLink.id)}
          itemName={deleteLink.title}
        />
      )}
    </div>
  );
};

export default LinksPage;
