import React from 'react';
import './ProductDetail.css';

const ProductActions = () => {
  return (
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
  );
};

export default ProductActions;

