import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <p>
        &copy; {new Date().getFullYear()} Aplikasi Frontend Saya. Semua Hak
        Cipta Dilindungi.
      </p>
    </footer>
  );
};

export default Footer;
