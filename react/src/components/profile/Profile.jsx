import React, { useState, useEffect } from 'react';
import { userService } from '../../service/userService';
import { authService } from '../../service/authService';
import UserInfo from './UserInfo';
import OrderHistory from './OrderHistory';
import MessageHistory from './MessageHistory';
import Addresses from './Addresses';
import ProfileStats from './ProfileStats';
import './Profile.css';

const Profile = ({ user, onBack, onUserUpdate }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [profileData, setProfileData] = useState(null);
  const [orders, setOrders] = useState([]);
  const [messages, setMessages] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Charger toutes les données en parallèle
      const [profileRes, ordersRes, messagesRes, addressesRes] = await Promise.allSettled([
        userService.getProfile(),
        userService.getOrders(),
        userService.getMessages(),
        userService.getAddresses(),
      ]);

      if (profileRes.status === 'fulfilled') {
        setProfileData(profileRes.value);
      }

      if (ordersRes.status === 'fulfilled') {
        setOrders(ordersRes.value.orders || ordersRes.value || []);
      }

      if (messagesRes.status === 'fulfilled') {
        setMessages(messagesRes.value.messages || messagesRes.value || []);
      }

      if (addressesRes.status === 'fulfilled') {
        setAddresses(addressesRes.value.addresses || addressesRes.value || []);
      }

      // Gérer les erreurs
      const errors = [profileRes, ordersRes, messagesRes, addressesRes]
        .filter(result => result.status === 'rejected')
        .map(result => result.reason.message);

      if (errors.length > 0 && errors.length === 4) {
        setError('Impossible de charger les données du profil');
      }
    } catch (err) {
      setError(err.message || 'Erreur lors du chargement du profil');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (updatedData) => {
    try {
      const result = await userService.updateProfile(updatedData);
      setProfileData(result.user || result);
      if (onUserUpdate) {
        onUserUpdate(result.user || result);
      }
      return result;
    } catch (err) {
      throw err;
    }
  };

  const handleAddressAdd = async (addressData) => {
    try {
      const newAddress = await userService.addAddress(addressData);
      setAddresses(prev => [...prev, newAddress.address || newAddress]);
      return newAddress;
    } catch (err) {
      throw err;
    }
  };

  const handleAddressDelete = async (addressId) => {
    try {
      await userService.deleteAddress(addressId);
      setAddresses(prev => prev.filter(addr => addr.id !== addressId));
    } catch (err) {
      throw err;
    }
  };

  if (loading) {
    return (
      <div className="profile-loading">
        <div className="spinner"></div>
        <p>Chargement de votre profil...</p>
      </div>
    );
  }

  if (error && !profileData) {
    return (
      <div className="profile-error">
        <p>{error}</p>
        <button onClick={loadProfileData} className="btn-primary">
          Réessayer
        </button>
        <button onClick={onBack} className="btn-secondary">
          Retour
        </button>
      </div>
    );
  }

  const currentUser = profileData || user;

  return (
    <div className="profile-container">
      <div className="profile-header">
        <button onClick={onBack} className="btn-back">
          ← Retour
        </button>
        <h1>Mon Profil</h1>
      </div>

      <div className="profile-content">
        <div className="profile-sidebar">
          <div className="profile-avatar">
            <div className="avatar-circle">
              {currentUser?.firstName?.[0]?.toUpperCase()}
              {currentUser?.lastName?.[0]?.toUpperCase()}
            </div>
            <h2>{currentUser?.firstName} {currentUser?.lastName}</h2>
            <p className="profile-email">{currentUser?.email}</p>
          </div>

          <nav className="profile-nav">
            <button
              className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              📊 Vue d'ensemble
            </button>
            <button
              className={`nav-item ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => setActiveTab('orders')}
            >
              🛒 Commandes ({orders.length})
            </button>
            <button
              className={`nav-item ${activeTab === 'messages' ? 'active' : ''}`}
              onClick={() => setActiveTab('messages')}
            >
              💬 Messages ({messages.filter(m => !m.isRead).length})
            </button>
            <button
              className={`nav-item ${activeTab === 'addresses' ? 'active' : ''}`}
              onClick={() => setActiveTab('addresses')}
            >
              📍 Adresses ({addresses.length})
            </button>
            <button
              className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              ⚙️ Paramètres
            </button>
          </nav>
        </div>

        <div className="profile-main">
          {activeTab === 'overview' && (
            <div className="profile-tab-content">
              <ProfileStats
                user={currentUser}
                orders={orders}
                messages={messages}
                addresses={addresses}
              />
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="profile-tab-content">
              <OrderHistory orders={orders} onRefresh={loadProfileData} />
            </div>
          )}

          {activeTab === 'messages' && (
            <div className="profile-tab-content">
              <MessageHistory messages={messages} onRefresh={loadProfileData} />
            </div>
          )}

          {activeTab === 'addresses' && (
            <div className="profile-tab-content">
              <Addresses
                addresses={addresses}
                onAdd={handleAddressAdd}
                onDelete={handleAddressDelete}
              />
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="profile-tab-content">
              <UserInfo
                user={currentUser}
                onUpdate={handleProfileUpdate}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;

