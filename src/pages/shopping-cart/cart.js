// =============================================================================
// cart.js — Lógica de la página del carrito (cart.html)
//
// Este archivo se encarga de MOSTRAR el carrito en pantalla y reaccionar
// a las acciones del usuario (sumar, restar, quitar, vaciar, pagar).
//
// NO guarda datos por sí solo: para eso importa las funciones de cart-store.js,
// que es quien realmente lee y escribe en localStorage.
//
// Flujo general:
//   1. La página carga  →  render() dibuja los productos del carrito
//   2. Usuario hace clic en un botón  →  se llama a cart-store (setQty / removeItem)
//   3. cart-store guarda el cambio y dispara el evento "cart:updated"
//   4. render() vuelve a dibujar la pantalla con los datos nuevos
// =============================================================================

// ----------------------------------------------------------------------------
// IMPORTACIONES
// Traemos solo las funciones que necesitamos de cart-store.js.
// La sintaxis "../../utils/cart-store.js" es una ruta relativa:
//   - "../../" sube dos carpetas (de shopping-cart → pages → src)
//   - "utils/cart-store.js" entra a la carpeta utils
// ----------------------------------------------------------------------------
import {
  getCart,       // leer el carrito actual
  setQty,        // cambiar cantidad de un producto
  removeItem,    // eliminar un producto
  clearCart,     // vaciar todo el carrito
  getCount,      // total de unidades (para el resumen)
  getSubtotal,   // precio sin descuentos (para el resumen)
  getTotal,      // precio final a pagar (para el resumen)
  getAhorro,     // diferencia = cuánto se ahorra el usuario
  updateBadge,   // actualizar el número en el ícono del navbar
} from "../../utils/cart-store.js";


// ============================================================================
// FUNCIÓN: itemHTML(item)
// Genera el código HTML de UNA fila del carrito (un producto).
// Recibe un objeto "item" del array del carrito y devuelve un string HTML
// que se insertará en la página.
//
// Usamos Template Literals (los backticks ` `) para escribir HTML de varias
// líneas con variables de JavaScript adentro usando ${}.
// ============================================================================
function itemHTML(item) {
  // Construimos la ruta de la imagen del juego.
  const imgSrc = `/src/assets/games/${item.imagen}`;

  // Precio de esta línea = precio unitario × cantidad.
  const subtotalLinea = item.precio * item.cantidad;

  // Si el descuento es mayor a 0, hay oferta: mostramos precio tachado.
  const tieneDescuento = item.descuento > 0;

  // Devolvemos el HTML completo de la fila.
  // data-id="${item.id}" guarda el id del producto en el HTML para poder
  // identificarlo cuando el usuario haga clic en los botones + / − / quitar.
  return `
    <div class="cart-item" data-id="${item.id}">

      <!-- Imagen del producto -->
      <div class="cart-item-img-wrap">
        <img
          src="${imgSrc}"
          alt="${item.nombre}"
          class="cart-item-img"
          onerror="this.style.display='none'; this.nextElementSibling.style.display='block'"
        />
        <!-- onerror: si la imagen no existe, ocultamos el <img> y mostramos
             el emoji de reemplazo que está justo después (nextElementSibling) -->
        <span class="cart-item-img-placeholder" style="display:none">🎮</span>
      </div>

      <!-- Nombre, plataforma y badge de descuento -->
      <div class="cart-item-info">
        <span class="cart-item-nombre">${item.nombre}</span>
        <span class="cart-item-plataforma">${item.plataforma}</span>
        ${tieneDescuento ? `<span class="cart-item-desc-badge">-${item.descuento}%</span>` : ""}
      </div>

      <!-- Precio unitario. Si hay descuento, también mostramos el precio original tachado -->
      <div class="cart-item-precio">
        $${item.precio}
        ${tieneDescuento ? `<span class="cart-item-precio-original">$${item.precioOriginal}</span>` : ""}
      </div>

      <!-- Controles de cantidad: botón restar, número actual, botón sumar -->
      <!-- data-accion indica qué debe hacer el listener de clic (ver más abajo) -->
      <div class="cart-item-cantidad">
        <button class="qty-btn" data-accion="restar" aria-label="Restar uno">−</button>
        <span class="qty-valor">${item.cantidad}</span>
        <button class="qty-btn" data-accion="sumar" aria-label="Sumar uno">+</button>
      </div>

      <!-- Subtotal de esta línea: precio × cantidad -->
      <div class="cart-item-subtotal">$${subtotalLinea}</div>

      <!-- Botón para eliminar este producto del carrito -->
      <div class="cart-item-quitar">
        <button class="btn-quitar" data-accion="quitar" aria-label="Quitar producto">
          <i class="bi bi-x-circle-fill"></i>
        </button>
      </div>

    </div>`;
}


