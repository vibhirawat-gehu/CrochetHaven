import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <h3>CrochetHaven</h3>
          <p>Handmade with love &amp; soft yarn.</p>
        </div>
        <div className="footer-links">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/shop">Shop</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>
        <div className="footer-links">
          <h4>Account</h4>
          <ul>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Sign Up</Link></li>
            <li><Link to="/orders">My Orders</Link></li>
          </ul>
        </div>
        <div className="footer-links">
          <h4>Categories</h4>
          <ul>
            <li><Link to="/shop?category=Flowers">Flowers</Link></li>
            <li><Link to="/shop?category=Plushies">Plushies</Link></li>
            <li><Link to="/shop?category=Bags">Bags</Link></li>
            <li><Link to="/shop?category=Keychains">Keychains</Link></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} CrochetHaven. Made with
          <svg width="14" height="14" viewBox="0 0 24 24" fill="#ffb6c1" stroke="#ffb6c1" strokeWidth="1" style={{verticalAlign:'middle',margin:'0 4px'}}><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
          and love.
        </p>
      </div>
    </footer>
  );
}
