import React, { useState } from 'react';
import './OrderHistory.css';

const OrderHistory = ({ orders, onRefresh }) => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filter, setFilter] = useState('all');

  const getStatusColor = (status) => {
    const statusColors = {
      'pending': '#ffc107',
      'confirmed': '#17a2b8',
      'processing': '#007bff',
      'shipped': '#6f42c1',
      'delivered': '#28a745',
      'cancelled': '#dc3545',
      'refunded': '#6c757d',
    };
    return statusColors[status?.code || status] || '#6c757d';
  };

  const getStatusLabel = (status) => {
    return status?.name || status?.code || 'Inconnu';
  };

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(order => order.status?.code === filter);

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

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  if (orders.length === 0) {
    return (
      <div className="order-history-empty">
        <p>Vous n'avez pas encore de commandes</p>
      </div>
    );
  }

  return (
    <div className="order-history">
      <div className="order-history-header">
        <h2>Historique des commandes</h2>
        <select 
          value={filter} 
          onChange={(e) => setFilter(e.target.value)}
          className="filter-select"
        >
          <option value="all">Toutes les commandes</option>
          <option value="pending">En attente</option>
          <option value="confirmed">Confirmées</option>
          <option value="processing">En traitement</option>
          <option value="shipped">Expédiées</option>
          <option value="delivered">Livrées</option>
          <option value="cancelled">Annulées</option>
        </select>
      </div>

      <div className="orders-list">
        {filteredOrders.map(order => (
          <div 
            key={order.id} 
            className={`order-card ${selectedOrder?.id === order.id ? 'expanded' : ''}`}
            onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
          >
            <div className="order-card-header">
              <div className="order-info">
                <h3>Commande {order.orderNumber}</h3>
                <p className="order-date">{formatDate(order.createdAt)}</p>
              </div>
              <div className="order-meta">
                <span 
                  className="order-status"
                  style={{ backgroundColor: getStatusColor(order.status) }}
                >
                  {getStatusLabel(order.status)}
                </span>
                <span className="order-total">{formatPrice(order.total)}</span>
              </div>
            </div>

            {selectedOrder?.id === order.id && (
              <div className="order-details">
                <div className="order-items">
                  <h4>Articles commandés</h4>
                  {order.items?.map((item, index) => (
                    <div key={index} className="order-item">
                      <div className="item-info">
                        <span className="item-name">{item.productName || item.product?.name}</span>
                        <span className="item-quantity">x{item.quantity}</span>
                      </div>
                      <span className="item-price">{formatPrice(item.subtotal)}</span>
                    </div>
                  ))}
                </div>

                <div className="order-summary">
                  <div className="summary-row">
                    <span>Sous-total</span>
                    <span>{formatPrice(order.subtotal)}</span>
                  </div>
                  {order.tax && (
                    <div className="summary-row">
                      <span>Taxes</span>
                      <span>{formatPrice(order.tax)}</span>
                    </div>
                  )}
                  {order.shippingCost && (
                    <div className="summary-row">
                      <span>Livraison</span>
                      <span>{formatPrice(order.shippingCost)}</span>
                    </div>
                  )}
                  <div className="summary-row total">
                    <span>Total</span>
                    <span>{formatPrice(order.total)}</span>
                  </div>
                </div>

                {order.shippingAddress && (
                  <div className="order-address">
                    <h4>Adresse de livraison</h4>
                    <p>{order.shippingAddress.street}</p>
                    {order.shippingAddress.streetComplement && (
                      <p>{order.shippingAddress.streetComplement}</p>
                    )}
                    <p>
                      {order.shippingAddress.postalCode} {order.shippingAddress.city}
                    </p>
                    <p>{order.shippingAddress.country}</p>
                  </div>
                )}

                {order.notes && (
                  <div className="order-notes">
                    <h4>Notes</h4>
                    <p>{order.notes}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <div className="no-orders">
          <p>Aucune commande trouvée avec ce filtre</p>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;

