// Product data from provided JSON
const products = [
  {
    id: 1,
    name: "5HP Air Compressor",
    price: 45000,
    currency: "₹",
    image: "5HP.jpg",
    category: "Industrial",
    description: "Professional grade 5HP air compressor suitable for small workshops and light industrial applications.",
    specifications: {
      "Power": "5 HP",
      "Pressure": "8-10 kg/cm²",
      "Tank Capacity": "100-150 liters", 
      "Air Delivery": "20-25 CFM",
      "Voltage": "415V 3-Phase"
    },
    features: ["Energy efficient", "Low maintenance", "Reliable performance", "Compact design"],
    applications: ["Small workshops", "Automotive service", "Light manufacturing", "Tool operation"]
  },
  {
    id: 2,
    name: "10HP Air Compressor",
    price: 75000,
    currency: "₹", 
    image: "10HP.jpg",
    category: "Industrial",
    description: "Industrial grade 10HP air compressor designed for medium capacity applications and continuous operation.",
    specifications: {
      "Power": "10 HP",
      "Pressure": "8-12 kg/cm²",
      "Tank Capacity": "200-300 liters",
      "Air Delivery": "40-50 CFM",
      "Voltage": "415V 3-Phase"
    },
    features: ["Heavy duty construction", "Continuous operation", "High efficiency", "Industrial grade"],
    applications: ["Medium manufacturing", "Spray painting", "Pneumatic tools", "Industrial processes"]
  },
  {
    id: 3,
    name: "15HP Air Compressor", 
    price: 120000,
    currency: "₹",
    image: "15HP.jpg",
    category: "Heavy Industrial",
    description: "Heavy duty 15HP air compressor for large industrial applications requiring high air flow and pressure.",
    specifications: {
      "Power": "15 HP",
      "Pressure": "10-15 kg/cm²",
      "Tank Capacity": "300-500 liters",
      "Air Delivery": "60-75 CFM",
      "Voltage": "415V 3-Phase"
    },
    features: ["Heavy duty industrial", "Maximum efficiency", "High pressure output", "Continuous operation"],
    applications: ["Large manufacturing", "Heavy industry", "Production lines", "High demand applications"]
  }
];

const companyInfo = {
  name: "Aditya Air Compressors",
  logo_image: "tag.jpg",
  certificate_image: "certificate.jpg", 
  badge_image: "badge.jpg",
  location: "Ghaziabad, Uttar Pradesh, India",
  contacts: ["+91 93120 66550", "+91 98999 92004"],
  email: "adityaaircompressor@gmail.com",
  address: "A-1, KHASRA NO. 56/4, POCKET-D, HASTSAL INDUSTRIAL AREA UTTAM NAGAR, NEW DELHI - 110059"
};

// Application state
let currentPage = 'home';
let cart = [];
let filteredProducts = [...products];
let currentProductId = null;
let currentProductQuantity = 1;

// DOM elements
let pages, navLinks, cartCount, cartIcon, mobileMenuToggle, nav, searchInput;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded, initializing app...');
  // Get DOM elements after DOM is loaded
  pages = document.querySelectorAll('.page');
  navLinks = document.querySelectorAll('.nav-link');
  cartCount = document.getElementById('cartCount');
  cartIcon = document.getElementById('cartIcon');
  mobileMenuToggle = document.getElementById('mobileMenuToggle');
  nav = document.getElementById('nav');
  searchInput = document.getElementById('searchInput');

  initializeApp();
  setupEventListeners();
  populateFeaturedProducts();
  populateProducts();
  setupFilters();
});

function initializeApp() {
  console.log('Initializing app...');
  // Set initial page
  showPage('home');
  updateCartDisplay();
  // Note: localStorage/sessionStorage not used per strict instructions
}

