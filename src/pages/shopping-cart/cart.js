import {
  getCart,
  setQty,
  removeItem,
  clearCart,
  getCount,
  getSubtotal,
  getTotal,
  getAhorro,
  updateBadge,
} from "../../utils/cart-store.js";

// ── HTML de un item ─────────────────────────────────────────────────────────
function itemHTML(item) {
  const imgSrc = `/src/assets/games/${item.imagen}`;
  const subtotalLinea = item.precio * item.cantidad;
  const tieneDescuento = item.descuento > 0;

  return `
    <div class="cart-item" data-id="${item.id}">

      <div class="cart-item-img-wrap">
        <img
          src="${imgSrc}"
          alt="${item.nombre}"
          class="cart-item-img"
          onerror="this.style.display='none'; this.nextElementSibling.style.display='block'"
        />
        <span class="cart-item-img-placeholder" style="display:none">🎮</span>
      </div>

      <div class="cart-item-info">
        <span class="cart-item-nombre">${item.nombre}</span>
        <span class="cart-item-plataforma">${item.plataforma}</span>
        ${tieneDescuento ? `<span class="cart-item-desc-badge">-${item.descuento}%</span>` : ""}
      </div>

      <div class="cart-item-precio">
        $${item.precio}
        ${tieneDescuento ? `<span class="cart-item-precio-original">$${item.precioOriginal}</span>` : ""}
      </div>

      <div class="cart-item-cantidad">
        <button class="qty-btn" data-accion="restar" aria-label="Restar uno">−</button>
        <span class="qty-valor">${item.cantidad}</span>
        <button class="qty-btn" data-accion="sumar" aria-label="Sumar uno">+</button>
      </div>

      <div class="cart-item-subtotal">$${subtotalLinea}</div>

      <div class="cart-item-quitar">
        <button class="btn-quitar" data-accion="quitar" aria-label="Quitar producto">
          <i class="bi bi-x-circle-fill"></i>
        </button>
      </div>

    </div>`;
}

// ── Render completo ─────────────────────────────────────────────────────────
function render() {
  const items = getCart();
  const contenido = document.getElementById("cartContenido");
  const vacio = document.getElementById("cartVacio");

  // Alternar entre carrito vacío y con productos
  if (items.length === 0) {
    contenido.classList.add("d-none");
    vacio.classList.remove("d-none");
    return;
  }
  vacio.classList.add("d-none");
  contenido.classList.remove("d-none");

  // Lista de items
  document.getElementById("listaItems").innerHTML = items.map(itemHTML).join("");

  // Resumen
  document.getElementById("resumenCount").textContent    = getCount();
  document.getElementById("resumenSubtotal").textContent = `$${getSubtotal()}`;
  document.getElementById("resumenAhorro").textContent   = `-$${getAhorro()}`;
  document.getElementById("resumenTotal").textContent    = `$${getTotal()}`;
}

// ── Eventos ─────────────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  updateBadge();
  render();

  // Delegación: botones +/- y quitar dentro de la lista
  document.getElementById("listaItems").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-accion]");
    if (!btn) return;

    const itemEl = btn.closest(".cart-item");
    const id = Number(itemEl.dataset.id);
    const accion = btn.dataset.accion;

    const item = getCart().find((i) => i.id === id);
    if (!item) return;

    if (accion === "sumar")  setQty(id, item.cantidad + 1);
    if (accion === "restar") setQty(id, item.cantidad - 1);
    if (accion === "quitar") removeItem(id);

    render();
  });

  // Vaciar carrito
  document.getElementById("btnVaciar").addEventListener("click", () => {
    if (confirm("¿Seguro que quieres vaciar el carrito?")) {
      clearCart();
      render();
    }
  });

  // Proceder al pago
  document.getElementById("btnPagar").addEventListener("click", () => {
    const logueado =
      localStorage.getItem("usuarioLogueado") ||
      sessionStorage.getItem("usuarioLogueado");

    if (!logueado) {
      alert("Inicia sesión para continuar con tu compra.");
      window.location.href = "/src/pages/auth/login/login.html";
      return;
    }
    // TODO: integrar con la página de checkout / pasarela de pago
    alert(`¡Gracias por tu compra! Total: $${getTotal()}`);
  });

  // Si el carrito cambia en otra pestaña, re-renderizar
  document.addEventListener("cart:updated", render);
});
