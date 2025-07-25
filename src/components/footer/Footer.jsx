// Footer.jsx
import React from "react";
import logo from "../../assets/logo.jpg"


const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-grid">
        {/* Brand Column */}
        <div className="footer-column">
          <div className="brand-info">
            <div className="logo-container">
              <img src={logo} alt="Digital Pathshala" className="footer-logo" />
              <h3>Digital Pathshala</h3>
            </div>
            <p className="tagline">
              Empowering digital futures through quality education
            </p>
          </div>

          <div className="contact-details">
            <p>
              <span>Location:</span> Itahari, Sunsari, Koshi Province
            </p>
            <p>
              <span>Phone:</span> 9816366094, 9824345939
            </p>
            <p>
              <span>Email:</span> digitalpathshalanp@gmail.com
            </p>
            <p>
              <span>Website:</span> www.digitalpathshalanepal.com
            </p>
            <p>
              <span>PAN:</span> 143009342
            </p>
          </div>
        </div>

        {/* Support Column */}
        <div className="footer-column">
          <h4 className="footer-heading">Support Channels</h4>
          <ul className="support-list">
            <li>
              <i className="fab fa-whatsapp"></i>
              <span>WhatsApp: 9816366094</span>
            </li>
            <li>
              <i className="fab fa-telegram"></i>
              <span>Telegram: 9816366094</span>
            </li>
            <li>
              <i className="fas fa-envelope"></i>
              <span>Email Support</span>
            </li>
            <li>
              <i className="fas fa-headset"></i>
              <span>Chat Support</span>
            </li>
          </ul>
        </div>

        {/* Connect Column */}
        <div className="footer-column">
          <h4 className="footer-heading">Connect With Us</h4>
          <div className="social-grid">
            <a href="facebook.com/profile.php?id=100094408225878" className="social-item">
              <i className="fab fa-facebook-f"></i>
              <span>Facebook</span>
            </a>
            <a href="github.com/maheshbasnet089" className="social-item">
              <i className="fab fa-github"></i>
              <span>GitHub</span>
            </a>
            <a href="https://www.youtube.com/@digitalpathshala999" className="social-item">
              <i className="fab fa-youtube"></i>
              <span>YouTube</span>
            </a>
            <a href="linkedin.com/company/digital-pathshala089" className="social-item">
              <i className="fab fa-linkedin-in"></i>
              <span>LinkedIn</span>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <div className="copyright">
          Copyright © 2025 Digital Pathshala. All rights reserved.
        </div>
        <div className="legal-links">
          <a href="#">Terms & Conditions</a>
          <span>|</span>
          <a href="#">Privacy Policy</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
