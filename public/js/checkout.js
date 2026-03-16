/* ═══════════════════════════════════════════════════
   Checkout Module — FreshCart
   ═══════════════════════════════════════════════════ */

const Checkout = (() => {
  const overlay = () => document.getElementById("checkout-overlay");
  const confirmOverlay = () => document.getElementById("confirmation-overlay");

  async function open() {
    const modal = overlay();

    // Load cart data for summary
    const data = await Api.getCart();
    if (!data.items || data.items.length === 0) {
      App.showToast("Your cart is empty!", "error");
      return;
    }

    renderSummary(data);
    modal.classList.remove("hidden");
    document.body.style.overflow = "hidden";

    requestAnimationFrame(() => {
      modal.classList.add("show");
    });
  }

  function close() {
    const modal = overlay();
    modal.classList.remove("show");
    document.body.style.overflow = "";
    setTimeout(() => modal.classList.add("hidden"), 400);
  }

  function renderSummary(data) {
    const summaryEl = document.getElementById("checkout-summary");
    summaryEl.innerHTML = `
      <div class="checkout-summary-title">Order Summary</div>
      ${data.items.map((item) => `
        <div class="checkout-item">
          <span class="checkout-item-name">
            ${item.product.image} ${item.product.name}
            <span class="checkout-item-qty">× ${item.quantity}</span>
          </span>
          <span class="checkout-item-subtotal">₹${item.subtotal.toFixed(2)}</span>
        </div>
      `).join("")}
      <div class="checkout-total">
        <span>Total</span>
        <span class="checkout-total-value">₹${data.total.toFixed(2)}</span>
      </div>
    `;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const name = document.getElementById("customer-name").value.trim();
    const phone = document.getElementById("customer-phone").value.trim();
    const address = document.getElementById("customer-address").value.trim();

    if (!name || !phone || !address) {
      App.showToast("Please fill in all fields", "error");
      return;
    }

    const submitBtn = document.getElementById("place-order-btn");
    const btnText = submitBtn.querySelector(".btn-text");
    const loader = document.getElementById("order-loader");

    submitBtn.disabled = true;
    btnText.textContent = "Placing Order...";
    loader.classList.remove("hidden");

    try {
      const result = await Api.placeOrder({ name, phone, address });

      if (result.success) {
        close();
        setTimeout(() => showConfirmation(result.order), 500);
        Cart.updateBadge(0);

        // Reset form
        document.getElementById("checkout-form").reset();
      } else {
        App.showToast(result.message || "Failed to place order", "error");
      }
    } catch (err) {
      console.error("Order failed:", err);
      App.showToast("Failed to place order. Please try again.", "error");
    } finally {
      submitBtn.disabled = false;
      btnText.textContent = "Place Order";
      loader.classList.add("hidden");
    }
  }

  function showConfirmation(order) {
    const modal = confirmOverlay();
    const content = document.getElementById("confirmation-content");

    content.innerHTML = `
      <span class="confirm-icon">🎉</span>
      <h2 class="confirm-title">Order Placed!</h2>
      <p class="confirm-message">Your fresh groceries are on the way!</p>
      <div class="confirm-order-id">
        📦 Order #${order.id}
      </div>
      <div class="confirm-details">
        ${order.items.map((item) => `
          <div class="confirm-detail-row">
            <span class="confirm-detail-label">${item.image} ${item.name} × ${item.quantity}</span>
            <span class="confirm-detail-value">₹${item.subtotal.toFixed(2)}</span>
          </div>
        `).join("")}
        <div class="confirm-detail-row confirm-total-row">
          <span>Total</span>
          <span class="confirm-total-value">₹${order.total.toFixed(2)}</span>
        </div>
      </div>
      <div class="confirm-actions">
        <button class="confirm-btn-primary" id="confirm-continue-btn">Continue Shopping</button>
        <button class="confirm-btn-secondary" id="confirm-orders-btn">View Orders</button>
      </div>
    `;

    modal.classList.remove("hidden");
    document.body.style.overflow = "hidden";

    requestAnimationFrame(() => {
      modal.classList.add("show");
    });

    // Button handlers
    document.getElementById("confirm-continue-btn").addEventListener("click", () => {
      closeConfirmation();
    });

    document.getElementById("confirm-orders-btn").addEventListener("click", () => {
      closeConfirmation();
      App.showOrders();
    });
  }

  function closeConfirmation() {
    const modal = confirmOverlay();
    modal.classList.remove("show");
    document.body.style.overflow = "";
    setTimeout(() => modal.classList.add("hidden"), 400);
  }

  return {
    init() {
      document.getElementById("checkout-close").addEventListener("click", close);
      document.getElementById("checkout-overlay").addEventListener("click", (e) => {
        if (e.target === document.getElementById("checkout-overlay")) close();
      });
      document.getElementById("checkout-form").addEventListener("submit", handleSubmit);
    },
    open,
    close
  };
})();
