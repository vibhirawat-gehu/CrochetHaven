# Crochet Haven

![Crochet Haven Hero](images/hero.png)

**Crochet Haven** is a beautiful, fully-responsive frontend e-commerce website designed for selling handmade crochet products. Built with a soft pastel aesthetic and a cozy, handcrafted vibe, this project demonstrates modern web design principles and state management using purely Vanilla HTML, CSS, and JavaScript.

## Features

- **Soft Pastel Aesthetic:** A carefully curated color palette (cream, pastel pink, lavender) designed to evoke warmth and coziness.
- **Dynamic Product Rendering:** Products are dynamically injected into the Shop and Featured sections using JavaScript.
- **Functional Shopping Cart:** Users can add items to the cart, increase/decrease quantities, and remove items. The cart persists across page reloads using browser `localStorage`.
- **Search & Filtering:** Real-time text search and category filtering (Flowers, Plushies, Bags, Keychains) on the Shop page.
- **Custom In-Page Notifications:** Beautiful, animated toast notifications replace native browser alerts for a premium user experience.
- **Responsive Design:** Fully responsive layout utilizing CSS Flexbox, Grid, and media queries for seamless mobile and desktop viewing.
- **Clean UI Elements:** Crisp SVG icons used throughout the interface for a sharp, professional look.

## Tech Stack

This project was built entirely from scratch with **zero external dependencies** or frameworks to keep it beginner-friendly and lightweight.

- **HTML5:** Semantic markup and multi-page structure (`index.html`, `shop.html`, `cart.html`, etc.).
- **CSS3:** Custom styling, CSS variables, animations, and responsive layouts.
- **Vanilla JavaScript:** DOM manipulation, array filtering, and `localStorage` state management.

## 📂 Project Structure

```text
📁 Crochet e-com website
├── 📄 index.html        # Landing page with hero, categories, and featured items
├── 📄 shop.html         # Full product catalog with search and filters
├── 📄 product.html      # Dynamic product details page
├── 📄 cart.html         # Shopping cart with total calculations
├── 📄 contact.html      # Contact form and about info
├── 📁 css
│   └── 📄 style.css     # Global styles, variables, and responsive rules
├── 📁 js
│   ├── 📄 products.js   # Product data array (JSON-like structure)
│   ├── 📄 main.js       # Core logic for rendering, filtering, and UI
│   └── 📄 cart.js       # Cart logic and localStorage management
└── 📁 images            # High-quality AI-generated product images
```

## Getting Started

Since this is a purely frontend, static project, running it locally is incredibly simple.

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/crochet-haven.git
   ```
2. **Open the project folder:**
   Navigate into the downloaded `crochet-haven` directory.
3. **Run a local server:**
   To ensure the JavaScript runs correctly across multiple files without CORS issues, you should use a simple local development server.
   - _If using VS Code:_ Install the **Live Server** extension and click "Go Live".
   - _If using Python:_ Run `python -m http.server 8000` in your terminal and visit `http://localhost:8000`.
