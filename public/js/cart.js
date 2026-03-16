/* ═══════════════════════════════════════════════════
   Cart Module — FreshCart
   ═══════════════════════════════════════════════════ */

const Cart = (() => {
  const drawerOverlay = () => document.getElementById("drawer-overlay");
  const cartDrawer = () => document.getElementById("cart-drawer");
  const cartItemsEl = () => document.getElementById("cart-items");
  const cartEmptyEl = () => document.getElementById("cart-empty");
  const cartFooter = () => document.getElementById("cart-footer");
  const cartBadge = () => document.getElementById("cart-badge");
  const subtotalEl = () => document.getElementById("cart-subtotal");
  const totalEl = () => document.getElementById("cart-total");

  function openDrawer() {
    const overlay = drawerOverlay();
    const drawer = cartDrawer();
    overlay.classList.remove("hidden");
    drawer.classList.remove("hidden");
    document.body.style.overflow = "hidden";

    requestAnimationFrame(() => {
      overlay.classList.add("show");
      drawer.classList.add("show");
    });

    refreshCart();
  }

  function closeDrawer() {
    const overlay = drawerOverlay();
    const drawer = cartDrawer();

    overlay.classList.remove("show");
    drawer.classList.remove("show");
    document.body.style.overflow = "";

    setTimeout(() => {
      overlay.classList.add("hidden");
      drawer.classList.add("hidden");
    }, 400);
  }

  function updateBadge(count) {
    const badge = cartBadge();
    badge.textContent = count;
    if (count > 0) {
      badge.classList.add("show");
      badge.classList.add("bump");
      setTimeout(() => badge.classList.remove("bump"), 400);
    } else {
      badge.classList.remove("show");
    }
  }

  function renderCartItem(item) {
    const div = document.createElement("div");
    div.className = "cart-item";
    div.id = `cart-item-${item.productId}`;

    div.innerHTML = `
      <div class="cart-item-image">${item.product.image}</div>
      <div class="cart-item-info">
        <div class="cart-item-name">${item.product.name}</div>
        <div class="cart-item-price">₹${item.product.price.toFixed(2)} / ${item.product.unit}</div>
        <div class="cart-item-controls">
          <button class="qty-btn qty-minus" data-id="${item.productId}">−</button>
          <span class="qty-value">${item.quantity}</span>
          <button class="qty-btn qty-plus" data-id="${item.productId}">+</button>
        </div>
      </div>
      <div style="display:flex;flex-direction:column;align-items:flex-end;gap:8px;">
        <button class="cart-item-remove" data-id="${item.productId}" aria-label="Remove item">🗑️</button>
        <span class="cart-item-subtotal">₹${item.subtotal.toFixed(2)}</span>
      </div>
    `;

    // Quantity controls
    div.querySelector(".qty-minus").addEventListener("click", async () => {
      if (item.quantity <= 1) {
        await Api.removeFromCart(item.productId);
      } else {
        await Api.updateCartItem(item.productId, item.quantity - 1);
      }
      refreshCart();
    });

    div.querySelector(".qty-plus").addEventListener("click", async () => {
      await Api.updateCartItem(item.productId, item.quantity + 1);
      refreshCart();
    });

    div.querySelector(".cart-item-remove").addEventListener("click", async () => {
      await Api.removeFromCart(item.productId);
      App.showToast("Item removed from cart", "info");
      refreshCart();
    });

    return div;
  }

  async function refreshCart() {
    try {
      const data = await Api.getCart();
      const items = data.items || [];
      const container = cartItemsEl();
      const emptyEl = cartEmptyEl();
      const footer = cartFooter();

      updateBadge(data.count || 0);

      if (items.length === 0) {
        container.classList.add("hidden");
        footer.classList.add("hidden");
        emptyEl.classList.remove("hidden");
      } else {
        emptyEl.classList.add("hidden");
        container.classList.remove("hidden");
        footer.classList.remove("hidden");

        container.innerHTML = "";
        items.forEach((item) => {
          container.appendChild(renderCartItem(item));
        });

        subtotalEl().textContent = `₹${data.total.toFixed(2)}`;
        totalEl().textContent = `₹${data.total.toFixed(2)}`;
      }

      return data;
    } catch (err) {
      console.error("Failed to refresh cart:", err);
    }
  }

  async function addItem(productId, quantity = 1) {
    try {
      await Api.addToCart(productId, quantity);
      const data = await Api.getCart();
      updateBadge(data.count || 0);
      App.showToast("Added to cart! 🎉", "success");
    } catch (err) {
      console.error("Failed to add to cart:", err);
      App.showToast("Failed to add item", "error");
    }
  }

  async function clearAll() {
    try {
      await Api.clearCart();
      App.showToast("Cart cleared", "info");
      refreshCart();
    } catch (err) {
      console.error("Failed to clear cart:", err);
    }
  }

  return {
    init() {
      // Open/close drawer
      document.getElementById("cart-btn").addEventListener("click", openDrawer);
      document.getElementById("drawer-close").addEventListener("click", closeDrawer);
      document.getElementById("drawer-overlay").addEventListener("click", closeDrawer);

      // Clear cart
      document.getElementById("clear-cart-btn").addEventListener("click", clearAll);

      // Checkout button
      document.getElementById("checkout-btn").addEventListener("click", () => {
        closeDrawer();
        setTimeout(() => Checkout.open(), 450);
      });

      // Initial badge update
      refreshCart();
    },
    addItem,
    refreshCart,
    openDrawer,
    closeDrawer,
    updateBadge
  };
})();
