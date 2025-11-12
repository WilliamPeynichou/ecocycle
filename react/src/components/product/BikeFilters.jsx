import React, { useState, useEffect } from 'react';
import { bikeService } from '../../service/bikeService';
import './BikeFilters.css';

const BikeFilters = ({ onFilterChange, filters, onClearFilters }) => {
  const [filterOptions, setFilterOptions] = useState({
    brands: [],
    types: [],
    frameSizes: [],
    wheelSizes: [],
    tyres: [],
    transmissions: [],
    brakes: [],
    teams: [],
  });
  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    loadFilterOptions();
  }, []);

  const loadFilterOptions = async () => {
    try {
      const data = await bikeService.getFilterOptions();
      setFilterOptions(data);
    } catch (err) {
      console.error('Erreur lors du chargement des options de filtres:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filterType, value) => {
    const newFilters = {
      ...filters,
      [filterType]: value || null,
    };
    onFilterChange(newFilters);
  };

  const activeFiltersCount = Object.values(filters).filter(
    (val) => val !== null && val !== '' && val !== undefined
  ).length;

  if (loading) {
    return (
      <div className="bike-filters-loading">
        <p>Chargement des filtres...</p>
      </div>
    );
  }

  return (
    <div className="bike-filters-container">
      <div className="filters-header">
        <div className="filters-title">
          <h3>🔍 Filtres</h3>
          {activeFiltersCount > 0 && (
            <span className="active-filters-badge">{activeFiltersCount}</span>
          )}
        </div>
        <div className="filters-actions">
          {activeFiltersCount > 0 && (
            <button onClick={onClearFilters} className="btn-clear-filters">
              Effacer tout
            </button>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="btn-toggle-filters"
          >
            {isExpanded ? '▼ Réduire' : '▶ Voir plus'}
          </button>
        </div>
      </div>

      <div className={`filters-content ${isExpanded ? 'expanded' : ''}`}>
        {/* Barre de recherche */}
        <div className="filter-section">
          <label className="filter-label">Recherche</label>
          <input
            type="text"
            placeholder="Rechercher un vélo..."
            value={filters.search || ''}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="search-input"
          />
        </div>

        {/* Prix */}
        <div className="filter-section">
          <label className="filter-label">Prix (€)</label>
          <div className="price-range">
            <input
              type="number"
              placeholder="Min"
              value={filters.minPrice || ''}
              onChange={(e) => handleFilterChange('minPrice', e.target.value)}
              className="price-input"
            />
            <span className="price-separator">-</span>
            <input
              type="number"
              placeholder="Max"
              value={filters.maxPrice || ''}
              onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
              className="price-input"
            />
          </div>
        </div>

        {/* Catégorie */}
        <div className="filter-section">
          <label className="filter-label">Catégorie</label>
          <select
            value={filters.category || ''}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="filter-select"
          >
            <option value="">Toutes les catégories</option>
            {filterOptions.categories?.map((cat) => (
              <option key={cat.category} value={cat.category}>
                {cat.category} ({cat.productCount})
              </option>
            ))}
          </select>
        </div>

        {/* Marque */}
        <div className="filter-section">
          <label className="filter-label">Marque</label>
          <select
            value={filters.brandId || ''}
            onChange={(e) => handleFilterChange('brandId', e.target.value)}
            className="filter-select"
          >
            <option value="">Toutes les marques</option>
            {filterOptions.brands?.map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.name}
              </option>
            ))}
          </select>
        </div>

        {/* Type de vélo */}
        <div className="filter-section">
          <label className="filter-label">Type de vélo</label>
          <select
            value={filters.typeVeloId || ''}
            onChange={(e) => handleFilterChange('typeVeloId', e.target.value)}
            className="filter-select"
          >
            <option value="">Tous les types</option>
            {filterOptions.types?.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
        </div>

        {/* Taille de cadre */}
        <div className="filter-section">
          <label className="filter-label">Taille de cadre</label>
          <select
            value={filters.frameSizeId || ''}
            onChange={(e) => handleFilterChange('frameSizeId', e.target.value)}
            className="filter-select"
          >
            <option value="">Toutes les tailles</option>
            {filterOptions.frameSizes?.map((size) => (
              <option key={size.id} value={size.id}>
                {size.size}
              </option>
            ))}
          </select>
        </div>

        {/* Taille de roue */}
        <div className="filter-section">
          <label className="filter-label">Taille de roue</label>
          <select
            value={filters.wheelSizeId || ''}
            onChange={(e) => handleFilterChange('wheelSizeId', e.target.value)}
            className="filter-select"
          >
            <option value="">Toutes les tailles</option>
            {filterOptions.wheelSizes?.map((size) => (
              <option key={size.id} value={size.id}>
                {size.size}
              </option>
            ))}
          </select>
        </div>

        {/* Type de transmission */}
        <div className="filter-section">
          <label className="filter-label">Transmission</label>
          <select
            value={filters.transmitionTypeId || ''}
            onChange={(e) => handleFilterChange('transmitionTypeId', e.target.value)}
            className="filter-select"
          >
            <option value="">Tous les types</option>
            {filterOptions.transmissions?.map((trans) => (
              <option key={trans.id} value={trans.id}>
                {trans.name}
              </option>
            ))}
          </select>
        </div>

        {/* Type de frein */}
        <div className="filter-section">
          <label className="filter-label">Frein</label>
          <select
            value={filters.brakeTypeId || ''}
            onChange={(e) => handleFilterChange('brakeTypeId', e.target.value)}
            className="filter-select"
          >
            <option value="">Tous les types</option>
            {filterOptions.brakes?.map((brake) => (
              <option key={brake.id} value={brake.id}>
                {brake.name}
              </option>
            ))}
          </select>
        </div>

        {/* Pneus */}
        <div className="filter-section">
          <label className="filter-label">Pneus</label>
          <select
            value={filters.tyresId || ''}
            onChange={(e) => handleFilterChange('tyresId', e.target.value)}
            className="filter-select"
          >
            <option value="">Tous les types</option>
            {filterOptions.tyres?.map((tyre) => (
              <option key={tyre.id} value={tyre.id}>
                {tyre.name}
              </option>
            ))}
          </select>
        </div>

        {/* Équipe */}
        <div className="filter-section">
          <label className="filter-label">Équipe</label>
          <select
            value={filters.teamId || ''}
            onChange={(e) => handleFilterChange('teamId', e.target.value)}
            className="filter-select"
          >
            <option value="">Toutes les équipes</option>
            {filterOptions.teams?.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default BikeFilters;

