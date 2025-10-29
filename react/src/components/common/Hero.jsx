import React from 'react';
import './Hero.css';

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-container">
        <h1>
          Trouvez votre vélo parfait
        </h1>
        <p>
          Découvrez notre sélection de vélos de qualité pour tous les styles et budgets. 
          VTT, route, ville, électrique... Trouvez le vélo qui vous correspond !
        </p>
        <div className="hero-buttons">
          <button className="hero-button primary">Voir les vélos</button>
          <button className="hero-button secondary">Nos services</button>
        </div>
        <div className="hero-stats">
          <div className="hero-stat">
            <div className="hero-stat-number">250+</div>
            <div className="hero-stat-label">Vélos en stock</div>
          </div>
          <div className="hero-stat">
            <div className="hero-stat-number">100+</div>
            <div className="hero-stat-label">Clients satisfaits</div>
          </div>
          <div className="hero-stat">
            <div className="hero-stat-number">15+</div>
            <div className="hero-stat-label">Années d'expérience</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
