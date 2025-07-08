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

// SEO and Analytics helper functions
function updatePageTitle(productCount = 0) {
  const baseTitle =
    "Premium Products Store | Best Quality Items at Great Prices";
  document.title =
    productCount > 0
      ? `${productCount} Premium Products Available | Premium Products Store`
      : baseTitle;
}

function updateMetaDescription(productCount = 0) {
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc && productCount > 0) {
    metaDesc.content = `Shop from our collection of ${productCount} high-quality products including electronics, clothing, jewelry, and home goods. Fast shipping and secure checkout.`;
  }
}

// Generate structured data for products
function generateProductStructuredData() {
  if (products.length === 0) return;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    numberOfItems: products.length,
    itemListElement: products.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Product",
        "@id": `https://your-domain.com/product/${product.id}`,
        name: product.title,
        description: product.description,
        image: product.image,
        category: product.category,
        offers: {
          "@type": "Offer",
          price: product.price,
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
          url: `https://your-domain.com/product/${product.id}`,
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: product.rating?.rate || 4.5,
          reviewCount: product.rating?.count || 100,
        },
      },
    })),
  };

  // Remove existing product structured data
  const existingScript = document.getElementById("products-structured-data");
  if (existingScript) {
    existingScript.remove();
  }

  // Add new structured data
  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.id = "products-structured-data";
  script.textContent = JSON.stringify(structuredData);
  document.head.appendChild(script);
}

// Fetch products from API
async function fetchProducts() {
  try {
    const response = await fetch("https://fakestoreapi.com/products");
    products = await response.json();

    // Update SEO elements
    updatePageTitle(products.length);
    updateMetaDescription(products.length);
    generateProductStructuredData();

    renderProducts();
    hideLoading();
  } catch (error) {
    console.error("Error fetching products:", error);
    // Update page for error state
    updatePageTitle(0);
    hideLoading();
    showErrorMessage();
  }
}

// Show error message if products fail to load
function showErrorMessage() {
  productsGrid.innerHTML = `
    <div class="error-message" role="alert">
      <h2>Unable to load products</h2>
      <p>Please check your internet connection and try again.</p>
      <button onclick="location.reload()" class="retry-button">Retry</button>
    </div>
  `;
}

// Get quantity for specific product
function getProductQuantity(productId) {
  const cartItem = cart.find((item) => item.id === productId);
  return cartItem ? cartItem.quantity : 0;
}

// Generate clean URL-friendly slug
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

// Truncate text for descriptions
function truncateText(text, maxLength = 100) {
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
}

// Render products to grid
function renderProducts() {
  productsGrid.innerHTML = products
    .map((product) => {
      const slug = generateSlug(product.title);
      const rating = product.rating?.rate || 0;
      const reviewCount = product.rating?.count || 0;

      return `
        <article class="product-card" id="product-card-${
          product.id
        }" itemscope itemtype="https://schema.org/Product">
            <div class="product-image-container">
                <img 
                    src="${product.image}" 
                    alt="${product.title}"
                    itemprop="image"
                    loading="lazy"
                    width="200"
                    height="200"
                    onerror="this.onerror=null; this.src='/icons/placeholder-product.png';"
                >
            </div>
            
            <div class="product-info">
                <h3 itemprop="name">
                    <a href="/product/${product.id}/${slug}" 
                       aria-label="View details for ${product.title}"
                       onclick="event.preventDefault(); viewProduct(${
                         product.id
                       })">
                        ${product.title}
                    </a>
                </h3>
                
                <div class="product-rating" aria-label="Rating: ${rating} out of 5 stars">
                    <span class="stars" aria-hidden="true">${generateStars(
                      rating
                    )}</span>
                    <span class="rating-text">
                        <span itemprop="ratingValue">${rating}</span>/5 
                        (<span itemprop="reviewCount">${reviewCount}</span> reviews)
                    </span>
                </div>
                
                <p class="price" itemprop="price" content="${product.price}">
                    <span class="currency">$</span>${product.price.toFixed(2)}
                </p>
                
                <p class="description" itemprop="description">
                    ${truncateText(product.description)}
                </p>
                
                <meta itemprop="category" content="${product.category}">
                <meta itemprop="availability" content="https://schema.org/InStock">
            </div>
            
            <div class="product-buttons" role="group" aria-label="Product quantity controls">
                <button 
                    onclick="removeFromCart(${product.id})" 
                    class="remove-from-cart"
                    aria-label="Remove one ${product.title} from cart"
                    ${getProductQuantity(product.id) === 0 ? "disabled" : ""}
                >
                    <i class="fa-solid fa-minus" aria-hidden="true"></i>
                </button>
                
                <span 
                    class="item-quantity" 
                    id="quantity-${product.id}"
                    aria-label="Quantity in cart"
                    role="status"
                    aria-live="polite"
                >
                    ${getProductQuantity(product.id)}
                </span>
                
                <button 
                    onclick="addToCart(${product.id})" 
                    class="add-to-cart"
                    aria-label="Add one ${product.title} to cart"
                >
                    <i class="fa-solid fa-plus" aria-hidden="true"></i>
                </button>
            </div>
        </article>
    `;
    })
    .join("");

  // Update grid accessibility
  productsGrid.setAttribute(
    "aria-label",
    `Product catalog with ${products.length} items`
  );
}

