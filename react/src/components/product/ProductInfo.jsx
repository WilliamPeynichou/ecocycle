import React from 'react';
import { bikeService } from '../../service/bikeService';
import ProductSpecs from './ProductSpecs';
import ProductSpecItem from './ProductSpecItem';
import './ProductDetail.css';

const ProductInfo = ({ product }) => {
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
    <ProductSpecs title="Informations principales">
      <ProductSpecItem label="Catégorie" value={product.category} />
      {product.years && (
        <ProductSpecItem label="Année" value={product.years} />
      )}
      <ProductSpecItem label="Prix" value={formatPrice(product.price)} />
      <ProductSpecItem 
        label="Statut"
        fullWidth={false}
      >
        <span className={`status ${product.isActive ? 'active' : 'inactive'}`}>
          {product.isActive ? 'Disponible' : 'Indisponible'}
        </span>
      </ProductSpecItem>
      {product.createdBy && (
        <ProductSpecItem 
          label="Vendeur" 
          value={`${product.createdBy.firstName} ${product.createdBy.lastName}`} 
        />
      )}
      <ProductSpecItem label="Ajouté le" value={formatDate(product.createdAt)} />
    </ProductSpecs>
  );
};

export default ProductInfo;

