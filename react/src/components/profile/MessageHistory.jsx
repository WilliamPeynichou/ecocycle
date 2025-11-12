import React, { useState } from 'react';
import './MessageHistory.css';

const MessageHistory = ({ messages, onRefresh }) => {
  const [filter, setFilter] = useState('all');

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredMessages = filter === 'all'
    ? messages
    : filter === 'unread'
    ? messages.filter(m => !m.isRead)
    : messages.filter(m => m.direction === filter);

  const unreadCount = messages.filter(m => !m.isRead).length;

  if (messages.length === 0) {
    return (
      <div className="message-history-empty">
        <p>Vous n'avez pas encore de messages</p>
      </div>
    );
  }

  return (
    <div className="message-history">
      <div className="message-history-header">
        <h2>Messages à l'agent</h2>
        <div className="message-filters">
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">Tous les messages</option>
            <option value="unread">Non lus ({unreadCount})</option>
            <option value="user_to_agent">Mes messages</option>
            <option value="agent_to_user">Réponses de l'agent</option>
          </select>
        </div>
      </div>

      <div className="messages-list">
        {filteredMessages.map(message => (
          <div 
            key={message.id} 
            className={`message-card ${!message.isRead ? 'unread' : ''} ${message.direction === 'agent_to_user' ? 'from-agent' : 'from-user'}`}
          >
            <div className="message-header">
              <div className="message-meta">
                <span className="message-direction">
                  {message.direction === 'agent_to_user' ? '👤 Agent' : '👤 Vous'}
                </span>
                <span className="message-date">{formatDate(message.createdAt)}</span>
              </div>
              {!message.isRead && (
                <span className="unread-badge">Nouveau</span>
              )}
            </div>
            
            <div className="message-content">
              <p>{message.message}</p>
            </div>

            {message.relatedOrder && (
              <div className="message-related-order">
                <span>📦 Commande liée: {message.relatedOrder.orderNumber || message.relatedOrder}</span>
              </div>
            )}

            {message.status && (
              <div className="message-status">
                <span className={`status-badge status-${message.status}`}>
                  {message.status === 'pending' && '⏳ En attente'}
                  {message.status === 'answered' && '✅ Répondu'}
                  {message.status === 'resolved' && '✓ Résolu'}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredMessages.length === 0 && (
        <div className="no-messages">
          <p>Aucun message trouvé avec ce filtre</p>
        </div>
      )}
    </div>
  );
};

export default MessageHistory;

