import "./style.css";

// const API_URL = "https://fakestoreapi.com/products";
// let cartCount = 0;

// async function fetchProducts() {
//   try {
//     const response = await fetch(API_URL);
//     const products = await response.json();
//     displayProducts(products);
//   } catch (error) {
//     console.error("Error fetching products:", error);
//     document.getElementById("products-grid").innerHTML =
//       "<p>Error loading products. Please try again later.</p>";
//   }
// }

// function displayProducts(products) {
//   const productsGrid = document.getElementById("products-grid");

//   products.forEach((product) => {
//     const productCard = document.createElement("div");
//     productCard.className = "product-card";

//     productCard.innerHTML = `
//             <img src="${product.image}" alt="${
//       product.title
//     }" class="product-image">
//             <h2 class="product-title">${product.title}</h2>
//             <p class="product-price">$${product.price.toFixed(2)}</p>
//             <p class="product-description">${product.description}</p>
//             <button class="add-to-cart" onclick="addToCart(${product.id})">
//                 Add to Cart
//             </button>
//         `;

//     productsGrid.appendChild(productCard);
//   });
// }

// window.addToCart = function (productId) {
//   cartCount++;
//   document.getElementById("cart-count").textContent = cartCount;
//   // You could add more cart functionality here
// };

// // Initialize
// document.addEventListener("DOMContentLoaded", fetchProducts);

const API_URL = "https://fakestoreapi.com/products";
let cartItems = {};

async function fetchProducts() {
  try {
    const response = await fetch(API_URL);
    const products = await response.json();
    displayProducts(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    document.getElementById("products-grid").innerHTML =
      "<p>Error loading products. Please try again later.</p>";
  }
}

function displayProducts(products) {
  const productsGrid = document.getElementById("products-grid");

  products.forEach((product) => {
    const productCard = document.createElement("div");
    productCard.className = "product-card";

    productCard.innerHTML = `
            <img src="${product.image}" alt="${
      product.title
    }" class="product-image">
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
  // Update total cart count
  const totalCount = Object.values(cartItems).reduce(
    (sum, count) => sum + count,
    0
  );
  document.getElementById("cart-count").textContent = totalCount;

  // Update individual product counts
  for (const [productId, count] of Object.entries(cartItems)) {
    const countElement = document.getElementById(`count-${productId}`);
    if (countElement) {
      countElement.textContent = `In Cart: ${count}`;
    }
  }

  // Reset counts to 0 for products not in cart
  const allCountElements = document.querySelectorAll('[id^="count-"]');
  allCountElements.forEach((element) => {
    const productId = element.id.split("-")[1];
    if (!cartItems[productId]) {
      element.textContent = "In Cart: 0";
    }
  });
}

// Initialize
document.addEventListener("DOMContentLoaded", fetchProducts);
