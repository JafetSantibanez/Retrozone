// ────────────────────────────────────────────────────────────────────────────
// cart-store.js — Fuente única de verdad del carrito (persistido en localStorage)
// Lo usan: la página del carrito, el catálogo (botón "Agregar") y el navbar (badge)
// ────────────────────────────────────────────────────────────────────────────

const STORAGE_KEY = "retrozone_cart";

// ── Lectura / escritura base ────────────────────────────────────────────────
export function getCart() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function saveCart(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  // Avisamos a quien escuche (badge del navbar, página del carrito, etc.)
  document.dispatchEvent(new CustomEvent("cart:updated", { detail: items }));
  updateBadge();
}

// ── Operaciones ─────────────────────────────────────────────────────────────
export function addItem(producto, cantidad = 1) {
  const items = getCart();
  const existente = items.find((i) => i.id === producto.id);

  if (existente) {
    existente.cantidad += cantidad;
  } else {
    items.push({
      id: producto.id,
      nombre: producto.nombre,
      plataforma: producto.plataforma,
      imagen: producto.imagen,
      precio: producto.precio,
      precioOriginal: producto.precioOriginal ?? producto.precio,
      descuento: producto.descuento ?? 0,
      cantidad,
    });
  }
  saveCart(items);
}

export function removeItem(id) {
  saveCart(getCart().filter((i) => i.id !== id));
}

export function setQty(id, cantidad) {
  const items = getCart();
  const item = items.find((i) => i.id === id);
  if (!item) return;
  item.cantidad = Math.max(1, cantidad); // nunca menos de 1 (para quitar, usa removeItem)
  saveCart(items);
}

export function clearCart() {
  saveCart([]);
}

// ── Cálculos ────────────────────────────────────────────────────────────────
export function getCount() {
  return getCart().reduce((acc, i) => acc + i.cantidad, 0);
}

export function getSubtotal() {
  // Suma a precio original (sin descuentos)
  return getCart().reduce((acc, i) => acc + i.precioOriginal * i.cantidad, 0);
}

export function getTotal() {
  // Suma a precio final (con descuentos ya aplicados)
  return getCart().reduce((acc, i) => acc + i.precio * i.cantidad, 0);
}

export function getAhorro() {
  return getSubtotal() - getTotal();
}

// ── Badge del navbar ────────────────────────────────────────────────────────
export function updateBadge() {
  const count = getCount();
  document.querySelectorAll(".carrito-badge").forEach((badge) => {
    badge.textContent = count;
    badge.style.display = count > 0 ? "" : badge.style.display;
  });
}
