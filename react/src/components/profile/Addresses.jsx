import React, { useState } from 'react';
import './Addresses.css';

const Addresses = ({ addresses, onAdd, onDelete }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    street: '',
    streetComplement: '',
    postalCode: '',
    city: '',
    country: 'France',
    state: '',
    isDefault: false,
    isBillingAddress: false,
    isShippingAddress: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await onAdd(formData);
      setFormData({
        street: '',
        streetComplement: '',
        postalCode: '',
        city: '',
        country: 'France',
        state: '',
        isDefault: false,
        isBillingAddress: false,
        isShippingAddress: true,
      });
      setIsAdding(false);
    } catch (err) {
      setError(err.message || 'Erreur lors de l\'ajout de l\'adresse');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (addressId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette adresse ?')) {
      return;
    }

    try {
      await onDelete(addressId);
    } catch (err) {
      alert(err.message || 'Erreur lors de la suppression');
    }
  };

  const getFullAddress = (address) => {
    let full = address.street;
    if (address.streetComplement) {
      full += ', ' + address.streetComplement;
    }
    full += `, ${address.postalCode} ${address.city}`;
    if (address.state) {
      full += ', ' + address.state;
    }
    full += ', ' + address.country;
    return full;
  };

  return (
    <div className="addresses">
      <div className="addresses-header">
        <h2>Mes adresses</h2>
        <button 
          onClick={() => setIsAdding(true)} 
          className="btn-add"
          disabled={isAdding}
        >
          + Ajouter une adresse
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {isAdding && (
        <form onSubmit={handleSubmit} className="address-form">
          <h3>Nouvelle adresse</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label>Rue *</label>
              <input
                type="text"
                name="street"
                value={formData.street}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Complément d'adresse</label>
              <input
                type="text"
                name="streetComplement"
                value={formData.streetComplement}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Code postal *</label>
              <input
                type="text"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Ville *</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Région/État</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Pays *</label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-checkboxes">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="isDefault"
                checked={formData.isDefault}
                onChange={handleChange}
              />
              Adresse par défaut
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="isBillingAddress"
                checked={formData.isBillingAddress}
                onChange={handleChange}
              />
              Adresse de facturation
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="isShippingAddress"
                checked={formData.isShippingAddress}
                onChange={handleChange}
              />
              Adresse de livraison
            </label>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Ajout...' : 'Ajouter'}
            </button>
            <button 
              type="button" 
              onClick={() => {
                setIsAdding(false);
                setError('');
              }} 
              className="btn-secondary"
            >
              Annuler
            </button>
          </div>
        </form>
      )}

      <div className="addresses-list">
        {addresses.length === 0 ? (
          <div className="addresses-empty">
            <p>Aucune adresse enregistrée</p>
          </div>
        ) : (
          addresses.map(address => (
            <div key={address.id} className="address-card">
              <div className="address-header">
                <div className="address-badges">
                  {address.isDefault && (
                    <span className="badge badge-primary">Par défaut</span>
                  )}
                  {address.isBillingAddress && (
                    <span className="badge badge-info">Facturation</span>
                  )}
                  {address.isShippingAddress && (
                    <span className="badge badge-success">Livraison</span>
                  )}
                </div>
                <button
                  onClick={() => handleDelete(address.id)}
                  className="btn-delete"
                  title="Supprimer"
                >
                  🗑️
                </button>
              </div>
              <div className="address-content">
                <p className="address-line">{address.street}</p>
                {address.streetComplement && (
                  <p className="address-line">{address.streetComplement}</p>
                )}
                <p className="address-line">
                  {address.postalCode} {address.city}
                </p>
                {address.state && (
                  <p className="address-line">{address.state}</p>
                )}
                <p className="address-line">{address.country}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Addresses;

