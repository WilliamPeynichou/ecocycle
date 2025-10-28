// Service pour gérer les vélos
const API_BASE_URL = 'http://localhost:8000/api';

export const bikeService = {
  // Récupérer tous les vélos
  async getAllBikes() {
    try {
      const response = await fetch(`${API_BASE_URL}/products`);
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des vélos');
      }
      const data = await response.json();
      return data.data || []; // Utiliser la structure de la nouvelle API
    } catch (error) {
      console.error('Erreur bikeService.getAllBikes:', error);
      return [];
    }
  },

  // Récupérer les vélos par catégorie
  async getBikesByCategory(category) {
    try {
      const response = await fetch(`${API_BASE_URL}/products/category/${encodeURIComponent(category)}`);
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des vélos par catégorie');
      }
      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Erreur bikeService.getBikesByCategory:', error);
      return [];
    }
  },

  // Rechercher des vélos
  async searchBikes(query, category = '', minPrice = '', maxPrice = '', limit = 50, offset = 0) {
    try {
      const params = new URLSearchParams();
      if (query) params.append('q', query);
      if (category) params.append('category', category);
      if (minPrice) params.append('min_price', minPrice);
      if (maxPrice) params.append('max_price', maxPrice);
      params.append('limit', limit);
      params.append('offset', offset);

      const response = await fetch(`${API_BASE_URL}/products/search?${params}`);
      if (!response.ok) {
        throw new Error('Erreur lors de la recherche de vélos');
      }
      const data = await response.json();
      return { products: data.data || [], total: data.total || 0, limit: limit, offset: offset };
    } catch (error) {
      console.error('Erreur bikeService.searchBikes:', error);
      return { products: [], total: 0, limit: limit, offset: offset };
    }
  },

  // Récupérer les catégories disponibles
  async getCategories() {
    try {
      const response = await fetch(`${API_BASE_URL}/products/categories`);
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des catégories');
      }
      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Erreur bikeService.getCategories:', error);
      return [];
    }
  },

  // Récupérer un vélo par ID
  async getBikeById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`);
      if (!response.ok) {
        throw new Error('Vélo non trouvé');
      }
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Erreur bikeService.getBikeById:', error);
      return null;
    }
  },

  // Formater le prix
  formatPrice(price) {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  },

  // Formater la description (tronquer si trop longue)
  formatDescription(description, maxLength = 100) {
    if (description.length <= maxLength) {
      return description;
    }
    return description.substring(0, maxLength) + '...';
  }
};