// Generate star rating display
function generateStars(rating) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    "★".repeat(fullStars) + (hasHalfStar ? "☆" : "") + "☆".repeat(emptyStars)
  );
}

// View product details (placeholder for future implementation)
function viewProduct(productId) {
  const product = products.find((p) => p.id === productId);
  if (product) {
    // This could open a product detail modal or navigate to a product page
    console.log("Viewing product:", product.title);
    // For now, just add to cart
    addToCart(productId);
  }
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

  // Announce to screen readers
  announceToScreenReader(`Added ${product.title} to cart`);
}

// Remove item from cart
function removeFromCart(productId) {
  const itemIndex = cart.findIndex((item) => item.id === productId);
  if (itemIndex > -1) {
    const product = cart[itemIndex];
    if (cart[itemIndex].quantity > 1) {
      cart[itemIndex].quantity -= 1;
      announceToScreenReader(`Removed one ${product.title} from cart`);
    } else {
      cart.splice(itemIndex, 1);
      announceToScreenReader(`Removed ${product.title} from cart completely`);
    }
  }
  updateCartUI();
  updateProductQuantity(productId);
}

// Announce changes to screen readers
function announceToScreenReader(message) {
  const announcement = document.createElement("div");
  announcement.setAttribute("aria-live", "polite");
  announcement.setAttribute("aria-atomic", "true");
  announcement.className = "visually-hidden";
  announcement.textContent = message;

  document.body.appendChild(announcement);

  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

// Update quantity display for specific product
function updateProductQuantity(productId) {
  const quantityElement = document.getElementById(`quantity-${productId}`);
  const removeButton = document.querySelector(
    `[onclick="removeFromCart(${productId})"]`
  );

  if (quantityElement) {
    quantityElement.textContent = getProductQuantity(productId);
  }

  // Update button state
  if (removeButton) {
    const quantity = getProductQuantity(productId);
    removeButton.disabled = quantity === 0;
    removeButton.setAttribute(
      "aria-label",
      quantity === 0 ? "No items to remove" : `Remove one item from cart`
    );
  }
}

// Update cart UI elements
function updateCartUI() {
  // Update cart count
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCountHeader.textContent = totalItems;
  cartCountParagraph.textContent = totalItems;

  // Update cart icon accessibility
  cartIcon.setAttribute(
    "aria-label",
    `Open shopping cart with ${totalItems} item${totalItems !== 1 ? "s" : ""}`
  );

  // Update item count for each product card
  cart.forEach((item) => {
    updateProductQuantity(item.id);
  });

  // Update cart modal content
  updateCartModal();
}

// Update cart modal
function updateCartModal() {
  if (cart.length === 0) {
    cartModalBody.innerHTML = `
      <div class="empty-cart" role="status">
        <p>Your cart is empty</p>
        <p>Add some products to get started!</p>
      </div>
    `;
  } else {
    cartModalBody.innerHTML = cart
      .map(
        (item) => `
        <div class="cart-item" role="listitem">
            <img 
              src="${item.image}" 
              alt="${item.title}"
              width="80"
              height="80"
              loading="lazy"
            >
            <div class="cart-item-details">
                <div class="item-info">
                    <h4>${item.title}</h4>
                    <p><strong>Price:</strong> $${(
                      item.price * item.quantity
                    ).toFixed(2)}</p>
                </div>
                <div class="quantity-and-remove">
                    <p><strong>Qty:</strong> ${item.quantity}</p>
                    <button 
                      onclick="removeFromCart(${item.id})"
                      class="remove-item-btn"
                      aria-label="Remove ${item.title} from cart"
                      title="Remove item"
                    >
                      <i class="fa-solid fa-trash" aria-hidden="true"></i>
                    </button>
                </div>
            </div>
        </div>
    `
      )
      .join("");
  }

  // Calculate subtotal, tax, and total
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;

  // Update the display with subtotal, tax, and total
  if (cart.length > 0) {
    cartModalBody.innerHTML += `
      <div class="cart-summary" role="region" aria-labelledby="cart-summary-heading">
          <h4 id="cart-summary-heading" class="visually-hidden">Order Summary</h4>
          <div class="summary-line">
              <span>Subtotal:</span>
              <span>$${subtotal.toFixed(2)}</span>
          </div>
          <div class="summary-line">
              <span>Tax (8.875%):</span>
              <span>$${tax.toFixed(2)}</span>
          </div>
          <div class="summary-line total">
              <span>Total:</span>
              <span>$${total.toFixed(2)}</span>
          </div>
      </div>
    `;
  }

  // Update total
  cartTotal.textContent = total.toFixed(2);

  // Update checkout button state
  const checkoutButton = document.getElementById("checkout-button");
  if (checkoutButton) {
    checkoutButton.disabled = cart.length === 0;
    checkoutButton.setAttribute(
      "aria-label",
      cart.length === 0
        ? "Cart is empty"
        : `Complete purchase for $${total.toFixed(2)}`
    );
  }
}

// Loading handlers
function hideLoading() {
  loadingContainer.classList.add("hidden");
  mainContent.classList.add("visible");

  // Set focus to main content for screen readers
  const mainElement = document.getElementById("main");
  if (mainElement) {
    mainElement.focus();
  }
}

// Modal handlers
function openModal() {
  cartModal.style.display = "flex";
  cartModal.setAttribute("aria-hidden", "false");
  cartModal.offsetHeight; // Force reflow
  cartModal.classList.add("active");
  updateCartModal();

  // Focus management
  const closeButton = cartModal.querySelector(".close");
  if (closeButton) {
    closeButton.focus();
  }

  // Trap focus in modal
  trapFocus(cartModal);

  // Prevent body scroll
  document.body.style.overflow = "hidden";
}

function closeModal() {
  cartModal.classList.remove("active");
  cartModal.setAttribute("aria-hidden", "true");

  // Restore focus to cart icon
  cartIcon.focus();

  // Remove focus trap
  removeFocusTrap();

  // Restore body scroll
  document.body.style.overflow = "";

  setTimeout(() => {
    cartModal.style.display = "none";
  }, 500);
}

// Focus trap for modal accessibility
let focusableElements = [];
let firstFocusableElement = null;
let lastFocusableElement = null;

function trapFocus(modal) {
  focusableElements = modal.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  firstFocusableElement = focusableElements[0];
  lastFocusableElement = focusableElements[focusableElements.length - 1];

  modal.addEventListener("keydown", handleFocusTrap);
}

function handleFocusTrap(e) {
  if (e.key === "Tab") {
    if (e.shiftKey) {
      if (document.activeElement === firstFocusableElement) {
        lastFocusableElement.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === lastFocusableElement) {
        firstFocusableElement.focus();
        e.preventDefault();
      }
    }
  }

  if (e.key === "Escape") {
    closeModal();
  }
}

function removeFocusTrap() {
  cartModal.removeEventListener("keydown", handleFocusTrap);
}

// Form validation
function validateForm() {
  const form = document.getElementById("payment-form");
  const inputs = form.querySelectorAll("input[required]");
  let isValid = true;

  inputs.forEach((input) => {
    const errorElement = document.getElementById(input.id + "-error");

    if (!input.value.trim()) {
      showError(input, errorElement, "This field is required");
      isValid = false;
    } else if (input.id === "card-number" && !validateCardNumber(input.value)) {
      showError(input, errorElement, "Please enter a valid card number");
      isValid = false;
    } else if (input.id === "expiry-date" && !validateExpiryDate(input.value)) {
      showError(
        input,
        errorElement,
        "Please enter a valid expiry date (MM/YY)"
      );
      isValid = false;
    } else if (input.id === "cvv" && !validateCVV(input.value)) {
      showError(input, errorElement, "Please enter a valid CVV");
      isValid = false;
    } else {
      clearError(input, errorElement);
    }
  });

  return isValid;
}

function showError(input, errorElement, message) {
  input.classList.add("error");
  input.setAttribute("aria-invalid", "true");
  if (errorElement) {
    errorElement.textContent = message;
  }
}

function clearError(input, errorElement) {
  input.classList.remove("error");
  input.setAttribute("aria-invalid", "false");
  if (errorElement) {
    errorElement.textContent = "";
  }
}

function validateCardNumber(cardNumber) {
  const cleaned = cardNumber.replace(/\s/g, "");
  return /^\d{13,19}$/.test(cleaned);
}

function validateExpiryDate(expiry) {
  return /^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(expiry);
}

function validateCVV(cvv) {
  return /^\d{3,4}$/.test(cvv);
}

// Event Listeners
cartIcon.addEventListener("click", openModal);
cartIcon.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    openModal();
  }
});

