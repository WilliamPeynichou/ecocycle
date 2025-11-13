import React, { useState, useEffect, useCallback } from 'react';
import { bikeService } from '../../service/bikeService';
import ProductModal from './ProductModal';
import BikeFilters from './BikeFilters';
import './ProductList.css';

const ProductList = () => {
  const [bikes, setBikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    minPrice: '',
    maxPrice: '',
    brandId: '',
    brakeTypeId: '',
    transmitionTypeId: '',
    frameSizeId: '',
    wheelSizeId: '',
    typeVeloId: '',
    tyresId: '',
    teamId: '',
  });

  useEffect(() => {
    loadBikes();
  }, []);

  // Recherche avec debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      performSearch();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [filters]);

  const loadBikes = async () => {
    try {
      setLoading(true);
      const data = await bikeService.getAllBikes();
      setBikes(data);
      setError(null);
    } catch (err) {
      setError('Erreur lors du chargement des vélos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const performSearch = async () => {
    try {
      setLoading(true);
      const hasFilters = Object.values(filters).some(
        (val) => val !== null && val !== '' && val !== undefined
      );

      let data;
      if (hasFilters) {
        data = await bikeService.searchBikes(filters, 100);
      setBikes(data.products);
      } else {
        await loadBikes();
        return;
      }
      setError(null);
    } catch (err) {
      setError('Erreur lors de la recherche');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters);
  }, []);

  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      minPrice: '',
      maxPrice: '',
      brandId: '',
      brakeTypeId: '',
      transmitionTypeId: '',
      frameSizeId: '',
      wheelSizeId: '',
      typeVeloId: '',
      tyresId: '',
      teamId: '',
    });
  };

  const handleProductClick = (productId) => {
    setSelectedProductId(productId);
    setIsProductModalOpen(true);
  };

  const handleCloseProductModal = () => {
    setIsProductModalOpen(false);
    setSelectedProductId(null);
  };

  return (
    <section className="services" id="velos">
      <div className="services-container">
        <div className="services-header">
          <h2 className="services-title">Nos Vélos</h2>
          <p className="services-subtitle">
            Découvrez notre sélection de vélos de qualité pour tous vos besoins
          </p>
        </div>

        {/* Filtres avancés */}
        <BikeFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={clearFilters}
        />

        {/* Affichage des vélos */}
        {loading && (
          <div className="loading">
            <div className="spinner"></div>
            <p>Chargement des vélos...</p>
          </div>
        )}

        {error && (
          <div className="error">
            <p>{error}</p>
            <button onClick={loadBikes}>Réessayer</button>
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="bikes-count">
              <p>{bikes.length} vélo{bikes.length > 1 ? 's' : ''} trouvé{bikes.length > 1 ? 's' : ''}</p>
            </div>

            <div className="services-grid">
              {bikes.map((bike) => (
                <div key={bike.id} className="service-card">
                  <div className="service-image">
                    <img src={bike.image} alt={bike.name} />
                    <div className="bike-category">{bike.category}</div>
                  </div>
                  <div className="service-content">
                    <h3 className="service-title">{bike.name}</h3>
                    <p className="service-description">
                      {bikeService.formatDescription(bike.description)}
                    </p>
                    <div className="bike-price">
                      {bikeService.formatPrice(bike.price)}
                    </div>
                    <button 
                      className="btn-primary"
                      onClick={() => handleProductClick(bike.id)}
                    >
                      Voir détails
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {bikes.length === 0 && (
              <div className="no-bikes">
                <p>Aucun vélo trouvé avec ces critères.</p>
                <button onClick={clearFilters}>Voir tous les vélos</button>
              </div>
            )}
          </>
        )}
      </div>
      
      <ProductModal
        productId={selectedProductId}
        isOpen={isProductModalOpen}
        onClose={handleCloseProductModal}
      />
    </section>
  );
};

export default ProductList;
