import React from 'react';
import { Link } from 'react-router-dom';
import logoImg from '../assets/logo_lms.png';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="lms-footer">
      <div className="footer-container">
        
        {/* Left Section: Brand & Logo */}
        <div className="footer-left">
          <div className="footer-brand">
            <img src={logoImg} alt="KGP LMS Logo" className="footer-logo-img" />
            <h3>Knowledge Gain platform KGP</h3>
          </div>
          <p className="footer-tagline">
            Empowering students with flexible, interactive, and technology-driven education for professional and academic excellence.
          </p>
        </div>

        {/* Middle Section: Quick Links & Contact Email */}
        <div className="footer-middle">
          <h4>Explore & Connect</h4>
          <nav className="footer-nav-links" aria-label="Footer Navigation">
            <Link to="/" className="footer-link">Home</Link>
            <Link to="/contact" className="footer-link">Contact Us</Link>
            <a href="mailto:kgplms@sparkle.indevs.in" className="footer-email">
              <span className="email-icon">✉️</span> kgplms@sparkle.indevs.in
            </a>
            <Link to="/privacy" className="footer-link">Privacy Policy</Link>
          </nav>
        </div>

        {/* Right Section: Google Maps Embed */}
        <div className="footer-right">
          <h4>KGP Institute Location</h4>
          <div className="footer-map-container">
            <iframe
              title="KGP Institute Location Map"
              src="https://maps.google.com/maps?q=KGP%20Institute%20Navi%20Mumbai&t=&z=14&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="140"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>

      </div>

      {/* Footer Bottom copyright area */}
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Knowledge Gain Platform KGP. All rights reserved.</p>
      </div>
    </footer>
  );
}
