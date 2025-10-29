import React from 'react';
import ProductSpecs from './ProductSpecs';
import ProductSpecItem from './ProductSpecItem';

const ProductBrandSection = ({ brand }) => {
  if (!brand) return null;

  return (
    <ProductSpecs title="🏷️ Marque">
      <ProductSpecItem 
        label="Marque" 
        fullWidth={false}
      >
        <span className="brand-name">{brand.name}</span>
      </ProductSpecItem>
      {brand.description && (
        <ProductSpecItem 
          label="À propos" 
          value={brand.description}
          fullWidth={true}
        />
      )}
    </ProductSpecs>
  );
};

export default ProductBrandSection;

