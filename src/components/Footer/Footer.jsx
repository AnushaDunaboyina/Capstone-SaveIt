import React from "react";
import "./Footer.scss";

import gmail from "../../assets/icons/gmail.png";
import github from "../../assets/icons/github.png";
import linkedin from "../../assets/icons/linkedin.png";
import facebook from "../../assets/icons/facebook.png";
import instagram from "../../assets/icons/instagram.png";


const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__container">
        

        <div className="footer__social">
          <a href="mailto:anusha.dunaboyina@gmail.com" target="_blank">
            <img src={gmail} alt="Email" />
          </a>
          <a href="https://github.com/AnushaDunaboyina/" target="_blank">
            <img src={github} alt="GitHub" />
          </a>
          <a href="https://www.linkedin.com/in/anusha-dunaboyina/" target="_blank">
            <img src={linkedin} alt="LinkedIn" />
          </a>
          <a href="https://facebook.com/your-profile" target="_blank">
            <img src={facebook} alt="Facebook" />
          </a>
          <a href="https://instagram.com/your-profile" target="_blank">
            <img src={instagram} alt="Instagram" />
          </a>
        </div>

        <div className="footer__copy">
          <p>© 2025 SaveIt. All rights reserved.</p>
        </div>

        <div className="footer__contact">
          <p>anusha.dunaboyina@gmail.com</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
