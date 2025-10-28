import React, { useState, useEffect } from 'react';
import { bikeService } from '../service/bikeService';
import ProductModal from './ProductModal';
import './Services.css';

const Services = () => {
  const [bikes, setBikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  useEffect(() => {
    loadBikes();
    loadCategories();
  }, []);

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

  const loadCategories = async () => {
    try {
      const data = await bikeService.getCategories();
      setCategories(data);
    } catch (err) {
      console.error('Erreur lors du chargement des catégories:', err);
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      const data = await bikeService.searchBikes(
        searchQuery,
        selectedCategory,
        priceRange.min,
        priceRange.max,
        50
      );
      setBikes(data.products);
      setError(null);
    } catch (err) {
      setError('Erreur lors de la recherche');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryFilter = async (category) => {
    try {
      setLoading(true);
      setSelectedCategory(category);
      if (category === '') {
        await loadBikes();
      } else {
        const data = await bikeService.getBikesByCategory(category);
        setBikes(data);
      }
      setError(null);
    } catch (err) {
      setError('Erreur lors du filtrage par catégorie');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setSelectedCategory('');
    setSearchQuery('');
    setPriceRange({ min: '', max: '' });
    loadBikes();
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

        {/* Filtres et recherche */}
        <div className="bike-filters">
          <div className="filter-group">
            <input
              type="text"
              placeholder="Rechercher un vélo..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <button onClick={handleSearch} className="search-btn">
              🔍 Rechercher
            </button>
          </div>

          <div className="filter-group">
            <select
              value={selectedCategory}
              onChange={(e) => handleCategoryFilter(e.target.value)}
              className="category-select"
            >
              <option value="">Toutes les catégories</option>
              {categories.map((categoryObj) => (
                <option key={categoryObj.category} value={categoryObj.category}>
                  {categoryObj.category} ({categoryObj.productCount})
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <input
              type="number"
              placeholder="Prix min"
              value={priceRange.min}
              onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
              className="price-input"
            />
            <input
              type="number"
              placeholder="Prix max"
              value={priceRange.max}
              onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
              className="price-input"
            />
          </div>

          <button onClick={clearFilters} className="clear-filters-btn">
            Effacer les filtres
          </button>
        </div>

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

export default Services;
