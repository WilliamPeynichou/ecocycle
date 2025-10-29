import React, { useState, useEffect } from 'react';
import { bikeService } from '../../service/bikeService';
import ProductDetail from './ProductDetail';
import './ProductDetail.css';

const ProductModal = ({ productId, isOpen, onClose }) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && productId) {
      loadProduct();
    }
  }, [isOpen, productId]);

  const loadProduct = async () => {
    setLoading(true);
    setError(null);

    try {
      const productData = await bikeService.getBikeById(productId);
      if (productData) {
        setProduct(productData);
      } else {
        setError('Produit non trouvé');
      }
    } catch (err) {
      setError('Erreur lors du chargement du produit');
      console.error('Erreur ProductModal.loadProduct:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setProduct(null);
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="product-modal-overlay" onClick={handleClose}>
      <div className="product-modal" onClick={(e) => e.stopPropagation()}>
        {loading && (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Chargement du produit...</p>
          </div>
        )}

        {error && (
          <div className="error-container">
            <div className="error-icon">⚠️</div>
            <h3>Erreur</h3>
            <p>{error}</p>
            <button className="btn-primary" onClick={handleClose}>
              Fermer
            </button>
          </div>
        )}

        {product && !loading && !error && (
          <ProductDetail product={product} onClose={handleClose} />
        )}
      </div>
    </div>
  );
};

export default ProductModal;