closeModalBtn.addEventListener("click", closeModal);

window.addEventListener("click", (event) => {
  if (event.target === cartModal) {
    closeModal();
  }
});

// Enhanced form submission with validation
paymentForm.addEventListener("submit", (e) => {
  e.preventDefault();

  if (!validateForm()) {
    announceToScreenReader("Please fix the errors in the form");
    return;
  }

  if (cart.length === 0) {
    announceToScreenReader("Your cart is empty");
    return;
  }

  // Simulate payment processing
  const submitButton = document.getElementById("checkout-button");
  const originalText = submitButton.textContent;

  submitButton.disabled = true;
  submitButton.textContent = "Processing...";

  setTimeout(() => {
    const total = cartTotal.textContent;
    alert(`Order placed successfully! Total: $${total}`);

    // Generate order confirmation structured data
    generateOrderStructuredData();

    // Reset cart and form
    cart = [];
    updateCartUI();
    paymentForm.reset();
    closeModal();

    // Reset button
    submitButton.disabled = false;
    submitButton.textContent = originalText;

    announceToScreenReader("Order placed successfully!");
  }, 2000);
});

// Generate order confirmation structured data
function generateOrderStructuredData() {
  const orderData = {
    "@context": "https://schema.org",
    "@type": "Order",
    orderNumber: Date.now().toString(),
    orderDate: new Date().toISOString(),
    orderStatus: "https://schema.org/OrderProcessing",
    customer: {
      "@type": "Person",
      name: document.getElementById("card-name")?.value || "Customer",
    },
    orderedItem: cart.map((item) => ({
      "@type": "OrderItem",
      orderedItem: {
        "@type": "Product",
        name: item.title,
        price: item.price,
        image: item.image,
      },
      orderQuantity: item.quantity,
    })),
    totalPaymentDue: {
      "@type": "MonetaryAmount",
      currency: "USD",
      value: cartTotal.textContent,
    },
  };

  console.log("Order placed:", orderData);
}

