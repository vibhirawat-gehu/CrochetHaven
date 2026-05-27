import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import './Orders.css';

const STATUS_COLORS = {
  placed: '#888',
  confirmed: '#2196F3',
  shipped: '#FF9800',
  delivered: '#4CAF50',
  cancelled: '#F44336'
};

const PAYMENT_ICONS = {
  COD: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="3"/><path d="M6 12h.01M18 12h.01"/>
    </svg>
  ),
  UPI: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/><path d="M9 7l3 3 3-3M12 10V6"/>
    </svg>
  ),
  Card: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/><line x1="6" y1="15" x2="10" y2="15"/>
    </svg>
  )
};

const PAYMENT_LABELS = { COD: 'Cash on Delivery', UPI: 'UPI / Net Banking', Card: 'Credit/Debit Card' };

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders/my')
      .then(res => setOrders(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="spinner" />;

  if (orders.length === 0) {
    return (
      <div className="empty-state" style={{ padding: '100px 20px' }}>
        <div className="empty-icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2"/>
            <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
            <line x1="9" y1="12" x2="15" y2="12"/><line x1="9" y1="16" x2="13" y2="16"/>
          </svg>
        </div>
        <h2>No orders yet</h2>
        <p>Your order history will appear here.</p>
        <Link to="/shop" className="btn-primary" style={{ marginTop: 24, display: 'inline-block' }}>
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="orders-page container">
      <h1 className="section-title" style={{ marginBottom: 32 }}>My Orders</h1>
      <div className="orders-list">
        {orders.map(order => (
          <div key={order._id} className="order-card">
            <div className="order-card-header">
              <div>
                <p className="order-id">Order #{order._id.slice(-8).toUpperCase()}</p>
                <p className="order-date">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              </div>
              <div className="order-right">
                <span className="order-status" style={{ color: STATUS_COLORS[order.orderStatus] || '#888' }}>
                  <svg width="8" height="8" viewBox="0 0 8 8"><circle cx="4" cy="4" r="4" fill="currentColor"/></svg>
                  {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                </span>
                <p className="order-total">₹{order.total}</p>
              </div>
            </div>
            <div className="order-items">
              {order.items.map((item, i) => (
                <div key={i} className="order-item">
                  <img src={item.image} alt={item.name} />
                  <div>
                    <p>{item.name}</p>
                    <p className="order-item-meta">Qty: {item.quantity} × ₹{item.price}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="order-card-footer">
              <span className="order-payment">
                {PAYMENT_ICONS[order.paymentMethod]}
                {PAYMENT_LABELS[order.paymentMethod] || order.paymentMethod}
              </span>
              <span>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{verticalAlign:'middle',marginRight:4}}><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                {order.shippingAddress.city}, {order.shippingAddress.state}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
