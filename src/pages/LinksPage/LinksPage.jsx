import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DeleteModal from "../../components/DeleteModal/DeleteModal";
import LinkList from "../../components/LinksList/LinksList";
import { API_URL } from "../../config";
import axios from "axios";
import "./LinksPage.scss";

import addLink from "../../assets/icons/add-link.png";
import sort from "../../assets/icons/sort.png";

export default function LinksPage() {
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
    if (sortBy === "createdAt") {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    } else if (sortBy === "title") {
      return sortOrder === "asc"
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title);
    }
    return 0;
  });

  const displayedLinks = viewAll ? sortedLinks : sortedLinks.slice(0, 3);

  return (
    <main className="main-content">
      <div className="links-page">
        <h2 className="links-page__title">Welcome to Links Page</h2>

        <div className="links-page__header-container">
          <div className="links-page__toolbar">
            <div className="links-page__search-bar">
              <input
                type="text"
                className="links-page__search-bar-input"
                placeholder="Search links..."
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <span className="links-page__search-bar-icon">🔍</span>
            </div>

            <div className="links-page__sorting-controls">
              <img
                className="links-page__sort-icon"
                src={sort}
                alt="Sort icon"
                title="Sort by"
              />

              <div className="links-page__sort-buttons">
                <select
                  id="sortBy"
                  className="links-page__sort-by"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option className="links-page__sort-option" value="createdAt">
                    Date
                  </option>
                  <option className="links-page__sort-option" value="title">
                    Title
                  </option>
                </select>

                <select
                  id="sortOrder"
                  className="links-page__sort-order"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                >
                  <option className="links-page__sort-option" value="desc">
                    Desc
                  </option>
                  <option className="links-page__sort-option" value="asc">
                    Asc
                  </option>
                </select>
              </div>
            </div>

            <div className="links-page__add-link">
              <img
                src={addLink}
                alt="Add Link"
                title="Add Link"
                className="links-page__add-link-icon"
                onClick={() => navigate("/links/add")}
              />
            </div>
          </div>

          <div className="links-page__divider"></div>

          <div className="links-page__view-all">
            {!viewAll ? (
              <button
                className="links-page__view-all-button"
                onClick={() => setViewAll(true)}
              >
                View All
              </button>
            ) : (
              <button
                className="links-page__show-less-button"
                onClick={() => setViewAll(false)}
              >
                Show Less
              </button>
            )}
          </div>
        </div>

        <div>
          <LinkList
            links={displayedLinks}
            onEdit={(id) => navigate(`/links/${id}/edit`)}
            onDelete={(link) => {
              setDeleteLink(link);
              setShowDeleteModal(true);
            }}
          />
        </div>

        {showDeleteModal && (
          <DeleteModal
            show={showDeleteModal}
            onClose={() => setShowDeleteModal(false)}
            onConfirm={() => handleDelete(deleteLink.id)}
            itemName={deleteLink?.title}
          />
        )}
      </div>
    </main>
  );
}
