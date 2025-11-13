// Service pour gérer les données utilisateur et profil
const API_BASE_URL = '/api';

const getAuthHeaders = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const headers = {
    'Content-Type': 'application/json',
  };
  
  // Ajouter l'email de l'utilisateur dans les headers pour l'authentification stateless
  if (user.email) {
    headers['X-User-Email'] = user.email;
  } else {
    console.warn('getAuthHeaders: Aucun email trouvé dans localStorage.user:', user);
  }
  
  // Si un token existe, l'ajouter aussi
  if (user.token) {
    headers['Authorization'] = `Bearer ${user.token}`;
  }
  
  return headers;
};

export const userService = {
  // Récupérer le profil complet de l'utilisateur
  async getProfile() {
    try {
      // Essayer d'abord /api/users/profile, puis /api/auth/profile en fallback
      let response = await fetch(`${API_BASE_URL}/users/profile`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        // Fallback sur /api/auth/profile
        response = await fetch(`${API_BASE_URL}/auth/profile`, {
          method: 'GET',
          headers: getAuthHeaders(),
        });
      }

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération du profil');
      }

      const data = await response.json();
      // Normaliser la réponse (peut venir de /users/profile ou /auth/profile)
      return data.user || data.data || data;
    } catch (error) {
      console.error('Erreur userService.getProfile:', error);
      throw error;
    }
  },

  // Récupérer les commandes de l'utilisateur
  async getOrders() {
    try {
      const headers = getAuthHeaders();
      console.log('getOrders - Headers:', headers);
      
      if (!headers['X-User-Email']) {
        throw new Error('Email utilisateur manquant. Veuillez vous reconnecter.');
      }
      
      const response = await fetch(`${API_BASE_URL}/users/orders`, {
        method: 'GET',
        headers: headers,
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('getOrders - Erreur:', response.status, errorData);
        throw new Error(errorData.message || 'Erreur lors de la récupération des commandes');
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
      const headers = getAuthHeaders();
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      
      console.log('getMessages - localStorage.user:', storedUser);
      console.log('getMessages - Headers envoyés:', headers);
      
      if (!headers['X-User-Email']) {
        console.error('getMessages - Email manquant dans headers!');
        throw new Error('Email utilisateur manquant. Veuillez vous reconnecter.');
      }
      
      const response = await fetch(`${API_BASE_URL}/users/messages`, {
        method: 'GET',
        headers: headers,
        credentials: 'include' // Inclure les cookies si nécessaire
      });

      console.log('getMessages - Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('getMessages - Erreur:', response.status, errorData);
        throw new Error(errorData.message || 'Erreur lors de la récupération des messages');
      }

      const data = await response.json();
      console.log('getMessages - Success:', data);
      return data;
    } catch (error) {
      console.error('Erreur userService.getMessages:', error);
      throw error;
    }
  },

  // Récupérer les adresses
  async getAddresses() {
    try {
      const headers = getAuthHeaders();
      console.log('getAddresses - Headers:', headers);
      
      if (!headers['X-User-Email']) {
        throw new Error('Email utilisateur manquant. Veuillez vous reconnecter.');
      }
      
      const response = await fetch(`${API_BASE_URL}/users/addresses`, {
        method: 'GET',
        headers: headers,
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('getAddresses - Erreur:', response.status, errorData);
        throw new Error(errorData.message || 'Erreur lors de la récupération des adresses');
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

