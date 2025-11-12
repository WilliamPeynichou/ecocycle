import React, { useState } from 'react';
import { authService } from '../../service/authService';
import './UserMenu.css';

const UserMenu = ({ user, onLogout, onProfileClick }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await authService.logout();
      onLogout();
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      // Forcer la déconnexion même en cas d'erreur
      onLogout();
    }
  };

  const getRoleDisplayName = (role) => {
    switch (role) {
      case 'admin':
        return 'Administrateur';
      case 'super_admin':
        return 'Super Administrateur';
      case 'user':
      default:
        return 'Utilisateur';
    }
  };

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'admin':
        return 'role-badge admin';
      case 'super_admin':
        return 'role-badge super-admin';
      case 'user':
      default:
        return 'role-badge user';
    }
  };

  return (
    <div className="user-menu">
      <button 
        className="user-menu-trigger"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="user-avatar">
          {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
        </div>
        <div className="user-info">
          <span className="user-name">{user.firstName} {user.lastName}</span>
          <span className={getRoleBadgeClass(user.role)}>
            {getRoleDisplayName(user.role)}
          </span>
        </div>
        <span className="dropdown-arrow">▼</span>
      </button>

      {isOpen && (
        <div className="user-menu-dropdown">
          <div className="user-menu-header">
            <div className="user-avatar-large">
              {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
            </div>
            <div className="user-details">
              <h4>{user.firstName} {user.lastName}</h4>
              <p>{user.email}</p>
              <span className={getRoleBadgeClass(user.role)}>
                {getRoleDisplayName(user.role)}
              </span>
            </div>
          </div>

          <div className="user-menu-actions">
            <button 
              className="menu-action-btn"
              onClick={() => {
                if (onProfileClick) {
                  onProfileClick();
                }
                setIsOpen(false);
              }}
            >
              <span>👤</span>
              Mon profil
            </button>
            {authService.isAdmin() && (
              <button className="menu-action-btn">
                <span>🛠️</span>
                Administration
              </button>
            )}
            <hr />
            <button 
              className="menu-action-btn logout-btn"
              onClick={handleLogout}
            >
              <span>🚪</span>
              Se déconnecter
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
