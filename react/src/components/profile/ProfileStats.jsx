import React from 'react';
import './ProfileStats.css';

const ProfileStats = ({ user, orders, messages, addresses }) => {
  const totalSpent = orders.reduce((sum, order) => {
    return sum + parseFloat(order.total || 0);
  }, 0);

  const completedOrders = orders.filter(order => 
    order.status?.code === 'delivered' || order.status?.code === 'completed'
  ).length;

  const pendingOrders = orders.filter(order => 
    order.status?.code === 'pending' || order.status?.code === 'processing'
  ).length;

  const unreadMessages = messages.filter(m => !m.isRead).length;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  const stats = [
    {
      title: 'Total dépensé',
      value: formatPrice(totalSpent),
      icon: '💰',
      color: '#28a745'
    },
    {
      title: 'Commandes',
      value: orders.length,
      icon: '🛒',
      color: '#007bff',
      subtitle: `${completedOrders} livrées, ${pendingOrders} en cours`
    },
    {
      title: 'Messages',
      value: messages.length,
      icon: '💬',
      color: '#17a2b8',
      subtitle: unreadMessages > 0 ? `${unreadMessages} non lus` : 'Tous lus'
    },
    {
      title: 'Adresses',
      value: addresses.length,
      icon: '📍',
      color: '#6f42c1'
    }
  ];

  return (
    <div className="profile-stats">
      <h2>Vue d'ensemble</h2>
      
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card" style={{ borderLeftColor: stat.color }}>
            <div className="stat-icon" style={{ color: stat.color }}>
              {stat.icon}
            </div>
            <div className="stat-content">
              <div className="stat-value">{stat.value}</div>
              <div className="stat-title">{stat.title}</div>
              {stat.subtitle && (
                <div className="stat-subtitle">{stat.subtitle}</div>
              )}
            </div>
          </div>
        ))}
      </div>

      {orders.length > 0 && (
        <div className="recent-orders">
          <h3>Commandes récentes</h3>
          <div className="recent-orders-list">
            {orders.slice(0, 5).map(order => (
              <div key={order.id} className="recent-order-item">
                <div className="order-info">
                  <span className="order-number">{order.orderNumber}</span>
                  <span className="order-date">
                    {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                  </span>
                </div>
                <div className="order-status-price">
                  <span className="order-status" style={{
                    backgroundColor: order.status?.code === 'delivered' ? '#28a745' : 
                                    order.status?.code === 'pending' ? '#ffc107' : '#007bff'
                  }}>
                    {order.status?.name || order.status?.code}
                  </span>
                  <span className="order-price">{formatPrice(order.total)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileStats;

