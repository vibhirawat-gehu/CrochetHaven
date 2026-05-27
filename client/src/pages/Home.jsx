import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';
import './Home.css';

const CATEGORIES = [
  {
    name: 'Flowers', color: '#ffe4ec',
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Center */}
        <circle cx="24" cy="24" r="5" fill="#e8798a"/>
        {/* Petals */}
        <ellipse cx="24" cy="11" rx="4" ry="7" fill="#f4a8b8" opacity="0.85"/>
        <ellipse cx="24" cy="37" rx="4" ry="7" fill="#f4a8b8" opacity="0.85"/>
        <ellipse cx="11" cy="24" rx="7" ry="4" fill="#f4a8b8" opacity="0.85"/>
        <ellipse cx="37" cy="24" rx="7" ry="4" fill="#f4a8b8" opacity="0.85"/>
        <ellipse cx="14.5" cy="14.5" rx="4" ry="7" transform="rotate(-45 14.5 14.5)" fill="#f9c5d1" opacity="0.7"/>
        <ellipse cx="33.5" cy="33.5" rx="4" ry="7" transform="rotate(-45 33.5 33.5)" fill="#f9c5d1" opacity="0.7"/>
        <ellipse cx="33.5" cy="14.5" rx="4" ry="7" transform="rotate(45 33.5 14.5)" fill="#f9c5d1" opacity="0.7"/>
        <ellipse cx="14.5" cy="33.5" rx="4" ry="7" transform="rotate(45 14.5 33.5)" fill="#f9c5d1" opacity="0.7"/>
        <circle cx="24" cy="24" r="5" fill="#e8798a"/>
        <circle cx="24" cy="24" r="2.5" fill="#fff" opacity="0.6"/>
      </svg>
    )
  },
  {
    name: 'Plushies', color: '#e8f4ff',
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Ears */}
        <circle cx="14" cy="14" r="7" fill="#a8cfe8"/>
        <circle cx="34" cy="14" r="7" fill="#a8cfe8"/>
        <circle cx="14" cy="14" r="4" fill="#c8e4f4"/>
        <circle cx="34" cy="14" r="4" fill="#c8e4f4"/>
        {/* Body */}
        <rect x="9" y="18" width="30" height="24" rx="12" fill="#a8cfe8"/>
        {/* Face */}
        <circle cx="19" cy="27" r="2.5" fill="#2d2d2d"/>
        <circle cx="29" cy="27" r="2.5" fill="#2d2d2d"/>
        <circle cx="20" cy="26" r="1" fill="#fff"/>
        <circle cx="30" cy="26" r="1" fill="#fff"/>
        {/* Blush */}
        <ellipse cx="15" cy="31" rx="3.5" ry="2" fill="#f4a8b8" opacity="0.6"/>
        <ellipse cx="33" cy="31" rx="3.5" ry="2" fill="#f4a8b8" opacity="0.6"/>
        {/* Smile */}
        <path d="M20 34 Q24 37.5 28 34" stroke="#2d2d2d" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
        {/* Belly */}
        <ellipse cx="24" cy="36" rx="7" ry="4" fill="#c8e4f4" opacity="0.7"/>
      </svg>
    )
  },
  {
    name: 'Bags', color: '#fff3e0',
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Handle */}
        <path d="M17 18 Q17 10 24 10 Q31 10 31 18" stroke="#d4956a" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
        {/* Bag body */}
        <rect x="10" y="18" width="28" height="22" rx="6" fill="#e8b98a"/>
        {/* Bag flap / top line */}
        <rect x="10" y="18" width="28" height="8" rx="6" fill="#d4956a"/>
        {/* Clasp */}
        <rect x="20" y="22" width="8" height="4" rx="2" fill="#fff" opacity="0.8"/>
        {/* Texture lines */}
        <line x1="16" y1="32" x2="16" y2="36" stroke="#d4956a" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
        <line x1="24" y1="30" x2="24" y2="38" stroke="#d4956a" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
        <line x1="32" y1="32" x2="32" y2="36" stroke="#d4956a" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
      </svg>
    )
  },
  {
    name: 'Keychains', color: '#e8ffe8',
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Ring */}
        <circle cx="24" cy="13" r="7" stroke="#6ab46a" strokeWidth="2.5" fill="none"/>
        <circle cx="24" cy="13" r="3.5" fill="#6ab46a" opacity="0.2"/>
        {/* Chain link */}
        <rect x="22" y="19" width="4" height="6" rx="2" fill="#6ab46a" opacity="0.7"/>
        {/* Star charm */}
        <path d="M24 28 L25.8 33.5 L31.5 33.5 L26.9 36.9 L28.7 42.5 L24 39 L19.3 42.5 L21.1 36.9 L16.5 33.5 L22.2 33.5 Z" fill="#6ab46a" opacity="0.9"/>
      </svg>
    )
  }
];

