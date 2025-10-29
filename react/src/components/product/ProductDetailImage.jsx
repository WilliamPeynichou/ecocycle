import React from 'react';
import './ProductDetail.css';

const ProductDetailImage = ({ image, name, category }) => {
  return (
    <div className="product-detail-image">
      <img 
        src={image || '/placeholder-bike.jpg'} 
        alt={name}
        onError={(e) => {
          if (e.target instanceof HTMLImageElement) {
            e.target.src = 'https://via.placeholder.com/400x300/3b82f6/ffffff?text=Vélo';
          }
        }}
      />
      <div className="product-category-badge">
        {category}
      </div>
    </div>
  );
};

export default ProductDetailImage;

