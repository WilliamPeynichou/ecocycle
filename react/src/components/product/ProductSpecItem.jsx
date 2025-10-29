import React from 'react';
import './ProductDetail.css';

const ProductSpecItem = ({ label, value, fullWidth = false, children }) => {
  return (
    <div className={`spec-item ${fullWidth ? 'full-width' : ''}`}>
      <span className="spec-label">{label}:</span>
      {children ? (
        <span className="spec-value">{children}</span>
      ) : (
        <span className="spec-value">{value}</span>
      )}
    </div>
  );
};

export default ProductSpecItem;

