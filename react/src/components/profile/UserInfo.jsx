import React, { useState } from 'react';
import './UserInfo.css';

const UserInfo = ({ user, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await onUpdate(formData);
      setSuccess('Profil mis à jour avec succès !');
      setIsEditing(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Erreur lors de la mise à jour');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: user?.phone || '',
    });
    setIsEditing(false);
    setError('');
  };

  return (
    <div className="user-info">
      <div className="user-info-header">
        <h2>Informations personnelles</h2>
        {!isEditing && (
          <button onClick={() => setIsEditing(true)} className="btn-edit">
            ✏️ Modifier
          </button>
        )}
      </div>

      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      {isEditing ? (
        <form onSubmit={handleSubmit} className="user-info-form">
          <div className="form-group">
            <label>Prénom</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Nom</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Téléphone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Enregistrement...' : 'Enregistrer'}
            </button>
            <button type="button" onClick={handleCancel} className="btn-secondary">
              Annuler
            </button>
          </div>
        </form>
      ) : (
        <div className="user-info-display">
          <div className="info-item">
            <span className="info-label">Prénom</span>
            <span className="info-value">{user?.firstName || '-'}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Nom</span>
            <span className="info-value">{user?.lastName || '-'}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Email</span>
            <span className="info-value">{user?.email || '-'}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Téléphone</span>
            <span className="info-value">{user?.phone || '-'}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Statut</span>
            <span className={`info-value badge ${user?.isActive ? 'badge-success' : 'badge-error'}`}>
              {user?.isActive ? 'Actif' : 'Inactif'}
            </span>
          </div>
          <div className="info-item">
            <span className="info-label">Membre depuis</span>
            <span className="info-value">
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('fr-FR') : '-'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserInfo;

