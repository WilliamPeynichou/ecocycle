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
    return data.advice || data.message || 'Désolé, je n\'ai pas pu traiter votre demande.';
  } catch (error) {
    console.error('Erreur agent vélo:', error);
    // Retourne une réponse de fallback en cas d'erreur
    return 'Je suis votre conseiller vélo ! Dites-moi quel type de vélo vous cherchez (VTT, route, ville, électrique) et je vous aiderai à choisir.';
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