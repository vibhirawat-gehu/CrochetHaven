function renderProducts(productsToRender, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';
  if (productsToRender.length === 0) {
    container.innerHTML = '<p style="text-align: center; grid-column: 1/-1;">No products found.</p>';
    return;
  }
  productsToRender.forEach(product => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <a href="product.html?id=${product.id}" class="product-link">
        <div class="product-img-wrapper">
          <img src="${product.image}" alt="${product.name}" class="product-img">
        </div>
      </a>
      <div class="product-category">${product.category}</div>
      <a href="product.html?id=${product.id}" class="product-link">
        <h3 class="product-name">${product.name}</h3>
      </a>
      <div class="product-price">₹${product.price}</div>
      <button class="btn btn-secondary" onclick="addToCart(${product.id})">Add to Cart</button>
    `;
    container.appendChild(card);
  });
}
function initShop() {
  const shopGrid = document.getElementById('shop-grid');
  if (!shopGrid) return;
  renderProducts(products, 'shop-grid');
  const searchInput = document.getElementById('search-input');
  const filterBtns = document.querySelectorAll('.filter-btn');
  let currentCategory = 'All';
  let searchQuery = '';
  function applyFilters() {
    let filtered = products;
    if (currentCategory !== 'All') {
      filtered = filtered.filter(p => p.category === currentCategory);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
    }
    renderProducts(filtered, 'shop-grid');
  }
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      applyFilters();
    });
  }
  filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      filterBtns.forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      currentCategory = e.target.dataset.category;
      applyFilters();
    });
  });
}
function renderCart() {
  const cartContainer = document.getElementById('cart-items-container');
  const cartTotalEl = document.getElementById('cart-total-amount');
  if (!cartContainer || !cartTotalEl) return;
  cartContainer.innerHTML = '';
  if (cart.length === 0) {
    cartContainer.innerHTML = '<div class="empty-cart"><h3>Your cart is empty.</h3><br><a href="shop.html" class="btn btn-primary">Go Shopping</a></div>';
    cartTotalEl.textContent = '0';
    return;
  }
  let total = 0;
  cart.forEach(item => {
    total += item.price * item.quantity;
    const cartItem = document.createElement('div');
    cartItem.className = 'cart-item';
    cartItem.innerHTML = `
      <img src="${item.image}" alt="${item.name}" class="cart-item-img">
      <div class="cart-item-details">
        <h3 class="cart-item-title">${item.name}</h3>
        <p class="cart-item-price">₹${item.price} each</p>
      </div>
      <div class="cart-item-controls">
        <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
        <span>${item.quantity}</span>
        <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
        <button class="cart-item-remove" title="Remove" onclick="removeFromCart(${item.id})">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
        </button>
      </div>
    `;
    cartContainer.appendChild(cartItem);
  });
  cartTotalEl.textContent = total;
}
function initProductDetail() {
  const container = document.getElementById('product-detail-container');
  if (!container) return;
  const params = new URLSearchParams(window.location.search);
  const productId = parseInt(params.get('id'));
  const product = products.find(p => p.id === productId);
  if (!product) {
    container.innerHTML = '<div class="empty-cart"><h3>Product not found.</h3><br><a href="shop.html" class="btn btn-primary">Go Shopping</a></div>';
    return;
  }
  container.innerHTML = `
    <div class="product-detail-wrapper">
      <div class="product-detail-img-wrapper">
        <img src="${product.image}" alt="${product.name}" class="product-detail-img">
      </div>
      <div class="product-detail-info">
        <div class="product-detail-category">${product.category}</div>
        <h1 class="product-detail-name">${product.name}</h1>
        <div class="product-detail-price">₹${product.price}</div>
        <p class="product-detail-desc">${product.description}</p>
        <div style="margin-top: auto;">
          <button class="btn btn-primary" style="padding: 1rem 3rem; width: 100%; font-size: 1.2rem;" onclick="addToCart(${product.id})">Add to Cart</button>
        </div>
      </div>
    </div>
  `;
}
document.addEventListener('DOMContentLoaded', () => {
  renderProducts(products.slice(0, 4), 'featured-grid');
  initShop();
  renderCart();
  initProductDetail();
});