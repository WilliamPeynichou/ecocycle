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
                e.target.src = 'https://via.placeholder.com/400x300/3b82f6/ffffff?text=Vélo';
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

            <div className="product-specs">
              <h3>Caractéristiques</h3>
              <div className="specs-grid">
                <div className="spec-item">
                  <span className="spec-label">Catégorie:</span>
                  <span className="spec-value">{product.category}</span>
                </div>
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
