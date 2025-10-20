import React, { useState } from 'react';
import { sendMessageToAgent } from '../service/bikeAdvisorService';
import './BikeAdvisor.css';

const BikeAdvisor = () => {
  const [messages, setMessages] = useState([
    {
      role: 'agent',
      text: 'Bonjour ! Je suis votre conseiller vélo. Dites-moi quel type de vélo vous cherchez et je vous aiderai à choisir le meilleur modèle !'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(`session-${Date.now()}`);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await sendMessageToAgent(input, sessionId);
      const agentMessage = { role: 'agent', text: response };
      setMessages(prev => [...prev, agentMessage]);
    } catch (error) {
      const errorMessage = { 
        role: 'agent', 
        text: 'Désolé, je rencontre un problème technique. Pouvez-vous réessayer ?' 
      };
      setMessages(prev => [...prev, errorMessage]);
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
    <div className="bike-advisor">
      <div className="advisor-header">
        <h3>🚴‍♂️ Conseiller Vélo</h3>
        <p>Posez-moi vos questions sur les vélos !</p>
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
            {isLoading ? '⏳' : '➤'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BikeAdvisor;
