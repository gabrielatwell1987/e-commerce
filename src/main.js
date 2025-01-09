import "./style.css";

const API_URL = "https://fakestoreapi.com/products";
let cartItems = {};

const CACHE_DURATION = 60 * 60 * 1000;
const CACHE_KEY = "product_cache";

async function fetchProducts() {
  showLoading();

  try {
    // Check cache first
    const cachedData = getCachedProducts();
    if (cachedData) {
      displayProducts(cachedData);
      hideLoading();
      // Fetch fresh data in background
      updateCacheInBackground();
      return;
    }

    const response = await fetch(API_URL);
    const products = await response.json();

    // Cache the products
    cacheProducts(products);

    // Display products and hide loading
    displayProducts(products);
    hideLoading();
  } catch (error) {
    console.error("Error fetching products:", error);
    const loadingContainer = document.getElementById("loading-container");
    loadingContainer.innerHTML = `
            <div style="text-align: center; color: #e74c3c;">
                Error loading products.<br>Please try again later.
            </div>
        `;
  }
}

function showLoading() {
  const loadingContainer = document.getElementById("loading-container");
  loadingContainer.classList.remove("hidden");
}

function hideLoading() {
  const loadingContainer = document.getElementById("loading-container");
  if (loadingContainer) {
    loadingContainer.classList.add("hidden");
  }
}

// Rest of the JavaScript remains the same...
function getCachedProducts() {
  const cached = localStorage.getItem(CACHE_KEY);
  if (!cached) return null;

  const { timestamp, data } = JSON.parse(cached);
  if (Date.now() - timestamp > CACHE_DURATION) {
    localStorage.removeItem(CACHE_KEY);
    return null;
  }

  return data;
}

function cacheProducts(products) {
  const cacheData = {
    timestamp: Date.now(),
    data: products,
  };
  localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
}

async function updateCacheInBackground() {
  try {
    const response = await fetch(API_URL);
    const products = await response.json();
    cacheProducts(products);
    displayProducts(products);
  } catch (error) {
    console.error("Background cache update failed:", error);
  }
}

function displayProducts(products) {
  const productsGrid = document.getElementById("products-grid");
  productsGrid.innerHTML = "";

  products.forEach((product) => {
    const productCard = document.createElement("div");
    productCard.className = "product-card";

    productCard.innerHTML = `
            <img src="${product.image}" alt="${
      product.title
    }" class="product-image" loading="lazy">
            <h2 class="product-title">${product.title}</h2>
            <p class="product-price">$${product.price.toFixed(2)}</p>
            <p class="product-description">${product.description}</p>
            <p class="item-count" id="count-${product.id}">In Cart: 0</p>
            <div class="button-group">
                <button class="add-to-cart" onclick="addToCart(${product.id})">
                    <i class="fa-solid fa-plus"></i>
                </button>
                <button class="remove-from-cart" onclick="removeFromCart(${
                  product.id
                })">
                    <i class="fa-solid fa-minus"></i>
                </button>
            </div>
        `;

    productsGrid.appendChild(productCard);
  });

  updateCartDisplay();
}

window.addToCart = function (productId) {
  cartItems[productId] = (cartItems[productId] || 0) + 1;
  updateCartDisplay();
};

window.removeFromCart = function (productId) {
  if (cartItems[productId] && cartItems[productId] > 0) {
    cartItems[productId]--;
    if (cartItems[productId] === 0) {
      delete cartItems[productId];
    }
    updateCartDisplay();
  }
};

function updateCartDisplay() {
  const totalCount = Object.values(cartItems).reduce(
    (sum, count) => sum + count,
    0
  );
  document.getElementById("cart-count").textContent = totalCount;

  for (const [productId, count] of Object.entries(cartItems)) {
    const countElement = document.getElementById(`count-${productId}`);
    if (countElement) {
      countElement.textContent = `In Cart: ${count}`;
    }
  }

  const allCountElements = document.querySelectorAll('[id^="count-"]');
  allCountElements.forEach((element) => {
    const productId = element.id.split("-")[1];
    if (!cartItems[productId]) {
      element.textContent = "In Cart: 0";
    }
  });
}

document.addEventListener("DOMContentLoaded", fetchProducts);
