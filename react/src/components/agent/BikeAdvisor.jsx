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
  const [sessionId] = useState('087eac84444f4a16a6daeeb1a995cbb1');
  const [isOpen, setIsOpen] = useState(true);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await sendMessageToAgent(input, sessionId);
      
      // Si pas de réponse de l'agent n8n, ne pas ajouter de message
      if (response) {
        const agentMessage = { role: 'agent', text: response };
        setMessages(prev => [...prev, agentMessage]);
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
