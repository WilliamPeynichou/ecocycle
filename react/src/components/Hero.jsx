import React from 'react';
import './Hero.css';

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-container">
        <div className="hero-content">
          <h1 className="hero-title">
            Trouvez votre <span className="highlight">vélo parfait</span>
          </h1>
          <p className="hero-description">
            Découvrez notre sélection de vélos de qualité pour tous les styles et budgets. 
            VTT, route, ville, électrique... Trouvez le vélo qui vous correspond !
          </p>
          <div className="hero-actions">
            <button className="btn-primary btn-large">Voir les vélos</button>
            <button className="btn-outline btn-large">Nos services</button>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-image">
            <div className="bike-icon">🚴‍♂️</div>
            <div className="floating-elements">
              <div className="element element-1">🏔️</div>
              <div className="element element-2">⚡</div>
              <div className="element element-3">🏙️</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