function setupEventListeners() {
  console.log('Setting up event listeners...');
  
  // Mobile menu toggle
  if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', function(e) {
      e.preventDefault();
      nav.classList.toggle('active');
    });
  }

  // Search functionality
  if (searchInput) {
    searchInput.addEventListener('input', function() {
      const searchTerm = this.value.toLowerCase();
      if (searchTerm) {
        filteredProducts = products.filter(product => 
          product.name.toLowerCase().includes(searchTerm) ||
          product.category.toLowerCase().includes(searchTerm) ||
          product.features.some(feature => feature.toLowerCase().includes(searchTerm))
        );
        showPage('products');
        populateProducts();
      } else {
        filteredProducts = [...products];
        if (currentPage === 'products') {
          populateProducts();
        }
      }
    });
  }

  // Cart icon click
  if (cartIcon) {
    cartIcon.addEventListener('click', function(e) {
      e.preventDefault();
      showPage('cart');
    });
  }

  // Price range slider
  const priceRange = document.getElementById('priceRange');
  const priceValue = document.getElementById('priceValue');
  
  if (priceRange && priceValue) {
    priceRange.addEventListener('input', function() {
      priceValue.textContent = this.value;
      applyFilters();
    });
  }

  // Clear filters
  const clearFilters = document.getElementById('clearFilters');
  if (clearFilters) {
    clearFilters.addEventListener('click', function(e) {
      e.preventDefault();
      document.querySelectorAll('.filter-options input[type="checkbox"]').forEach(cb => cb.checked = false);
      if (document.getElementById('priceRange')) {
        document.getElementById('priceRange').value = 150000;
        document.getElementById('priceValue').textContent = '150000';
      }
      if (document.getElementById('sortSelect')) {
        document.getElementById('sortSelect').value = 'name';
      }
      filteredProducts = [...products];
      populateProducts();
    });
  }

  // Contact form
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      alert('Thank you for your message! We will get back to you soon.');
      this.reset();
    });
  }

  // Checkout modal
  const checkoutBtn = document.getElementById('checkoutBtn');
  const checkoutModal = document.getElementById('checkoutModal');
  const closeModal = document.getElementById('closeModal');
  const checkoutForm = document.getElementById('checkoutForm');

  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', function(e) {
      e.preventDefault();
      if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
      }
      checkoutModal.classList.remove('hidden');
      updateCheckoutTotal();
    });
  }

  if (closeModal) {
    closeModal.addEventListener('click', function(e) {
      e.preventDefault();
      checkoutModal.classList.add('hidden');
    });
  }

  if (checkoutForm) {
    checkoutForm.addEventListener('submit', function(e) {
      e.preventDefault();
      checkoutModal.classList.add('hidden');
      cart = [];
      updateCartDisplay();
      showPage('success');
    });
  }

  // Sort functionality
  const sortSelect = document.getElementById('sortSelect');
  if (sortSelect) {
    sortSelect.addEventListener('change', function() {
      sortProducts(this.value);
      populateProducts();
    });
  }
}

function showPage(pageName) {
  console.log('Showing page:', pageName);
  // Hide all pages
  if (pages) {
    pages.forEach(page => page.classList.add('hidden'));
  }
  
  // Show selected page
  const targetPage = document.getElementById(pageName + 'Page');
  if (targetPage) {
    targetPage.classList.remove('hidden');
    console.log('Page shown:', pageName);
  } else {
    console.error('Page not found:', pageName + 'Page');
  }

  // Update navigation
  if (navLinks) {
    navLinks.forEach(link => link.classList.remove('active'));
    const activeLink = document.querySelector(`[onclick="showPage('${pageName}')"]`);
    if (activeLink && activeLink.classList.contains('nav-link')) {
      activeLink.classList.add('active');
    }
  }

  // Close mobile menu
  if (nav) {
    nav.classList.remove('active');
  }

  currentPage = pageName;

  // Page-specific initialization
  if (pageName === 'cart') {
    populateCart();
  } else if (pageName === 'products') {
    populateProducts();
  }
}

function populateFeaturedProducts() {
  const featuredGrid = document.getElementById('featuredGrid');
  if (!featuredGrid) return;

  featuredGrid.innerHTML = products.map((product, index) => `
    <div class="product-card" style="animation-delay: ${index * 0.1}s;">
      <div class="product-image">
        <img src="${product.image}" alt="${product.name}" loading="lazy" onerror="this.style.display='none'; this.parentElement.innerHTML='<div style=\\'display:flex;align-items:center;justify-content:center;height:100%;background:var(--color-bg-3);color:var(--color-text-secondary);\\'>Product Image</div>';">
      </div>
      <h3 class="product-name">${product.name}</h3>
      <div class="product-specs">
        <span>${product.specifications.Power}</span>
        <span>${product.specifications.Pressure}</span>
        <span>${product.category}</span>
      </div>
      <div class="product-price">₹${product.price.toLocaleString()}</div>
      <div class="product-actions">
        <button class="btn btn--secondary btn--sm" onclick="viewProduct(${product.id})">View Details</button>
        <button class="btn btn--primary btn--sm" onclick="addToCart(${product.id})">Add to Cart</button>
      </div>
    </div>
  `).join('');
}

