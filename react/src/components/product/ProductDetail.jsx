import React from 'react';
import { bikeService } from '../../service/bikeService';
import ProductDetailHeader from './ProductDetailHeader';
import ProductDetailImage from './ProductDetailImage';
import ProductInfo from './ProductInfo';
import ProductBrandSection from './ProductBrandSection';
import ProductTypeVeloSection from './ProductTypeVeloSection';
import ProductTechnicalSection from './ProductTechnicalSection';
import ProductTransmissionSection from './ProductTransmissionSection';
import ProductTeamSection from './ProductTeamSection';
import ProductActions from './ProductActions';
import './ProductDetail.css';

const ProductDetail = ({ product, onClose }) => {
  if (!product) return null;

  return (
    <div className="product-detail-overlay" onClick={onClose}>
      <div className="product-detail-modal" onClick={(e) => e.stopPropagation()}>
        <ProductDetailHeader name={product.name} onClose={onClose} />

        <div className="product-detail-content">
          <ProductDetailImage 
            image={product.image} 
            name={product.name} 
            category={product.category} 
          />

          <div className="product-detail-info">
            <div className="product-price">
              {bikeService.formatPrice(product.price)}
            </div>

            <div className="product-description">
              <h3>Description</h3>
              <p>{product.description || 'Aucune description disponible.'}</p>
            </div>

            {product.comment && (
              <div className="product-comment">
                <h3>Commentaire détaillé</h3>
                <div className="comment-content">
                  {product.comment}
                </div>
              </div>
            )}

            <ProductInfo product={product} />
            <ProductBrandSection brand={product.brand} />
            <ProductTypeVeloSection typeVelo={product.typeVelo} />
            <ProductTechnicalSection 
              frameSize={product.frameSize}
              wheelSize={product.wheelSize}
              tyres={product.tyres}
            />
            <ProductTransmissionSection 
              transmitionType={product.transmitionType}
              brakeType={product.brakeType}
            />
            <ProductTeamSection team={product.team} />

            <ProductActions />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

