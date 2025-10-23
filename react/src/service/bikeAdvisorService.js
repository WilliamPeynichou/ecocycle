// Service pour communiquer avec l'API de conseil vélo
export const sendMessageToAgent = async (message, sessionId) => {
  try {
    // Utilise l'API Symfony locale pour le conseil vélo
    const response = await fetch('/api/bike-advice', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({
        message: message,
        sessionId: sessionId || `user-${Date.now()}`
      })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Si pas de réponse de l'agent n8n, retourne null
    if (!data.advice) {
      return null;
    }
    
    return data.advice;
  } catch (error) {
    console.error('Erreur agent vélo:', error);
    // Retourne null en cas d'erreur pour forcer l'utilisation de n8n
    return null;
  }
};

// Fonction pour obtenir des conseils basés sur le type de vélo
export const getBikeRecommendation = async (bikeType, budget, usage) => {
  try {
    const response = await fetch('/api/bike-recommendation', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({
        bikeType,
        budget,
        usage
      })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.recommendations || [];
  } catch (error) {
    console.error('Erreur recommandation vélo:', error);
    return [];
  }
};

// Fonction pour obtenir des informations sur un vélo spécifique
export const getBikeDetails = async (bikeId) => {
  try {
    const response = await fetch(`/api/bike/${bikeId}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erreur détails vélo:', error);
    return null;
  }
};