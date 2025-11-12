import React from 'react';
import UserMenu from '../auth/UserMenu';
import DarkModeButon from '../miniOptions/DarkModeButon';
import './Header.css';

const Header = ({ user, onLoginClick, onProfileClick, onLogout, isDarkMode, onDarkModeToggle }) => {
  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <h1>Ecocycle</h1>
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
          <DarkModeButon isDarkMode={isDarkMode} onToggle={onDarkModeToggle} />
          <button className="btn-icon">🔍</button>
          <button className="btn-icon">🛒</button>
          {user ? (
            <UserMenu user={user} onLogout={onLogout} onProfileClick={onProfileClick} />
          ) : (
            <button className="btn-primary" onClick={onLoginClick}>
              Mon compte
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
