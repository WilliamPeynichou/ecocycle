import React from 'react';
import './ProductDetail.css';

const ProductDetailHeader = ({ name, onClose }) => {
  return (
    <div className="product-detail-header">
      <h2>{name}</h2>
      <button className="close-btn" onClick={onClose}>×</button>
    </div>
  );
};

export default ProductDetailHeader;

