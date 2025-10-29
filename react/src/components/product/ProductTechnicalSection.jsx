import React from 'react';
import ProductSpecs from './ProductSpecs';
import ProductSpecItem from './ProductSpecItem';

const ProductTechnicalSection = ({ frameSize, wheelSize, tyres }) => {
  if (!frameSize && !wheelSize && !tyres) return null;

  return (
    <ProductSpecs title="⚙️ Caractéristiques techniques">
      {frameSize && (
        <>
          <ProductSpecItem 
            label="Taille de cadre"
            fullWidth={false}
          >
            {frameSize.size}
            {frameSize.isChild && (
              <span className="child-badge">👶 Enfant</span>
            )}
          </ProductSpecItem>
          {frameSize.description && (
            <ProductSpecItem 
              label="Description" 
              value={frameSize.description}
              fullWidth={true}
            />
          )}
        </>
      )}
      {wheelSize && (
        <>
          <ProductSpecItem 
            label="Taille de roues"
            fullWidth={false}
          >
            {wheelSize.size}
            {wheelSize.isChild && (
              <span className="child-badge">👶 Enfant</span>
            )}
          </ProductSpecItem>
          {wheelSize.description && (
            <ProductSpecItem 
              label="Description" 
              value={wheelSize.description}
              fullWidth={true}
            />
          )}
        </>
      )}
      {tyres && (
        <>
          <ProductSpecItem label="Type de pneus" value={tyres.name} />
          {tyres.description && (
            <ProductSpecItem 
              label="Description" 
              value={tyres.description}
              fullWidth={true}
            />
          )}
        </>
      )}
    </ProductSpecs>
  );
};

export default ProductTechnicalSection;

