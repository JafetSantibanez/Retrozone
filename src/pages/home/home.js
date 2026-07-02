import { addItem, updateBadge } from "../../utils/cart-store.js";

let productos = [];

// Cargar productos desde el JSON
async function cargarProductos() {
	try {
		const response = await fetch("/src/pages/catalog/products.json");

		if (!response.ok) {
			throw new Error(`HTTP ${response.status}`);
		}

		productos = await response.json();
	} catch (error) {
		console.error("Error al cargar products.json:", error);
	}
}

// Inicializar Home
async function init() {
	await cargarProductos();

	// Actualiza el número del carrito al cargar la página
	updateBadge();

	// Delegación de eventos para todos los botones del slider
	document.addEventListener("click", (e) => {
		const btn = e.target.closest(".btn-carrito");

		if (!btn) return;

		const id = Number(btn.dataset.id);

		const producto = productos.find((p) => p.id === id);

		if (!producto) {
			console.error("Producto no encontrado:", id);
			return;
		}

		// Agregar al carrito
		addItem(producto);

		// Feedback visual
		const textoOriginal = btn.textContent;

		btn.textContent = "✓ AGREGADO";
		btn.disabled = true;

		setTimeout(() => {
			btn.textContent = textoOriginal;
			btn.disabled = false;
		}, 900);
	});
}

document.addEventListener("DOMContentLoaded", init);
