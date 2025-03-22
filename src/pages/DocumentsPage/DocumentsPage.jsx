import React from "react";
import DocumentList from "../../components/DocumentsList/DocumentsList";
import "./DocumentsPage.scss";

const DocumentsPage = () => {
  return (
    <div className="documents-page">
      <h2 className="documents-page__title">Welcome to Documents Page</h2>
      <div className="documents-page__list-container">
        <DocumentList />
      </div>
    </div>
  );
};

export default DocumentsPage;
