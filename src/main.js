import "./style.css";

// State management
let products = [];
let cart = [];
const TAX_RATE = 0.08875;

// DOM Elements
const productsGrid = document.getElementById("products-grid");
const cartCountHeader = document.getElementById("cart-count-header");
const cartCountParagraph = document.getElementById("cart-count-paragraph");
const cartModal = document.getElementById("cart-modal");
const cartModalBody = document.querySelector(".cart-modal-body");
const cartTotal = document.getElementById("cart-total");
const loadingContainer = document.getElementById("loading-container");
const mainContent = document.getElementById("main-content");
const closeModalBtn = document.querySelector(".close");
const cartIcon = document.querySelector(".cart-icon");
const paymentForm = document.getElementById("payment-form");

// Fetch products from API
async function fetchProducts() {
  try {
    const response = await fetch("https://fakestoreapi.com/products");
    products = await response.json();
    renderProducts();
    hideLoading();
  } catch (error) {
    console.error("Error fetching products:", error);
    hideLoading();
  }
}

// Get quantity for specific product
function getProductQuantity(productId) {
  const cartItem = cart.find((item) => item.id === productId);
  return cartItem ? cartItem.quantity : 0;
}

// Render products to grid
function renderProducts() {
  productsGrid.innerHTML = products
    .map(
      (product) => `
        <div class="product-card" id="product-card-${product.id}">
            <img src="${product.image}" alt="${product.title}">
            <h3>${product.title}</h3>
            <p class="price">$${product.price.toFixed(2)}</p>
            <p class="description">${product.description.substring(
              0,
              100
            )}...</p>
            <div class="product-buttons">
                <button onclick="addToCart(${product.id})" class="add-to-cart">
                    <i class="fa-solid fa-plus"></i>
                </button>
                <span class="item-quantity" id="quantity-${product.id}">
                        ${getProductQuantity(product.id)}
                    </span>
                <button onclick="removeFromCart(${
                  product.id
                })" class="remove-from-cart">
                    <i class="fa-solid fa-minus"></i>
                </button>
            </div>
        </div>
    `
    )
    .join("");
}

// Add item to cart
function addToCart(productId) {
  const product = products.find((p) => p.id === productId);
  const existingItem = cart.find((item) => item.id === productId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  updateCartUI();
  updateProductQuantity(productId);
}

// Remove item from cart
function removeFromCart(productId) {
  const itemIndex = cart.findIndex((item) => item.id === productId);
  if (itemIndex > -1) {
    if (cart[itemIndex].quantity > 1) {
      cart[itemIndex].quantity -= 1;
    } else {
      cart.splice(itemIndex, 1);
    }
  }
  updateCartUI();
  updateProductQuantity(productId);
}

// Update quantity display for specific product
function updateProductQuantity(productId) {
  const quantityElement = document.getElementById(`quantity-${productId}`);
  if (quantityElement) {
    quantityElement.textContent = getProductQuantity(productId);
  }
}

// Update cart UI elements
function updateCartUI() {
  // Update cart count
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCountHeader.textContent = totalItems;
  cartCountParagraph.textContent = totalItems;

  // Update item count for each product card
  cart.forEach((item) => {
    const itemCountElement = document.getElementById(
      `cart-count-paragraph-${item.id}`
    );
    if (itemCountElement) {
      itemCountElement.textContent = item.quantity;
    }
  });

  // Update cart modal content
  updateCartModal();
}

// Update cart modal
function updateCartModal() {
  cartModalBody.innerHTML = cart
    .map(
      (item) => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.title}">
            <div class="cart-item-details">
                <h4>${item.title}</h4>
                <p>Quantity: ${item.quantity}</p>
                <p>Price: $${(item.price * item.quantity).toFixed(2)}</p>
            </div>
        </div>
    `
    )
    .join("");

  // Calculate subtotal, tax, and total
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;

  // Update the display with subtotal, tax, and total
  cartModalBody.innerHTML += `
    <div class="cart-summary">
        <div class="summary-line">
            <span>Subtotal:</span>
            <span>$${subtotal.toFixed(2)}</span>
        </div>
        <div class="summary-line">
            <span>Tax (8.875%):</span>
            <span>$${tax.toFixed(2)}</span>
        </div>
        <div class="summary-line total">
            <span>Total:   </span>
            <span>$${total.toFixed(2)}</span>
        </div>
    </div>
  `;

  // Update total
  cartTotal.textContent = total.toFixed(2);
}

// Loading handlers
function hideLoading() {
  loadingContainer.classList.add("hidden");
  mainContent.classList.add("visible");
}

// Modal handlers
function openModal() {
  cartModal.style.display = "flex";
  cartModal.offsetHeight;
  cartModal.classList.add("active");
  updateCartModal();
}

function closeModal() {
  cartModal.classList.remove("active");
  setTimeout(() => {
    cartModal.style.display = "none";
  }, 500);
}

// Event Listeners
cartIcon.addEventListener("click", openModal);
closeModalBtn.addEventListener("click", closeModal);

window.addEventListener("click", (event) => {
  if (event.target === cartModal) {
    closeModal();
  }
});

paymentForm.addEventListener("submit", (e) => {
  e.preventDefault();
  alert("Order placed successfully!");
  cart = [];
  updateCartUI();
  closeModal();
});

// Make functions available globally
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;

// Initialize
fetchProducts();
