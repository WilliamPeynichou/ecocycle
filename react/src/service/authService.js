// Service pour gérer l'authentification
const API_BASE_URL = '/api'; // Utiliser le proxy Vite

export const authService = {
  // Inscription
  async register(userData) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de l\'inscription');
      }

      return data;
    } catch (error) {
      console.error('Erreur authService.register:', error);
      throw error;
    }
  },

  // Connexion
  async login(email, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de la connexion');
      }

      // Stocker les informations de l'utilisateur dans le localStorage
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('isAuthenticated', 'true');

      return data;
    } catch (error) {
      console.error('Erreur authService.login:', error);
      throw error;
    }
  },

  // Déconnexion
  async logout() {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Nettoyer le localStorage
      localStorage.removeItem('user');
      localStorage.removeItem('isAuthenticated');

      return response.ok;
    } catch (error) {
      console.error('Erreur authService.logout:', error);
      // Nettoyer quand même le localStorage en cas d'erreur
      localStorage.removeItem('user');
      localStorage.removeItem('isAuthenticated');
      return true;
    }
  },

  // Récupérer le profil utilisateur
  async getProfile() {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de la récupération du profil');
      }

      return data;
    } catch (error) {
      console.error('Erreur authService.getProfile:', error);
      throw error;
    }
  },

  // Vérifier si l'utilisateur est connecté
  isAuthenticated() {
    return localStorage.getItem('isAuthenticated') === 'true';
  },

  // Récupérer les informations de l'utilisateur connecté
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Vérifier si l'utilisateur a un rôle spécifique
  hasRole(role) {
    const user = this.getCurrentUser();
    return user && user.roles && user.roles.includes(`ROLE_${role.toUpperCase()}`);
  },

  // Vérifier si l'utilisateur est admin
  isAdmin() {
    return this.hasRole('ADMIN') || this.hasRole('SUPER_ADMIN');
  },

  // Vérifier si l'utilisateur est super admin
  isSuperAdmin() {
    return this.hasRole('SUPER_ADMIN');
  }
};
