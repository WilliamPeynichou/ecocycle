import React, { useState } from 'react';
import { sendMessageToAgent } from '../../service/bikeAdvisorService';
import './BikeAdvisor.css';

const BikeAdvisor = ({ onToggle }) => {
  const [messages, setMessages] = useState([
    {
      role: 'agent',
      text: 'Bonjour ! Je suis votre conseiller vélo. Dites-moi quel type de vélo vous cherchez et je vous aiderai à choisir le meilleur modèle !'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState(() => {
    // Génère un sessionId unique par session de conversation
    return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  });
  const [isOpen, setIsOpen] = useState(true);
  const [showEndConfirmation, setShowEndConfirmation] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    try {
      const response = await sendMessageToAgent(currentInput, sessionId);
      
      // Si pas de réponse de l'agent n8n, ne pas ajouter de message
      if (response && response.advice) {
        const agentMessage = { role: 'agent', text: response.advice };
        setMessages(prev => [...prev, agentMessage]);
        
        // Met à jour le sessionId si retourné par l'API
        if (response.sessionId) {
          setSessionId(response.sessionId);
        }
      }
    } catch (error) {
      console.error('Erreur communication agent:', error);
      // Ne pas afficher de message d'erreur, laisser l'utilisateur réessayer
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleEndConversation = () => {
    // Les messages sont déjà sauvegardés en BDD avec le sessionId actuel
    // On génère un nouveau sessionId pour la prochaine conversation
    const newSessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    setSessionId(newSessionId);
    
    // AfficherError in sub-node ‘Simple Memory‘ un message de confirmation
    setShowEndConfirmation(true);
    
    // Réinitialiser les messages avec juste le message de bienvenue
    setMessages([
      {
        role: 'agent',
        text: 'Bonjour ! Je suis votre conseiller vélo. Dites-moi quel type de vélo vous cherchez et je vous aiderai à choisir le meilleur modèle !'
      }
    ]);
    
    // Réinitialiser l'input
    setInput('');
    
    // Masquer la confirmation après 3 secondes
    setTimeout(() => {
      setShowEndConfirmation(false);
    }, 3000);
  };

  return (
    <>
      {/* Bouton Toggle */}
      <button 
        className={`agent-toggle ${isOpen ? 'open' : ''}`}
        onClick={() => {
          const newState = !isOpen;
          setIsOpen(newState);
          onToggle(newState);
        }}
        aria-label={isOpen ? 'Fermer le conseiller' : 'Ouvrir le conseiller'}
      >

        <span className="toggle-text">
          {isOpen ? 'Fermer' : 'Conseiller'}
        </span>
      </button>

      {/* Agent Panel */}
      <div className={`bike-advisor ${isOpen ? 'open' : ''}`}>
        <div className="advisor-header">
          <h3>Conseiller Vélo</h3>
          <p>Posez-moi vos questions !</p>
        </div>
        
        <div className="chat-container">
          <div className="messages">
            {messages.map((msg, i) => (
              <div key={i} className={`message ${msg.role}`}>
                <div className="message-content">
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="message agent">
                <div className="message-content">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Bouton Fin de conversation - affiché seulement s'il y a des messages utilisateur */}
          {messages.filter(msg => msg.role === 'user').length > 0 && (
            <div className="end-conversation-container">
              {showEndConfirmation && (
                <div className="end-conversation-confirmation">
                  ✓ Conversation enregistrée ! Vous pouvez la retrouver dans votre profil.
                </div>
              )}
              <button 
                onClick={handleEndConversation}
                className="end-conversation-button"
                disabled={isLoading}
                title="Terminer cette conversation et en commencer une nouvelle. La conversation sera visible dans votre profil."
              >
                ✓ Fin de conversation
              </button>
            </div>
          )}
          
          <div className="input-container">
            <input 
              type="text"
              value={input} 
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Posez votre question sur les vélos..."
              disabled={isLoading}
            />
            <button 
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="send-button"
            >
              {isLoading ? 'envoi...' : '➤'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default BikeAdvisor;