const FEATURES = [
  {
    title: '100% Handmade',
    desc: 'Each piece is lovingly crafted by hand with premium quality yarn.',
    icon: <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#e8798a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
  },
  {
    title: 'Eco-Friendly',
    desc: 'We use sustainable, natural materials in all our creations.',
    icon: <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#6ab46a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 8C8 10 5.9 16.17 3.82 19.82A2 2 0 005.6 22.5C9 21 12.5 19 17 8z"/><path d="M17 8c0-5-3-6-3-6s1 5-2 8"/></svg>
  },
  {
    title: 'Made with Love',
    desc: 'Every stitch carries care and attention to detail just for you.',
    icon: <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#a78bda" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z"/></svg>
  }
];

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/products?featured=true')
      .then(res => setFeatured(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="home">
      {/* Hero */}
      <section className="hero">
        <div className="hero-content">
          <span className="hero-tag">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
            Handmade with love
          </span>
          <h1>Beautiful Crochet <span>Creations</span></h1>
          <p>Discover one-of-a-kind handcrafted crochet pieces — from plushies and flowers to bags and keychains.</p>
          <div className="hero-btns">
            <Link to="/shop" className="btn-primary">Shop Now</Link>
            <Link to="/contact" className="btn-outline">Contact Us</Link>
          </div>
        </div>
        <div className="hero-image">
          <img src="/images/hero.png" alt="Crochet products" />
        </div>
      </section>

      {/* Categories */}
      <section className="page-section categories-section">
        <div className="container">
          <h2 className="section-title">Browse Categories</h2>
          <p className="section-sub">Find exactly what you're looking for</p>
          <div className="categories-grid">
            {CATEGORIES.map(cat => (
              <div key={cat.name} className="category-card" style={{ background: cat.color }} onClick={() => navigate(`/shop?category=${cat.name}`)}>
                <span className="cat-emoji">{cat.icon}</span>
                <h3>{cat.name}</h3>
                <span className="cat-link">
                  Shop now
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="page-section featured-section">
        <div className="container">
          <h2 className="section-title">Featured Products</h2>
          <p className="section-sub">Our most-loved pieces, handpicked for you</p>
          {loading ? <div className="spinner" /> : (
            <div className="product-grid">
              {featured.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          )}
          <div style={{ textAlign: 'center', marginTop: 40 }}>
            <Link to="/shop" className="btn-primary">View All Products</Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="page-section features-section">
        <div className="container">
          <div className="features-grid">
            {FEATURES.map(f => (
              <div key={f.title} className="feature-card">
                <span className="feature-icon">{f.icon}</span>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="newsletter-section">
        <div className="container">
          <div className="newsletter-card">
            <h2>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{verticalAlign:'middle',marginRight:8}}><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 01-2.06 0L2 7"/></svg>
              Stay in the Loop
            </h2>
            <p>Get notified about new products and exclusive offers.</p>
            <form className="newsletter-form" onSubmit={e => e.preventDefault()}>
              <input type="email" placeholder="Enter your email address" required />
              <button type="submit" className="btn-primary">Subscribe</button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
