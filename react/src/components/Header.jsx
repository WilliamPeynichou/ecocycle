import React from 'react';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <h1>🚴‍♂️ BikeShop</h1>
        </div>
        <nav className="navigation">
          <ul className="nav-list">
            <li><a href="#accueil">Accueil</a></li>
            <li><a href="#velos">Vélos</a></li>
            <li><a href="#accessoires">Accessoires</a></li>
            <li><a href="#reparation">Réparation</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </nav>
        <div className="header-actions">
          <button className="btn-icon">🔍</button>
          <button className="btn-icon">🛒</button>
          <button className="btn-primary">Mon compte</button>
        </div>
      </div>
    </header>
  );
};

export default Header;
