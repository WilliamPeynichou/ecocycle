import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="footer-title">🚴‍♂️ BikeShop</h3>
            <p className="footer-description">
              Votre spécialiste vélo depuis 2020. Qualité, service et passion du cyclisme.
            </p>
            <div className="social-links">
              <a href="#" className="social-link">📘</a>
              <a href="#" className="social-link">🐦</a>
              <a href="#" className="social-link">📷</a>
              <a href="#" className="social-link">💼</a>
            </div>
          </div>
          
          <div className="footer-section">
            <h4 className="footer-subtitle">Vélos</h4>
            <ul className="footer-links">
              <li><a href="#vtt">VTT</a></li>
              <li><a href="#route">Route</a></li>
              <li><a href="#ville">Ville</a></li>
              <li><a href="#electrique">Électrique</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4 className="footer-subtitle">Services</h4>
            <ul className="footer-links">
              <li><a href="#reparation">Réparation</a></li>
              <li><a href="#entretien">Entretien</a></li>
              <li><a href="#livraison">Livraison</a></li>
              <li><a href="#garantie">Garantie</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4 className="footer-subtitle">Support</h4>
            <ul className="footer-links">
              <li><a href="#aide">Centre d'aide</a></li>
              <li><a href="#contact">Contact</a></li>
              <li><a href="#faq">FAQ</a></li>
              <li><a href="#guide">Guide d'achat</a></li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p className="footer-copyright">
            © 2024 BikeShop. Tous droits réservés.
          </p>
          <p className="footer-made-with">
            Fait avec ❤️ pour le cyclisme
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
