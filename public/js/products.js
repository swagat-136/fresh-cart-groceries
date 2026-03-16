/* ═══════════════════════════════════════════════════
   Products Module — FreshCart
   ═══════════════════════════════════════════════════ */

const Products = (() => {
  let currentCategory = "all";
  let searchTimeout = null;

  function renderStars(rating) {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5 ? 1 : 0;
    const empty = 5 - full - half;
    return "★".repeat(full) + (half ? "½" : "") + "☆".repeat(empty);
  }

  function createProductCard(product, index) {
    const card = document.createElement("div");
    card.className = "product-card";
    card.style.animationDelay = `${index * 60}ms`;
    card.id = `product-${product.id}`;

    card.innerHTML = `
      <div class="card-image">
        <span class="emoji">${product.image}</span>
        <span class="card-category-tag">${product.category}</span>
        ${!product.inStock ? '<span class="out-of-stock-badge">Out of Stock</span>' : ""}
      </div>
      <div class="card-body">
        <h3 class="card-name">${product.name}</h3>
        <p class="card-description">${product.description}</p>
        <div class="card-rating">
          <span class="stars">${renderStars(product.rating)}</span>
          <span class="rating-value">${product.rating}</span>
        </div>
        <div class="card-footer">
          <div class="card-price">
            <span class="price-amount">₹${product.price.toFixed(2)}</span>
            <span class="price-unit">per ${product.unit}</span>
          </div>
          <button
            class="add-to-cart-btn"
            data-product-id="${product.id}"
            ${!product.inStock ? "disabled" : ""}
          >
            ${product.inStock ? "🛒 Add" : "Unavailable"}
          </button>
        </div>
      </div>
    `;

    // Add to cart click handler
    const addBtn = card.querySelector(".add-to-cart-btn");
    if (product.inStock) {
      addBtn.addEventListener("click", async (e) => {
        e.stopPropagation();
        addBtn.disabled = true;
        addBtn.classList.add("added");
        addBtn.textContent = "✓ Added";

        await Cart.addItem(product.id);

        setTimeout(() => {
          addBtn.disabled = false;
          addBtn.classList.remove("added");
          addBtn.innerHTML = "🛒 Add";
        }, 1200);
      });
    }

    return card;
  }

  async function loadProducts(params = {}) {
    const grid = document.getElementById("products-grid");
    const emptyState = document.getElementById("empty-products");
    const countEl = document.getElementById("products-count");
    const titleEl = document.getElementById("products-title");

    // Show loading skeletons
    grid.innerHTML = "";
    for (let i = 0; i < 8; i++) {
      const skeleton = document.createElement("div");
      skeleton.className = "skeleton skeleton-card";
      grid.appendChild(skeleton);
    }
    emptyState.classList.add("hidden");

    try {
      const data = await Api.getProducts(params);
      grid.innerHTML = "";

      if (data.products.length === 0) {
        emptyState.classList.remove("hidden");
        countEl.textContent = "";
        return;
      }

      data.products.forEach((product, i) => {
        grid.appendChild(createProductCard(product, i));
      });

      countEl.textContent = `${data.count} items`;

      // Update title based on category
      if (params.category && params.category !== "all") {
        titleEl.textContent = params.category.charAt(0).toUpperCase() + params.category.slice(1);
      } else if (params.search) {
        titleEl.textContent = `Results for "${params.search}"`;
      } else {
        titleEl.textContent = "All Products";
      }
    } catch (err) {
      console.error("Failed to load products:", err);
      grid.innerHTML = "";
      emptyState.classList.remove("hidden");
    }
  }

  function initCategoryFilters() {
    const pills = document.querySelectorAll(".pill[data-category]");
    pills.forEach((pill) => {
      pill.addEventListener("click", () => {
        pills.forEach((p) => p.classList.remove("active"));
        pill.classList.add("active");
        currentCategory = pill.dataset.category;
        const params = currentCategory !== "all" ? { category: currentCategory } : {};
        loadProducts(params);
      });
    });
  }

  function initSearch() {
    const searchInput = document.getElementById("search-input");
    searchInput.addEventListener("input", (e) => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        const query = e.target.value.trim();
        if (query) {
          // Reset category pills
          document.querySelectorAll(".pill[data-category]").forEach((p) => p.classList.remove("active"));
          loadProducts({ search: query });
        } else {
          // Reset to all products
          document.querySelector('.pill[data-category="all"]').classList.add("active");
          currentCategory = "all";
          loadProducts();
        }
      }, 350);
    });
  }

  return {
    init() {
      initCategoryFilters();
      initSearch();
      loadProducts();
    },
    reload: loadProducts
  };
})();
