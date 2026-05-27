import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  return (
    <div className="product-card" onClick={() => navigate(`/product/${product._id}`)}>
      <img src={product.image} alt={product.name} loading="lazy" />
      <div className="product-card-info">
        <span className="category-badge">{product.category}</span>
        <h3>{product.name}</h3>
        <div className="product-card-footer">
          <span className="product-price">₹{product.price}</span>
          <button
            className="add-to-cart-btn"
            onClick={e => { e.stopPropagation(); addToCart(product); }}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
