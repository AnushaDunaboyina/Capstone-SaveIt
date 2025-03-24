import React from "react";
import { Link } from "react-router-dom";
import "./PageNotFound.scss";
import error404 from "../../assets/images/error.jpg";
import back from "../../assets/icons/back3.png";

export default function PageNotFound() {
  return (
    <main className="main-content">
      <div className="pageNotFound-container">
        <Link to="/">
          <img
            className="pageNotFound__back-image"
            src={back}
            alt="Go back to home page button"
          />
        </Link>
        <img
          className="pageNotFound__error-image"
          src={error404}
          alt="Error: 404 page not found"
        />
      </div>
    </main>
  );
}
