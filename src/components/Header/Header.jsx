import React from "react";
import { Link } from "react-router-dom";
import "./Header.scss";

export default function Header() {
  return (
    <nav className="header">
      <ul className="header__list">
        <li className="header__logo header__list">
          <Link to="/" className="header__link header__link--logo">
            save-it
          </Link>
        </li>
        <div className="header__nav">
          <li className="header__item">
            <Link to="/" className="header__link">
              <button className="header__button">home</button>
            </Link>
          </li>
          <li className="header__item">
            <Link to="/notes" className="header__link">
              <button className="header__button">notes</button>
            </Link>
          </li>
          <li className="header__item">
            <Link to="/links" className="header__link">
              <button className="header__button">links</button>
            </Link>
          </li>
          <li className="header__item">
            <Link to="/documents" className="header__link">
              <button className="header__button">documents</button>
            </Link>
          </li>
        </div>
      </ul>
    </nav>
  );
}
