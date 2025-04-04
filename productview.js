(() => {
    const BASE_URL = "https://v2.api.noroff.dev/rainy-days/b8b528fc-6c60-41f6-a5a9-9a8b27a9482a";

    async function fetchProduct() {
        const jacketcontainer = document.querySelector("#jacketcontainer");
        if (!jacketcontainer) return;

        try {
            const response = await fetch(BASE_URL);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            const product = data.data;

            const card = document.createElement("div");
            const image = document.createElement("img");
            const content = document.createElement("div");
            const title = document.createElement("h2");
            const description = document.createElement("p");
            const price = document.createElement("p");
            const button = document.createElement("button");

            card.className = "card";
            image.className = "card-image";
            content.className = "card-content";
            title.className = "card-title";
            description.className = "card-description";
            price.className = "card-price";
            button.className = "add-to-cart-btn";

            image.src = product.image?.url || "placeholder.jpg";
            image.alt = product.image?.alt || "Product image";
            title.textContent = product.title || "No title available";
            description.textContent = product.description || "No description available";
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
            content.appendChild(description);
            content.appendChild(button);
            card.appendChild(image);
            card.appendChild(content);
            jacketcontainer.appendChild(card);

        } catch (error) {
            console.error("Error fetching product:", error);
            jacketcontainer.innerHTML = `<p>Failed to load product. Please try again later.</p>`;
        }
    }

    function updateCartCount() {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        const countElement = document.getElementById("cart-count");
        if (countElement) {
            countElement.textContent = cart.length;
        }
    }

    document.addEventListener("DOMContentLoaded", () => {
        fetchProduct();
        updateCartCount();
    });
})();