import React from 'react';
import './MessageHistory.css';

const MessageHistory = ({ messages, onRefresh }) => {
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!messages || messages.length === 0) {
    return (
      <div className="message-history-empty">
        <p>Vous n'avez pas encore envoyé de messages à l'agent</p>
      </div>
    );
  }

  return (
    <div className="message-history">
      <div className="message-history-header">
        <h2>Historique des messages</h2>
        <div className="messages-summary">
          <span>{messages.length} message{messages.length > 1 ? 's' : ''}</span>
        </div>
      </div>

      <div className="messages-list">
        {messages.map((message) => (
          <div key={message.id} className="message-item">
            <div className="message-content">
              <p>{message.message}</p>
            </div>
            <div className="message-footer">
              <span className="message-date">{formatDate(message.createdAt)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MessageHistory;

