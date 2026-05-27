import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useCart } from '../context/CartContext';
import './ProductDetail.css';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [qty, setQty] = useState(1);

  useEffect(() => {
    setLoading(true);
    api.get(`/products/${id}`)
      .then(res => setProduct(res.data))
      .catch(() => setError('Product not found.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="spinner" />;
  if (error) return (
    <div className="empty-state container" style={{ paddingTop: 80 }}>
      <h2>Product Not Found</h2>
      <p>{error}</p>
      <button className="btn-primary" style={{ marginTop: 24 }} onClick={() => navigate('/shop')}>
        Back to Shop
      </button>
    </div>
  );

  return (
    <div className="product-detail-page container">
      <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
      <div className="product-detail">
        <div className="product-detail-image">
          <img src={product.image} alt={product.name} />
        </div>
        <div className="product-detail-info">
          <span className="category-badge" style={{ fontSize: '0.9rem', marginBottom: 12 }}>
            {product.category}
          </span>
          <h1>{product.name}</h1>
          <p className="detail-price">₹{product.price}</p>
          <p className="detail-description">{product.description}</p>

          <div className="stock-info">
            <span className={product.stock > 0 ? 'in-stock' : 'out-stock'}>
              {product.stock > 0 ? `In Stock (${product.stock} left)` : 'Out of Stock'}
            </span>
          </div>

          {product.stock > 0 && (
            <>
              <div className="qty-selector">
                <label>Quantity</label>
                <div className="qty-controls">
                  <button onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
                  <span>{qty}</span>
                  <button onClick={() => setQty(q => Math.min(product.stock, q + 1))}>+</button>
                </div>
              </div>
              <button
                className="btn-primary detail-cart-btn"
                onClick={() => {
                  for (let i = 0; i < qty; i++) addToCart(product);
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
                Add {qty > 1 ? `${qty} items` : 'to Cart'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
