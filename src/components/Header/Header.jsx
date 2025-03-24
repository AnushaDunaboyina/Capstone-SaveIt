import React from "react";
import { Link } from "react-router-dom";
import "./Header.scss";
import logo from "../../assets/logos/saveit-logo7.png";
import calendar from "../../assets/icons/calendar.png";

export default function Header() {
  return (
    <nav className="header">
      <ul className="header__list">
        <div>
          <li className="header__logo header__list">
            <Link to="/" className="header__link header__link--logo">
              <img className="header__logo" src={logo} alt="Save It logo" />
            </Link>
          </li>
        </div>

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
        <div className="header__item">
          <Link to="/calendar" className="header__link">
            <img
              className="header__calendar-icon"
              src={calendar}
              alt="calendar icon"
              title="Calendar"
            />
          </Link>
        </div>
      </ul>
    </nav>
  );
}
