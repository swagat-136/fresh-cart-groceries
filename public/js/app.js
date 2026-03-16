/* ═══════════════════════════════════════════════════
   App Controller — FreshCart
   ═══════════════════════════════════════════════════ */

const App = (() => {
  // ── Toast Notifications ─────────────────────────
  function showToast(message, type = "success") {
    const container = document.getElementById("toast-container");
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;

    const icons = { success: "✅", error: "❌", info: "ℹ️", warning: "⚠️" };
    toast.innerHTML = `
      <span class="toast-icon">${icons[type] || icons.info}</span>
      <span>${message}</span>
    `;

    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3200);
  }

  // ── Page Navigation ─────────────────────────────
  function showShop() {
    document.getElementById("hero-section").classList.remove("hidden");
    document.getElementById("categories-section").classList.remove("hidden");
    document.getElementById("products-section").classList.remove("hidden");
    document.getElementById("orders-section").classList.add("hidden");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function showOrders() {
    document.getElementById("hero-section").classList.add("hidden");
    document.getElementById("categories-section").classList.add("hidden");
    document.getElementById("products-section").classList.add("hidden");
    document.getElementById("orders-section").classList.remove("hidden");

    window.scrollTo({ top: 0, behavior: "smooth" });
    await loadOrders();
  }

  async function loadOrders() {
    const listEl = document.getElementById("orders-list");
    const emptyEl = document.getElementById("empty-orders");

    listEl.innerHTML = '<div class="skeleton skeleton-card" style="height:120px"></div>'.repeat(3);
    emptyEl.classList.add("hidden");

    try {
      const data = await Api.getOrders();
      const orders = data.orders || [];

      if (orders.length === 0) {
        listEl.innerHTML = "";
        emptyEl.classList.remove("hidden");
        return;
      }

      listEl.innerHTML = "";
      orders.forEach((order, i) => {
        const card = document.createElement("div");
        card.className = "order-card";
        card.style.animationDelay = `${i * 100}ms`;

        const date = new Date(order.createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit"
        });

        card.innerHTML = `
          <div class="order-card-header">
            <span class="order-id">📦 Order #${order.id}</span>
            <span class="order-status">✓ ${order.status}</span>
          </div>
          <div class="order-items-list">
            ${order.items.map((item) => `
              <span class="order-item-chip">${item.image} ${item.name} × ${item.quantity}</span>
            `).join("")}
          </div>
          <div class="order-card-footer">
            <span class="order-date">${date}</span>
            <span class="order-total">₹${order.total.toFixed(2)}</span>
          </div>
        `;

        listEl.appendChild(card);
      });
    } catch (err) {
      console.error("Failed to load orders:", err);
      listEl.innerHTML = "";
      emptyEl.classList.remove("hidden");
    }
  }

  // ── Navbar Scroll Effect ────────────────────────
  function initNavbarScroll() {
    const navbar = document.getElementById("navbar");
    let ticking = false;

    window.addEventListener("scroll", () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          navbar.classList.toggle("scrolled", window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  // ── Hero CTA ────────────────────────────────────
  function initHeroCTA() {
    document.getElementById("hero-shop-btn").addEventListener("click", () => {
      document.getElementById("categories-section").scrollIntoView({ behavior: "smooth" });
    });
  }

  // ── Initialize Everything ───────────────────────
  function init() {
    // Nav logo → shop
    document.getElementById("nav-logo").addEventListener("click", (e) => {
      e.preventDefault();
      showShop();
    });

    // Orders button
    document.getElementById("orders-btn").addEventListener("click", showOrders);

    // Back to shop from orders
    document.getElementById("orders-back-btn").addEventListener("click", showShop);

    // Init modules
    initNavbarScroll();
    initHeroCTA();
    Products.init();
    Cart.init();
    Checkout.init();

    console.log("%c🛒 FreshCart Ready!", "color: #16a34a; font-size: 16px; font-weight: bold;");
  }

  // Boot on DOM ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  return { showToast, showShop, showOrders };
})();
