// Service pour gérer les vélos
const API_BASE_URL = '/api'; // Utiliser le proxy Vite

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

  // Rechercher des vélos avec filtres avancés
  async searchBikes(filters = {}, limit = 50, offset = 0) {
    try {
      const params = new URLSearchParams();
      
      if (filters.search) params.append('q', filters.search);
      if (filters.category) params.append('category', filters.category);
      if (filters.minPrice) params.append('min_price', filters.minPrice);
      if (filters.maxPrice) params.append('max_price', filters.maxPrice);
      if (filters.brandId) params.append('brand_id', filters.brandId);
      if (filters.brakeTypeId) params.append('brake_type_id', filters.brakeTypeId);
      if (filters.transmitionTypeId) params.append('transmition_type_id', filters.transmitionTypeId);
      if (filters.frameSizeId) params.append('frame_size_id', filters.frameSizeId);
      if (filters.wheelSizeId) params.append('wheel_size_id', filters.wheelSizeId);
      if (filters.typeVeloId) params.append('type_velo_id', filters.typeVeloId);
      if (filters.tyresId) params.append('tyres_id', filters.tyresId);
      if (filters.teamId) params.append('team_id', filters.teamId);
      
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
    const numericPrice = parseFloat(price);
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(numericPrice);
  },

  // Formater la description (tronquer si trop longue)
  formatDescription(description, maxLength = 100) {
    if (!description) return '';
    if (description.length <= maxLength) {
      return description;
    }
    return description.substring(0, maxLength) + '...';
  },

  // Récupérer les options de filtres
  async getFilterOptions() {
    try {
      const response = await fetch(`${API_BASE_URL}/references/all`);
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des options de filtres');
      }
      const data = await response.json();
      
      // Récupérer aussi les catégories
      const categoriesResponse = await fetch(`${API_BASE_URL}/products/categories`);
      const categoriesData = await categoriesResponse.json();
      
      return {
        ...data.data,
        categories: categoriesData.data || []
      };
    } catch (error) {
      console.error('Erreur bikeService.getFilterOptions:', error);
      return {
        brands: [],
        types: [],
        frameSizes: [],
        wheelSizes: [],
        tyres: [],
        transmissions: [],
        brakes: [],
        teams: [],
        categories: []
      };
    }
  }
};
