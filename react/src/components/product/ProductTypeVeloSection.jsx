import React from 'react';
import ProductSpecs from './ProductSpecs';
import ProductSpecItem from './ProductSpecItem';

const ProductTypeVeloSection = ({ typeVelo }) => {
  if (!typeVelo) return null;

  return (
    <ProductSpecs title="🚴 Type de vélo">
      <ProductSpecItem 
        label="Type"
        fullWidth={false}
      >
        {typeVelo.name}
        {typeVelo.isElectric && (
          <span className="electric-badge">⚡ Électrique</span>
        )}
      </ProductSpecItem>
      {typeVelo.description && (
        <ProductSpecItem 
          label="Description" 
          value={typeVelo.description}
          fullWidth={true}
        />
      )}
      {typeVelo.matiere && (
        <ProductSpecItem 
          label="Matière du cadre"
          fullWidth={true}
        >
          <span className="matiere-info">
            <strong>{typeVelo.matiere.name}</strong>
            {typeVelo.matiere.description && (
              <span className="matiere-desc"> - {typeVelo.matiere.description}</span>
            )}
          </span>
        </ProductSpecItem>
      )}
    </ProductSpecs>
  );
};

export default ProductTypeVeloSection;

