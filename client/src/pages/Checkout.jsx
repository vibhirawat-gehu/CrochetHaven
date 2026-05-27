import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import './Checkout.css';

const STEPS = ['Shipping', 'Payment', 'Review'];

export default function Checkout() {
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [placedOrder, setPlacedOrder] = useState(null);

  const [shipping, setShipping] = useState({
    fullName: user?.name || '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    phone: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('COD');

  const shippingCost = cartTotal >= 500 ? 0 : 49;
  const total = cartTotal + shippingCost;

  const handleShippingChange = e =>
    setShipping(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const validateShipping = () => {
    const required = ['fullName', 'street', 'city', 'state', 'pincode', 'phone'];
    return required.every(k => shipping[k].trim());
  };

  const placeOrder = async () => {
    setSubmitting(true);
    setError('');
    try {
      const items = cart.map(i => ({ productId: i.productId, quantity: i.quantity }));
      const res = await api.post('/orders', { items, shippingAddress: shipping, paymentMethod });
      setPlacedOrder(res.data);
      clearCart();
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (cart.length === 0 && !placedOrder) {
    navigate('/cart');
    return null;
  }

  if (step === 3 && placedOrder) {
    return (
      <div className="checkout-success container">
        <div className="success-card">
          <div className="success-icon">
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#5a9a5a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          </div>
          <h1>Order Placed!</h1>
          <p>Thank you, <strong>{user?.name}</strong>! Your order has been placed successfully.</p>
          <div className="order-id-box">
            <span>Order ID:</span>
            <code>{placedOrder._id}</code>
          </div>
          <p className="delivery-note">Estimated delivery: 5-7 business days</p>
          <div className="success-actions">
            <button className="btn-primary" onClick={() => navigate('/orders')}>View My Orders</button>
            <button className="btn-outline" onClick={() => navigate('/shop')}>Continue Shopping</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page container">
      <h1 className="section-title" style={{ marginBottom: 32 }}>Checkout</h1>

      {/* Stepper */}
      <div className="stepper">
        {STEPS.map((s, i) => (
          <div key={s} className={`step ${i === step ? 'active' : ''} ${i < step ? 'done' : ''}`}>
            <div className="step-dot">
              {i < step
                ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                : i + 1}
            </div>
            <span>{s}</span>
          </div>
        ))}
      </div>

      <div className="checkout-layout">
        <div className="checkout-main">
          {/* Step 0: Shipping */}
          {step === 0 && (
            <div className="checkout-card">
              <h2>Shipping Address</h2>
              <div className="form-row-2">
                <div className="form-group">
                  <label>Full Name</label>
                  <input name="fullName" value={shipping.fullName} onChange={handleShippingChange} placeholder="Jane Doe" required />
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input name="phone" value={shipping.phone} onChange={handleShippingChange} placeholder="+91 98765 43210" required />
                </div>
              </div>
              <div className="form-group">
                <label>Street Address</label>
                <input name="street" value={shipping.street} onChange={handleShippingChange} placeholder="123, Rose Lane, Apartment 4B" required />
              </div>
              <div className="form-row-3">
                <div className="form-group">
                  <label>City</label>
                  <input name="city" value={shipping.city} onChange={handleShippingChange} placeholder="Mumbai" required />
                </div>
                <div className="form-group">
                  <label>State</label>
                  <input name="state" value={shipping.state} onChange={handleShippingChange} placeholder="Maharashtra" required />
                </div>
                <div className="form-group">
                  <label>Pincode</label>
                  <input name="pincode" value={shipping.pincode} onChange={handleShippingChange} placeholder="400001" required />
                </div>
              </div>
              <button
                className="btn-primary next-btn"
                onClick={() => {
                  if (validateShipping()) setStep(1);
                  else setError('Please fill all shipping fields.');
                }}
              >
                Continue to Payment
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </button>
              {error && <p className="error-msg">{error}</p>}
            </div>
          )}

          {/* Step 1: Payment */}
          {step === 1 && (
            <div className="checkout-card">
              <h2>Payment Method</h2>
              <div className="payment-options">
                {[
                  {
                    id: 'COD', label: 'Cash on Delivery', desc: 'Pay when your order arrives',
                    icon: (
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="6" width="20" height="12" rx="2"/>
                        <circle cx="12" cy="12" r="3"/>
                        <path d="M6 12h.01M18 12h.01"/>
                      </svg>
                    )
                  },
                  {
                    id: 'UPI', label: 'UPI / Net Banking', desc: 'Pay via UPI apps (GPay, PhonePe, etc.)',
                    icon: (
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="5" y="2" width="14" height="20" rx="2"/>
                        <line x1="12" y1="18" x2="12.01" y2="18"/>
                        <path d="M9 7l3 3 3-3M12 10V6"/>
                      </svg>
                    )
                  },
                  {
                    id: 'Card', label: 'Credit / Debit Card', desc: 'All major cards accepted',
                    icon: (
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="5" width="20" height="14" rx="2"/>
                        <line x1="2" y1="10" x2="22" y2="10"/>
                        <line x1="6" y1="15" x2="10" y2="15"/>
                      </svg>
                    )
                  }
                ].map(opt => (
                  <label
                    key={opt.id}
                    className={`payment-option ${paymentMethod === opt.id ? 'selected' : ''}`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={opt.id}
                      checked={paymentMethod === opt.id}
                      onChange={() => setPaymentMethod(opt.id)}
                    />
                    <span className="payment-icon">{opt.icon}</span>
                    <div>
                      <strong>{opt.label}</strong>
                      <p>{opt.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
              {paymentMethod !== 'COD' && (
                <div className="payment-note">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  Demo mode — no real payment will be processed.
                </div>
              )}
              <div className="step-btns">
                <button className="btn-outline" onClick={() => setStep(0)}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                  Back
                </button>
                <button className="btn-primary next-btn" onClick={() => setStep(2)}>
                  Review Order
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Review */}
          {step === 2 && (
            <div className="checkout-card">
              <h2>Review Your Order</h2>
              <div className="review-section">
                <h3>Shipping To</h3>
                <p>{shipping.fullName}<br />
                  {shipping.street}<br />
                  {shipping.city}, {shipping.state} — {shipping.pincode}<br />
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{verticalAlign:'middle',marginRight:4}}><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.22 1.18 2 2 0 012.22 0h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.08 6.08l1.08-.88a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 15.42v1.5z"/></svg>
                  {shipping.phone}
                </p>
              </div>
              <div className="review-section">
                <h3>Payment</h3>
                <p>
                  {paymentMethod === 'COD' && <><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{verticalAlign:'middle',marginRight:6}}><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="3"/></svg>Cash on Delivery</>}
                  {paymentMethod === 'UPI' && <><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{verticalAlign:'middle',marginRight:6}}><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/><path d="M9 7l3 3 3-3M12 10V6"/></svg>UPI / Net Banking</>}
                  {paymentMethod === 'Card' && <><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{verticalAlign:'middle',marginRight:6}}><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/><line x1="6" y1="15" x2="10" y2="15"/></svg>Credit/Debit Card</>}
                </p>
              </div>
              <div className="review-items">
                <h3>Items ({cart.length})</h3>
                {cart.map(item => (
                  <div key={item.productId} className="review-item">
                    <img src={item.image} alt={item.name} />
                    <span className="review-item-name">{item.name}</span>
                    <span>×{item.quantity}</span>
                    <span className="review-item-price">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
              {error && <p className="error-msg">{error}</p>}
              <div className="step-btns">
                <button className="btn-outline" onClick={() => setStep(1)}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                  Back
                </button>
                <button className="btn-primary next-btn place-btn" onClick={placeOrder} disabled={submitting}>
                  {submitting ? 'Placing Order...' : (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                      Place Order
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary Sidebar */}
        <div className="checkout-summary">
          <h3>Order Summary</h3>
          {cart.map(item => (
            <div key={item.productId} className="summary-item">
              <img src={item.image} alt={item.name} />
              <span>{item.name} ×{item.quantity}</span>
              <span>₹{item.price * item.quantity}</span>
            </div>
          ))}
          <div className="summary-divider" />
          <div className="summary-row"><span>Subtotal</span><span>₹{cartTotal}</span></div>
          <div className="summary-row"><span>Shipping</span><span>{shippingCost === 0 ? 'FREE' : `₹${shippingCost}`}</span></div>
          <div className="summary-row total-row"><span>Total</span><span>₹{total}</span></div>
        </div>
      </div>
    </div>
  );
}
