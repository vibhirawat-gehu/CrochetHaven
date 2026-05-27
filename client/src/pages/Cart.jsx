import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './Cart.css';

export default function Cart() {
  const { cart, cartTotal, removeFromCart, updateQuantity } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const shippingCost = cartTotal >= 500 ? 0 : (cart.length > 0 ? 49 : 0);

  if (cart.length === 0) {
    return (
      <div className="empty-state" style={{ padding: '100px 20px' }}>
        <div className="empty-icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 01-8 0"/>
          </svg>
        </div>
        <h2>Your cart is empty</h2>
        <p>Looks like you haven&apos;t added anything yet.</p>
        <Link to="/shop" className="btn-primary" style={{ marginTop: 24, display: 'inline-block' }}>
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-page container">
      <h1 className="section-title" style={{ marginBottom: 32 }}>Your Cart</h1>
      <div className="cart-layout">
        <div className="cart-items">
          {cart.map(item => (
            <div key={item.productId} className="cart-item">
              <img src={item.image} alt={item.name} />
              <div className="cart-item-info">
                <h3>{item.name}</h3>
                <p className="cart-item-price">₹{item.price} each</p>
              </div>
              <div className="cart-item-controls">
                <div className="qty-controls">
                  <button onClick={() => updateQuantity(item.productId, -1)}>−</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.productId, 1)}>+</button>
                </div>
                <p className="cart-item-total">₹{item.price * item.quantity}</p>
                <button className="remove-btn" onClick={() => removeFromCart(item.productId)} aria-label="Remove">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h2>Order Summary</h2>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>₹{cartTotal}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>{shippingCost === 0 ? <span className="free-shipping">FREE</span> : `₹${shippingCost}`}</span>
          </div>
          {cartTotal < 500 && cart.length > 0 && (
            <p className="free-shipping-note">Add ₹{500 - cartTotal} more for free shipping!</p>
          )}
          <div className="summary-row total-row">
            <span>Total</span>
            <span>₹{cartTotal + shippingCost}</span>
          </div>
          <button
            className="btn-primary checkout-btn"
            onClick={() => {
              if (!user) navigate('/login', { state: { from: { pathname: '/checkout' } } });
              else navigate('/checkout');
            }}
          >
            {user ? 'Proceed to Checkout' : 'Login to Checkout'}
          </button>
          <Link to="/shop" className="continue-shopping">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
