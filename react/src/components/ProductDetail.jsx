import React from 'react';
import { bikeService } from '../service/bikeService';
import './ProductDetail.css';

const ProductDetail = ({ product, onClose }) => {
  if (!product) return null;

  const formatPrice = (price) => {
    return bikeService.formatPrice(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="product-detail-overlay" onClick={onClose}>
      <div className="product-detail-modal" onClick={(e) => e.stopPropagation()}>
        <div className="product-detail-header">
          <h2>{product.name}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="product-detail-content">
          <div className="product-detail-image">
            <img 
              src={product.image || '/placeholder-bike.jpg'} 
              alt={product.name}
              onError={(e) => {
                if (e.target instanceof HTMLImageElement) {
                  e.target.src = 'https://via.placeholder.com/400x300/3b82f6/ffffff?text=Vélo';
                }
              }}
            />
            <div className="product-category-badge">
              {product.category}
            </div>
          </div>

          <div className="product-detail-info">
            <div className="product-price">
              {formatPrice(product.price)}
            </div>

            <div className="product-description">
              <h3>Description</h3>
              <p>{product.description || 'Aucune description disponible.'}</p>
            </div>

            {product.comment && (
              <div className="product-comment">
                <h3>Commentaire détaillé</h3>
                <div className="comment-content">
                  {product.comment}
                </div>
              </div>
            )}

            {/* Informations principales */}
            <div className="product-specs">
              <h3>Informations principales</h3>
              <div className="specs-grid">
                <div className="spec-item">
                  <span className="spec-label">Catégorie:</span>
                  <span className="spec-value">{product.category}</span>
                </div>
                {product.years && (
                  <div className="spec-item">
                    <span className="spec-label">Année:</span>
                    <span className="spec-value">{product.years}</span>
                  </div>
                )}
                <div className="spec-item">
                  <span className="spec-label">Prix:</span>
                  <span className="spec-value">{formatPrice(product.price)}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Statut:</span>
                  <span className={`spec-value status ${product.isActive ? 'active' : 'inactive'}`}>
                    {product.isActive ? 'Disponible' : 'Indisponible'}
                  </span>
                </div>
                {product.createdBy && (
                  <div className="spec-item">
                    <span className="spec-label">Vendeur:</span>
                    <span className="spec-value">
                      {product.createdBy.firstName} {product.createdBy.lastName}
                    </span>
                  </div>
                )}
                <div className="spec-item">
                  <span className="spec-label">Ajouté le:</span>
                  <span className="spec-value">{formatDate(product.createdAt)}</span>
                </div>
              </div>
            </div>

            {/* Marque */}
            {product.brand && (
              <div className="product-specs">
                <h3>🏷️ Marque</h3>
                <div className="specs-grid">
                  <div className="spec-item">
                    <span className="spec-label">Marque:</span>
                    <span className="spec-value brand-name">{product.brand.name}</span>
                  </div>
                  {product.brand.description && (
                    <div className="spec-item full-width">
                      <span className="spec-label">À propos:</span>
                      <span className="spec-value">{product.brand.description}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Type de vélo et matière */}
            {product.typeVelo && (
              <div className="product-specs">
                <h3>🚴 Type de vélo</h3>
                <div className="specs-grid">
                  <div className="spec-item">
                    <span className="spec-label">Type:</span>
                    <span className="spec-value">
                      {product.typeVelo.name}
                      {product.typeVelo.isElectric && (
                        <span className="electric-badge">⚡ Électrique</span>
                      )}
                    </span>
                  </div>
                  {product.typeVelo.description && (
                    <div className="spec-item full-width">
                      <span className="spec-label">Description:</span>
                      <span className="spec-value">{product.typeVelo.description}</span>
                    </div>
                  )}
                  {product.typeVelo.matiere && (
                    <div className="spec-item full-width">
                      <span className="spec-label">Matière du cadre:</span>
                      <span className="spec-value matiere-info">
                        <strong>{product.typeVelo.matiere.name}</strong>
                        {product.typeVelo.matiere.description && (
                          <span className="matiere-desc"> - {product.typeVelo.matiere.description}</span>
                        )}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Caractéristiques techniques */}
            {(product.frameSize || product.wheelSize || product.tyres) && (
              <div className="product-specs">
                <h3>⚙️ Caractéristiques techniques</h3>
                <div className="specs-grid">
                  {product.frameSize && (
                    <>
                      <div className="spec-item">
                        <span className="spec-label">Taille de cadre:</span>
                        <span className="spec-value">
                          {product.frameSize.size}
                          {product.frameSize.isChild && (
                            <span className="child-badge">👶 Enfant</span>
                          )}
                        </span>
                      </div>
                      {product.frameSize.description && (
                        <div className="spec-item full-width">
                          <span className="spec-label">Description:</span>
                          <span className="spec-value">{product.frameSize.description}</span>
                        </div>
                      )}
                    </>
                  )}
                  {product.wheelSize && (
                    <>
                      <div className="spec-item">
                        <span className="spec-label">Taille de roues:</span>
                        <span className="spec-value">
                          {product.wheelSize.size}
                          {product.wheelSize.isChild && (
                            <span className="child-badge">👶 Enfant</span>
                          )}
                        </span>
                      </div>
                      {product.wheelSize.description && (
                        <div className="spec-item full-width">
                          <span className="spec-label">Description:</span>
                          <span className="spec-value">{product.wheelSize.description}</span>
                        </div>
                      )}
                    </>
                  )}
                  {product.tyres && (
                    <>
                      <div className="spec-item">
                        <span className="spec-label">Type de pneus:</span>
                        <span className="spec-value">{product.tyres.name}</span>
                      </div>
                      {product.tyres.description && (
                        <div className="spec-item full-width">
                          <span className="spec-label">Description:</span>
                          <span className="spec-value">{product.tyres.description}</span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Transmission et freins */}
            {(product.transmitionType || product.brakeType) && (
              <div className="product-specs">
                <h3>🔧 Transmission et freinage</h3>
                <div className="specs-grid">
                  {product.transmitionType && (
                    <>
                      <div className="spec-item">
                        <span className="spec-label">Transmission:</span>
                        <span className="spec-value">{product.transmitionType.name}</span>
                      </div>
                      {product.transmitionType.description && (
                        <div className="spec-item full-width">
                          <span className="spec-label">Description:</span>
                          <span className="spec-value">{product.transmitionType.description}</span>
                        </div>
                      )}
                    </>
                  )}
                  {product.brakeType && (
                    <>
                      <div className="spec-item">
                        <span className="spec-label">Freins:</span>
                        <span className="spec-value">{product.brakeType.name}</span>
                      </div>
                      {product.brakeType.description && (
                        <div className="spec-item full-width">
                          <span className="spec-label">Description:</span>
                          <span className="spec-value">{product.brakeType.description}</span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Équipe World Tour */}
            {product.team && (
              <div className="product-specs team-section">
                <h3>🏆 Équipe cycliste</h3>
                <div className="specs-grid">
                  <div className="spec-item">
                    <span className="spec-label">Équipe:</span>
                    <span className="spec-value team-name">
                      {product.team.name}
                      {product.team.isWorldTour && (
                        <span className="world-tour-badge">🌍 World Tour</span>
                      )}
                    </span>
                  </div>
                  {product.team.description && (
                    <div className="spec-item full-width">
                      <span className="spec-label">À propos:</span>
                      <span className="spec-value">{product.team.description}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="product-actions">
              <button className="btn-primary">
                🛒 Ajouter au panier
              </button>
              <button className="btn-secondary">
                ❤️ Ajouter aux favoris
              </button>
              <button className="btn-outline">
                📞 Contacter le vendeur
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
