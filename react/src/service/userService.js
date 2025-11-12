// Service pour gérer les données utilisateur et profil
const API_BASE_URL = '/api';

const getAuthHeaders = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${user.token || ''}`,
  };
};

export const userService = {
  // Récupérer le profil complet de l'utilisateur
  async getProfile() {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération du profil');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur userService.getProfile:', error);
      throw error;
    }
  },

  // Récupérer les commandes de l'utilisateur
  async getOrders() {
    try {
      const response = await fetch(`${API_BASE_URL}/users/orders`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des commandes');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur userService.getOrders:', error);
      throw error;
    }
  },

  // Récupérer les messages à l'agent
  async getMessages() {
    try {
      const response = await fetch(`${API_BASE_URL}/users/messages`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des messages');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur userService.getMessages:', error);
      throw error;
    }
  },

  // Récupérer les adresses
  async getAddresses() {
    try {
      const response = await fetch(`${API_BASE_URL}/users/addresses`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des adresses');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur userService.getAddresses:', error);
      throw error;
    }
  },

  // Mettre à jour le profil
  async updateProfile(userData) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/profile`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour du profil');
      }

      const data = await response.json();
      // Mettre à jour le localStorage
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      return data;
    } catch (error) {
      console.error('Erreur userService.updateProfile:', error);
      throw error;
    }
  },

  // Ajouter une adresse
  async addAddress(addressData) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/addresses`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(addressData),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'ajout de l\'adresse');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur userService.addAddress:', error);
      throw error;
    }
  },

  // Supprimer une adresse
  async deleteAddress(addressId) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/addresses/${addressId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression de l\'adresse');
      }

      return true;
    } catch (error) {
      console.error('Erreur userService.deleteAddress:', error);
      throw error;
    }
  },
};

