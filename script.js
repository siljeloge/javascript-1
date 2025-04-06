const container = document.querySelector("#container");
const sortPriceSelect = document.querySelector("#sort-price");
const BASE_URL = "https://v2.api.noroff.dev/rainy-days";

let products = [];

// Fetch all the products from Noroff API
async function fetchProducts() {
    try {
        const response = await fetch(BASE_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        products = data.data;

        renderProducts(products);
        updateCartCount();
    } catch (error) {
        console.error("Error fetching products:", error);
        if (container) {
            container.innerHTML = `<p>Failed to load products. Please try again later.</p>`;
        }
    }
}

// Render products to jackets.html
function renderProducts(productList) {
    if (!container) return;
    container.innerHTML = "";

    productList.forEach(product => {
        const card = document.createElement("div");
        const image = document.createElement("img");
        const imageLink = document.createElement("a");
        const content = document.createElement("div");
        const title = document.createElement("h2");
        const price = document.createElement("p");
        const button = document.createElement("button");

        card.className = "card";
        image.className = "card-image";
        content.className = "card-content";
        title.className = "card-title";
        price.className = "card-price";
        button.className = "add-to-cart-btn";

        image.src = product.image?.url || "placeholder.jpg";
        image.alt = product.image?.alt || "Product image";

        // Wrap images in a link to jacket1.html
        imageLink.href = "jacket1.html";
        imageLink.appendChild(image);

        title.textContent = product.title || "No title available";
        price.textContent = product.price ? `$${product.price}` : "Price not available";
        button.textContent = "Add to Cart";

        button.addEventListener("click", () => {
            let cart = JSON.parse(localStorage.getItem("cart")) || [];
            cart.push(product);
            localStorage.setItem("cart", JSON.stringify(cart));
            alert(`${product.title} has been added to your cart!`);
            updateCartCount();
        });

        content.appendChild(title);
        content.appendChild(price);
        content.appendChild(button);
        card.appendChild(imageLink);
        card.appendChild(content);
        container.appendChild(card);
    });
}

// Sort by price
if (sortPriceSelect) {
    sortPriceSelect.addEventListener("change", () => {
        let sortedProducts = [...products];

        if (sortPriceSelect.value === "low-high") {
            sortedProducts.sort((a, b) => a.price - b.price);
        } else if (sortPriceSelect.value === "high-low") {
            sortedProducts.sort((a, b) => b.price - a.price);
        }

        applyFiltersAndSorting(sortedProducts);
    });
}

// Apply sorting
function applyFiltersAndSorting(productList) {
    renderProducts(productList);
}

// Update cart count 
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const countElement = document.getElementById("cart-count");
    if (countElement) {
        countElement.textContent = cart.length;
    }
}

function removeFromCart(index) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    displayCartItems();
}

// Display cart items with total price
function displayCartItems() {
    const cartPageContainer = document.querySelector(".cart");
    if (!cartPageContainer) return;

    const cartItems = JSON.parse(localStorage.getItem("cart")) || [];

    cartPageContainer.innerHTML = "<h1>YOUR SHOPPING CART</h1><hr>";

    if (cartItems.length === 0) {
        cartPageContainer.innerHTML += "<p>Your cart is empty.</p>";
        return;
    }

    const itemList = document.createElement("div");
    itemList.className = "cart-items";

    let total = 0;

    cartItems.forEach((item, index) => {
        const itemElement = document.createElement("div");
        itemElement.className = "cart-item";

        const img = document.createElement("img");
        img.src = item.image?.url || "placeholder.jpg";
        img.alt = item.image?.alt || "Product image";
        img.className = "cart-item-image";

        const itemTitle = document.createElement("h3");
        itemTitle.textContent = item.title;

        const itemPrice = document.createElement("p");
        itemPrice.textContent = `$${item.price}`;

        const removeBtn = document.createElement("button");
        removeBtn.textContent = "REMOVE";
        removeBtn.className = "remove-btn";
        removeBtn.addEventListener("click", () => {
            removeFromCart(index);
        });

        itemElement.appendChild(img);
        itemElement.appendChild(itemTitle);
        itemElement.appendChild(itemPrice);
        itemElement.appendChild(removeBtn);
        itemList.appendChild(itemElement);

        total += item.price;
    });

    cartPageContainer.appendChild(itemList);

    const totalDisplay = document.createElement("p");
    totalDisplay.className = "cart-total";
    totalDisplay.innerHTML = `<strong>Total:</strong> $${total.toFixed(2)}`;
    cartPageContainer.appendChild(totalDisplay);

    if (!window.location.href.includes("checkout.html")) {
        const checkoutLink = document.createElement("a");
        checkoutLink.href = "checkout.html";
        checkoutLink.className = "checkout-btn";
        checkoutLink.textContent = "CHECK OUT";
        cartPageContainer.appendChild(checkoutLink);
    }
}

//  Form validation + purchase handling
document.addEventListener("DOMContentLoaded", () => {
    const checkoutForm = document.querySelector("form");
    if (checkoutForm) {
        checkoutForm.addEventListener("submit", (event) => {
            const confirmPurchase = confirm("Are you sure you want to complete this purchase?");
            window.location.href = "confirmed.html";
            if (!confirmPurchase) {
                event.preventDefault();
                alert("Purchase cancelled.");
                
            } else {
                localStorage.removeItem("cart");
                alert("Thank you for your purchase!");
                
            }
        });
    }

    fetchProducts();
    updateCartCount();
    displayCartItems();
});
