import React from 'react';
import './Services.css';

const Services = () => {
  const bikes = [
    {
      image: '🚴‍♂️',
      title: 'VTT Trek Pro',
      price: '899€',
      description: 'Vélo tout terrain haute performance pour les aventures en montagne.'
    },
    {
      image: '🚴‍♀️',
      title: 'Route Carbon Elite',
      price: '1299€',
      description: 'Vélo de route en carbone pour la vitesse et l\'efficacité.'
    },
    {
      image: '🚲',
      title: 'Ville Comfort',
      price: '599€',
      description: 'Vélo urbain confortable pour vos déplacements quotidiens.'
    },
    {
      image: '⚡',
      title: 'Électrique E-Bike',
      price: '1899€',
      description: 'Vélo électrique dernière génération pour tous vos trajets.'
    }
  ];

  return (
    <section className="services" id="velos">
      <div className="services-container">
        <div className="services-header">
          <h2 className="services-title">Nos Vélos</h2>
          <p className="services-subtitle">
            Découvrez notre sélection de vélos de qualité pour tous vos besoins
          </p>
        </div>
        
        <div className="services-grid">
          {bikes.map((bike, index) => (
            <div key={index} className="service-card">
              <div className="service-icon">{bike.image}</div>
              <h3 className="service-title">{bike.title}</h3>
              <p className="service-description">{bike.description}</p>
              <div className="bike-price">{bike.price}</div>
              <button className="btn-primary">Voir détails</button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
