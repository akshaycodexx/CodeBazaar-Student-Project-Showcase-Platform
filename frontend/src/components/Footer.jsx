import React from 'react';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <h3>CodeBazaar</h3>
        <p>© {new Date().getFullYear()} CodeBazaar. All rights reserved.</p>
        <div className="footer-links">
          <a href="#">Terms</a>
          <a href="#">Privacy</a>
          <a href="#">Support</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