function populateProducts() {
  const productsGrid = document.getElementById('productsGrid');
  if (!productsGrid) return;

  if (filteredProducts.length === 0) {
    productsGrid.innerHTML = `
      <div class="empty-cart">
        <i class="fas fa-search"></i>
        <p>No products found matching your criteria.</p>
      </div>
    `;
    return;
  }

  productsGrid.innerHTML = filteredProducts.map((product, index) => `
    <div class="product-card" style="animation-delay: ${index * 0.1}s;">
      <div class="product-image">
        <img src="${product.image}" alt="${product.name}" loading="lazy" onerror="this.style.display='none'; this.parentElement.innerHTML='<div style=\\'display:flex;align-items:center;justify-content:center;height:100%;background:var(--color-bg-3);color:var(--color-text-secondary);\\'>Product Image</div>';">
      </div>
      <h3 class="product-name">${product.name}</h3>
      <div class="product-specs">
        <span>${product.specifications.Power}</span>
        <span>${product.specifications.Pressure}</span>
        <span>${product.category}</span>
      </div>
      <div class="product-price">₹${product.price.toLocaleString()}</div>
      <div class="product-actions">
        <button class="btn btn--secondary btn--sm" onclick="viewProduct(${product.id})">View Details</button>
        <button class="btn btn--primary btn--sm" onclick="addToCart(${product.id})">Add to Cart</button>
      </div>
    </div>
  `).join('');
}

function setupFilters() {
  // Category filters
  const categoryFilters = document.getElementById('categoryFilters');
  if (categoryFilters) {
    categoryFilters.addEventListener('change', applyFilters);
  }

  // HP filters
  const hpFilters = document.getElementById('hpFilters');
  if (hpFilters) {
    hpFilters.addEventListener('change', applyFilters);
  }
}

function applyFilters() {
  let filtered = [...products];

  // Category filters
  const selectedCategories = Array.from(document.querySelectorAll('#categoryFilters input:checked')).map(cb => cb.value);
  if (selectedCategories.length > 0) {
    filtered = filtered.filter(product => selectedCategories.includes(product.category));
  }

  // HP filters
  const selectedHP = Array.from(document.querySelectorAll('#hpFilters input:checked')).map(cb => cb.value);
  if (selectedHP.length > 0) {
    filtered = filtered.filter(product => {
      const hp = parseInt(product.specifications.Power);
      return selectedHP.some(range => {
        if (range === '0-10') return hp <= 10;
        if (range === '10-20') return hp >= 10 && hp <= 20;
        return false;
      });
    });
  }

  // Price filter
  const maxPrice = document.getElementById('priceRange')?.value || 150000;
  filtered = filtered.filter(product => product.price <= maxPrice);

  filteredProducts = filtered;
  populateProducts();
}

function sortProducts(sortBy) {
  switch (sortBy) {
    case 'name':
      filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'price-low':
      filteredProducts.sort((a, b) => a.price - b.price);
      break;
    case 'price-high':
      filteredProducts.sort((a, b) => b.price - a.price);
      break;
    case 'hp':
      filteredProducts.sort((a, b) => {
        const hpA = parseInt(a.specifications.Power);
        const hpB = parseInt(b.specifications.Power);
        return hpA - hpB;
      });
      break;
    default:
      break;
  }
}

