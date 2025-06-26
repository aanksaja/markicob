import React from 'react';
import './Footer.css';

const Button = () => {
  return (
    <footer className="footer">
      <p>
        &copy; {new Date().getFullYear()} Aplikasi Frontend Saya. Semua Hak
        Cipta Dilindungi.
      </p>
    </footer>
  );
};

export default Button;