// Real-time form validation
paymentForm.addEventListener("input", (e) => {
  const input = e.target;
  const errorElement = document.getElementById(input.id + "-error");

  // Clear previous errors on input
  if (input.value.trim()) {
    clearError(input, errorElement);
  }
});

// Keyboard navigation improvements
document.addEventListener("keydown", (e) => {
  // Close modal on Escape
  if (e.key === "Escape" && cartModal.classList.contains("active")) {
    closeModal();
  }
});

// Performance optimization - Lazy load images
function setupLazyLoading() {
  const images = document.querySelectorAll('img[loading="lazy"]');

  if ("IntersectionObserver" in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src || img.src;
          img.classList.remove("lazy");
          observer.unobserve(img);
        }
      });
    });

    images.forEach((img) => imageObserver.observe(img));
  }
}

// Make functions available globally
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.viewProduct = viewProduct;

// SEO: Add breadcrumb structured data
function addBreadcrumbStructuredData() {
  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://your-domain.com/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Products",
        item: "https://your-domain.com/products",
      },
    ],
  };

  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.textContent = JSON.stringify(breadcrumbData);
  document.head.appendChild(script);
}

// Initialize everything
document.addEventListener("DOMContentLoaded", () => {
  addBreadcrumbStructuredData();
  setupLazyLoading();
});

// Initialize
fetchProducts();
