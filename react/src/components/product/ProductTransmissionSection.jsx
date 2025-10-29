import React from 'react';
import ProductSpecs from './ProductSpecs';
import ProductSpecItem from './ProductSpecItem';

const ProductTransmissionSection = ({ transmitionType, brakeType }) => {
  if (!transmitionType && !brakeType) return null;

  return (
    <ProductSpecs title="🔧 Transmission et freinage">
      {transmitionType && (
        <>
          <ProductSpecItem label="Transmission" value={transmitionType.name} />
          {transmitionType.description && (
            <ProductSpecItem 
              label="Description" 
              value={transmitionType.description}
              fullWidth={true}
            />
          )}
        </>
      )}
      {brakeType && (
        <>
          <ProductSpecItem label="Freins" value={brakeType.name} />
          {brakeType.description && (
            <ProductSpecItem 
              label="Description" 
              value={brakeType.description}
              fullWidth={true}
            />
          )}
        </>
      )}
    </ProductSpecs>
  );
};

export default ProductTransmissionSection;