// ============================================================================
// FUNCIÓN: render()
// "Re-dibuja" toda la página del carrito según el estado actual en localStorage.
// Se llama al cargar la página y cada vez que algo cambia en el carrito.
//
// Tiene dos modos:
//   - Carrito vacío  → muestra la sección #cartVacio  (alien flotando)
//   - Con productos  → muestra la sección #cartContenido (lista + resumen)
// ============================================================================
function render() {
  // Leemos el carrito FRESCO desde localStorage cada vez.
  const items = getCart();

  // Obtenemos las dos secciones del HTML que alternaremos.
  const contenido = document.getElementById("cartContenido"); // lista de productos
  const vacio     = document.getElementById("cartVacio");     // pantalla vacía

  // --- MODO VACÍO ---
  if (items.length === 0) {
    // d-none es una clase de Bootstrap que aplica display:none (oculta el elemento).
    contenido.classList.add("d-none");    // ocultamos la lista
    vacio.classList.remove("d-none");     // mostramos la pantalla vacía
    return; // salimos de la función, no hay nada más que hacer
  }

  // --- MODO CON PRODUCTOS ---
  vacio.classList.add("d-none");          // ocultamos la pantalla vacía
  contenido.classList.remove("d-none");   // mostramos la lista

  // Convertimos cada item en su HTML y los unimos en un solo string.
  // Array.map transforma cada elemento del array usando itemHTML.
  // Array.join("") los concatena sin separador.
  document.getElementById("listaItems").innerHTML = items.map(itemHTML).join("");

  // Actualizamos los números del resumen lateral.
  document.getElementById("resumenCount").textContent    = getCount();
  document.getElementById("resumenSubtotal").textContent = `$${getSubtotal()}`;
  document.getElementById("resumenAhorro").textContent   = `-$${getAhorro()}`;
  document.getElementById("resumenTotal").textContent    = `$${getTotal()}`;
}


// ============================================================================
// INICIALIZACIÓN — DOMContentLoaded
// Este evento se dispara cuando el navegador terminó de leer el HTML y ya
// todos los elementos del DOM existen. Es el momento seguro para buscar
// elementos y agregarles listeners.
// ============================================================================
document.addEventListener("DOMContentLoaded", () => {

  // Al cargar la página: actualizamos el badge del navbar y dibujamos el carrito.
  updateBadge();
  render();

  // --------------------------------------------------------------------------
  // DELEGACIÓN DE EVENTOS en la lista de productos
  //
  // En lugar de poner un listener en CADA botón + / − / quitar
  // (que se recrean cada vez que render() corre), ponemos UN SOLO listener
  // en el contenedor padre #listaItems. Cuando el usuario hace clic en
  // cualquier botón dentro, el evento "sube" hasta #listaItems (esto se
  // llama "event bubbling").
  //
  // Ahí identificamos qué botón fue con e.target.closest("[data-accion]"),
  // que busca el ancestro más cercano con ese atributo.
  // --------------------------------------------------------------------------
  document.getElementById("listaItems").addEventListener("click", (e) => {
    // ¿El clic fue sobre un elemento con data-accion, o un hijo suyo?
    const btn = e.target.closest("[data-accion]");
    if (!btn) return; // clic en zona vacía, ignoramos

    // Subimos hasta el .cart-item para obtener el id del producto.
    const itemEl = btn.closest(".cart-item");
    const id     = Number(itemEl.dataset.id); // convertimos string a número
    const accion = btn.dataset.accion;        // "sumar", "restar" o "quitar"

    // Leemos el item actual del carrito para saber su cantidad.
    const item = getCart().find((i) => i.id === id);
    if (!item) return; // por seguridad, si no existe ignoramos

    // Ejecutamos la acción correspondiente en cart-store.
    // setQty con cantidad - 1 puede llegar a 0, pero cart-store tiene
    // Math.max(1, cantidad) entonces nunca baja de 1.
    if (accion === "sumar")  setQty(id, item.cantidad + 1);
    if (accion === "restar") setQty(id, item.cantidad - 1);
    if (accion === "quitar") removeItem(id);

    // Re-dibujamos la pantalla para mostrar el cambio.
    render();
  });

  // --------------------------------------------------------------------------
  // BOTÓN "VACIAR CARRITO"
  // Pedimos confirmación antes de borrar todo (buena práctica de UX).
  // --------------------------------------------------------------------------
  document.getElementById("btnVaciar").addEventListener("click", () => {
    if (confirm("¿Seguro que quieres vaciar el carrito?")) {
      clearCart(); // borra todo en localStorage y dispara "cart:updated"
      render();    // actualiza la pantalla al estado vacío
    }
  });

  // --------------------------------------------------------------------------
  // BOTÓN "PROCEDER AL PAGO"
  // Verifica si el usuario está logueado antes de continuar.
  // La sesión se guarda en localStorage o sessionStorage dependiendo de si
  // el usuario eligió "recordarme" al iniciar sesión.
  // --------------------------------------------------------------------------
  document.getElementById("btnPagar").addEventListener("click", () => {
    const logueado =
      localStorage.getItem("usuarioLogueado") ||
      sessionStorage.getItem("usuarioLogueado");

    if (!logueado) {
      // Si no está logueado, lo mandamos a iniciar sesión.
      alert("Inicia sesión para continuar con tu compra.");
      window.location.href = "/src/pages/auth/login/login.html";
      return; // salimos para no ejecutar el código de abajo
    }

    // TODO: aquí iría la integración con una pasarela de pago real.
    alert(`¡Gracias por tu compra! Total: $${getTotal()}`);
  });

  // --------------------------------------------------------------------------
  // SINCRONIZACIÓN ENTRE PESTAÑAS
  // Si el usuario tiene el catálogo abierto en otra pestaña y agrega algo,
  // cart-store dispara "cart:updated". Este listener lo escucha y re-dibuja
  // el carrito para reflejar el cambio sin necesidad de recargar la página.
  // --------------------------------------------------------------------------
  document.addEventListener("cart:updated", render);
});
