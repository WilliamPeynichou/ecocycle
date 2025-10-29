import React from 'react';
import './ProductDetail.css';

const ProductSpecs = ({ title, children, className = '' }) => {
  return (
    <div className={`product-specs ${className}`}>
      <h3>{title}</h3>
      <div className="specs-grid">
        {children}
      </div>
    </div>
  );
};

export default ProductSpecs;

