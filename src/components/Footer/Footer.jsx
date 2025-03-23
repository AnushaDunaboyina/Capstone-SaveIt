import React from "react";
import "./Footer.scss";

import gmail from "../../assets/icons/gmail.png";
import github from "../../assets/icons/github.png";
import linkedin from "../../assets/icons/linkedin.png";
import facebook from "../../assets/icons/facebook.png";
import instagram from "../../assets/icons/instagram.png";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__copy">
          <p className="footer__copy-text">
            © 2025 SaveIt. All rights reserved.
          </p>
        </div>

        <div className="footer__social">
          <a
            className="footer__social-link"
            href="mailto:anusha.dunaboyina@gmail.com"
            target="_blank"
          >
            <img className="footer__social-icon" src={gmail} alt="Email" />
          </a>
          <a
            className="footer__social-link"
            href="https://github.com/AnushaDunaboyina/"
            target="_blank"
          >
            <img className="footer__social-icon" src={github} alt="GitHub" />
          </a>
          <a
            className="footer__social-link"
            href="https://www.linkedin.com/in/anusha-dunaboyina/"
            target="_blank"
          >
            <img
              className="footer__social-icon"
              src={linkedin}
              alt="LinkedIn"
            />
          </a>
          <a
            className="footer__social-link"
            href="https://facebook.com/your-profile"
            target="_blank"
          >
            <img
              className="footer__social-icon"
              src={facebook}
              alt="Facebook"
            />
          </a>
          <a
            className="footer__social-link"
            href="https://instagram.com/your-profile"
            target="_blank"
          >
            <img
              className="footer__social-icon"
              src={instagram}
              alt="Instagram"
            />
          </a>
        </div>

        <div className="footer__contact">
          <p className="footer__contact-info">anusha.dunaboyina@gmail.com</p>
        </div>
      </div>
    </footer>
  );
}