function viewProduct(productId) {
  console.log('Viewing product:', productId);
  const product = products.find(p => p.id === productId);
  if (!product) return;

  currentProductId = productId;
  currentProductQuantity = 1;
  
  const productDetail = document.getElementById('productDetail');
  if (!productDetail) return;

  productDetail.innerHTML = `
    <div class="product-detail-grid">
      <div class="product-gallery">
        <div class="main-image">
          <img src="${product.image}" alt="${product.name}" onerror="this.style.display='none'; this.parentElement.innerHTML='<div style=\\'display:flex;align-items:center;justify-content:center;height:100%;background:var(--color-bg-3);color:var(--color-text-secondary);\\'>Product Image</div>';">
        </div>
      </div>
      <div class="product-info">
        <h1>${product.name}</h1>
        <div class="product-price-large">₹${product.price.toLocaleString()}</div>
        <p>${product.description}</p>
        
        <h3>Features:</h3>
        <ul>
          ${product.features.map(feature => `<li>${feature}</li>`).join('')}
        </ul>
        
        <h3>Applications:</h3>
        <ul>
          ${product.applications.map(app => `<li>${app}</li>`).join('')}
        </ul>
        
        <table class="specs-table">
          <thead>
            <tr>
              <th>Specification</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            ${Object.entries(product.specifications).map(([key, value]) => `
              <tr>
                <td><strong>${key}</strong></td>
                <td>${value}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <div class="product-quantity-section">
          <label class="form-label">Quantity:</label>
          <div class="quantity-controls">
            <button class="quantity-btn" onclick="updateProductQuantity(-1)">-</button>
            <input type="number" class="quantity-input" id="productQuantityInput" value="1" min="1" onchange="setProductQuantity(parseInt(this.value))">
            <button class="quantity-btn" onclick="updateProductQuantity(1)">+</button>
          </div>
        </div>
        
        <div class="product-actions">
          <button class="btn btn--primary btn--lg" onclick="addToCartWithQuantity(${product.id})">
            <i class="fas fa-cart-plus"></i> Add to Cart
          </button>
        </div>
      </div>
    </div>
    
    <div class="related-products">
      <h3>Other Products</h3>
      <div class="products-grid">
        ${getRelatedProducts(product).map(relatedProduct => `
          <div class="product-card">
            <div class="product-image">
              <img src="${relatedProduct.image}" alt="${relatedProduct.name}" onerror="this.style.display='none'; this.parentElement.innerHTML='<div style=\\'display:flex;align-items:center;justify-content:center;height:100%;background:var(--color-bg-3);color:var(--color-text-secondary);\\'>Product Image</div>';">
            </div>
            <h3 class="product-name">${relatedProduct.name}</h3>
            <div class="product-specs">
              <span>${relatedProduct.specifications.Power}</span>
              <span>${relatedProduct.specifications.Pressure}</span>
            </div>
            <div class="product-price">₹${relatedProduct.price.toLocaleString()}</div>
            <div class="product-actions">
              <button class="btn btn--secondary btn--sm" onclick="viewProduct(${relatedProduct.id})">View Details</button>
              <button class="btn btn--primary btn--sm" onclick="addToCart(${relatedProduct.id})">Add to Cart</button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  showPage('productDetail');
}

function updateProductQuantity(change) {
  currentProductQuantity = Math.max(1, currentProductQuantity + change);
  const input = document.getElementById('productQuantityInput');
  if (input) {
    input.value = currentProductQuantity;
  }
}

function setProductQuantity(quantity) {
  currentProductQuantity = Math.max(1, quantity || 1);
}

function addToCartWithQuantity(productId) {
  console.log('Adding to cart with quantity:', productId, currentProductQuantity);
  const product = products.find(p => p.id === productId);
  if (!product) return;

  const existingItem = cart.find(item => item.id === productId);
  
  if (existingItem) {
    existingItem.quantity += currentProductQuantity;
  } else {
    cart.push({
      ...product,
      quantity: currentProductQuantity
    });
  }

  updateCartDisplay();
  
  // Visual feedback
  const cartCountEl = document.getElementById('cartCount');
  if (cartCountEl) {
    cartCountEl.style.animation = 'none';
    setTimeout(() => {
      cartCountEl.style.animation = 'pulse 0.3s ease-in-out';
    }, 10);
  }

  // Show success message
  alert(`Added ${currentProductQuantity} unit(s) of ${product.name} to cart!`);
}

function getRelatedProducts(product) {
  return products
    .filter(p => p.id !== product.id)
    .slice(0, 2);
}

function addToCart(productId) {
  console.log('Adding to cart:', productId);
  const product = products.find(p => p.id === productId);
  if (!product) return;

  const existingItem = cart.find(item => item.id === productId);
  
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      ...product,
      quantity: 1
    });
  }

  updateCartDisplay();
  
  // Visual feedback
  const cartCountEl = document.getElementById('cartCount');
  if (cartCountEl) {
    cartCountEl.style.animation = 'none';
    setTimeout(() => {
      cartCountEl.style.animation = 'pulse 0.3s ease-in-out';
    }, 10);
  }

  alert(`${product.name} added to cart!`);
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  updateCartDisplay();
  populateCart();
}

function updateQuantity(productId, newQuantity) {
  const item = cart.find(item => item.id === productId);
  if (item) {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      item.quantity = newQuantity;
      updateCartDisplay();
      populateCart();
    }
  }
}

function updateCartDisplay() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  if (cartCount) {
    cartCount.textContent = totalItems;
    cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
  }
}

function populateCart() {
  const cartItems = document.getElementById('cartItems');
  const cartSubtotal = document.getElementById('cartSubtotal');
  const cartTax = document.getElementById('cartTax');
  const cartTotal = document.getElementById('cartTotal');

  if (!cartItems) return;

  if (cart.length === 0) {
    cartItems.innerHTML = `
      <div class="empty-cart">
        <i class="fas fa-shopping-cart"></i>
        <p>Your cart is empty</p>
        <button class="btn btn--primary" onclick="showPage('products')">Continue Shopping</button>
      </div>
    `;
    if (cartSubtotal) cartSubtotal.textContent = '₹0';
    if (cartTax) cartTax.textContent = '₹0';
    if (cartTotal) cartTotal.textContent = '₹0';
    return;
  }

  cartItems.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-item-image">
        <img src="${item.image}" alt="${item.name}" onerror="this.style.display='none'; this.parentElement.innerHTML='<div style=\\'display:flex;align-items:center;justify-content:center;height:100%;background:var(--color-bg-3);color:var(--color-text-secondary);font-size:12px;\\'>Product</div>';">
      </div>
      <div class="cart-item-info">
        <h4>${item.name}</h4>
        <p>${item.category} • ${item.specifications.Power} • ${item.specifications.Pressure}</p>
      </div>
      <div class="quantity-controls">
        <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
        <input type="number" class="quantity-input" value="${item.quantity}" onchange="updateQuantity(${item.id}, parseInt(this.value))">
        <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
      </div>
      <div class="cart-item-price">₹${(item.price * item.quantity).toLocaleString()}</div>
      <button class="remove-btn" onclick="removeFromCart(${item.id})">
        <i class="fas fa-trash"></i>
      </button>
    </div>
  `).join('');

  // Calculate totals
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.18; // 18% tax
  const total = subtotal + tax;

  if (cartSubtotal) cartSubtotal.textContent = `₹${subtotal.toLocaleString()}`;
  if (cartTax) cartTax.textContent = `₹${tax.toLocaleString()}`;
  if (cartTotal) cartTotal.textContent = `₹${total.toLocaleString()}`;
}

function updateCheckoutTotal() {
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = total * 0.18;
  const finalTotal = total + tax;
  
  const checkoutTotal = document.getElementById('checkoutTotal');
  if (checkoutTotal) {
    checkoutTotal.textContent = `₹${finalTotal.toLocaleString()}`;
  }
}

// Close modal when clicking outside
document.addEventListener('click', function(e) {
  const modal = document.getElementById('checkoutModal');
  if (modal && e.target === modal) {
    modal.classList.add('hidden');
  }
});

// Keyboard navigation
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    const modal = document.getElementById('checkoutModal');
    if (modal && !modal.classList.contains('hidden')) {
      modal.classList.add('hidden');
    }
  }
});

// Global functions for onclick events - ensure they're available
window.showPage = showPage;
window.viewProduct = viewProduct;
window.addToCart = addToCart;
window.addToCartWithQuantity = addToCartWithQuantity;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;
window.updateProductQuantity = updateProductQuantity;
window.setProductQuantity = setProductQuantity;