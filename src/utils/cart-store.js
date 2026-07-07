// =============================================================================
// cart-store.js
// "La bodega" del carrito — es el único archivo que lee y escribe los datos
// del carrito. Cualquier otra página que necesite el carrito importa funciones
// de aquí, en lugar de manejar localStorage por su cuenta.
//
// ¿Por qué hacerlo así?
//   Si mañana cambiamos cómo guardamos el carrito (por ejemplo, en una base
//   de datos), solo tocamos ESTE archivo. El catálogo y la página del carrito
//   no se enteran del cambio.
//
// Archivos que importan de aquí:
//   - src/pages/catalog/catalog.js       → usa addItem, updateBadge
//   - src/pages/shopping-cart/cart.js    → usa todo
//   - src/components/navbar/NavBar-vite.js → usa updateBadge
// =============================================================================

// ----------------------------------------------------------------------------
// CLAVE DE ALMACENAMIENTO
// localStorage es como una pequeña base de datos del navegador: guarda pares
// clave-valor en texto. Usamos esta constante como nombre de la clave para
// no escribir el string "retrozone_cart" a mano en varios lugares
// (si lo cambiamos, solo lo cambiamos aquí).
// ----------------------------------------------------------------------------
const STORAGE_KEY = "retrozone_cart";


// ============================================================================
// LECTURA Y ESCRITURA BASE
// Estas dos funciones son las únicas que tocan localStorage directamente.
// El resto del archivo las usa en lugar de acceder a localStorage solas.
// ============================================================================

/**
 * getCart()
 * Lee el carrito guardado en el navegador y lo devuelve como array de objetos.
 *
 * localStorage solo puede guardar TEXTO, así que cuando guardamos el carrito
 * lo convertimos a texto con JSON.stringify. Aquí lo convertimos de vuelta a
 * array con JSON.parse.
 *
 * El try/catch maneja el caso raro en que el texto guardado esté corrupto
 * (ej: alguien editó localStorage a mano y puso texto inválido).
 * En ese caso devolvemos un array vacío para no romper la app.
 *
 * Retorna: Array de objetos, cada uno representando un producto en el carrito.
 *          Ejemplo: [{ id: 3, nombre: "Pokémon Rojo", precio: 350, cantidad: 2, ... }]
 */
export function getCart() {
  try {
    // localStorage.getItem devuelve null si no existe la clave.
    // JSON.parse(null) daría error, por eso el || [] garantiza un array vacío.
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

/**
 * saveCart(items)
 * Guarda el array de items en localStorage y notifica a toda la app
 * que el carrito cambió.
 *
 * Esta función es PRIVADA (no tiene "export"), solo se usa dentro de
 * este archivo. Así controlamos que nadie escriba en localStorage
 * sin pasar por aquí.
 *
 * Parámetro: items — el array completo y actualizado del carrito.
 */
function saveCart(items) {
  // Guardamos en localStorage. JSON.stringify convierte el array a texto.
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));

  // Disparamos un evento personalizado llamado "cart:updated".
  // Es como gritar "¡el carrito cambió!" para que cualquier parte de la
  // página que esté escuchando pueda reaccionar (actualizar el badge,
  // re-renderizar la lista de items, etc.).
  // { detail: items } adjunta los datos nuevos al evento por si alguien
  // los necesita sin tener que leer localStorage otra vez.
  document.dispatchEvent(new CustomEvent("cart:updated", { detail: items }));

  // Actualizamos el número que aparece sobre el ícono del carrito en el navbar.
  updateBadge();
}


// ============================================================================
// OPERACIONES DEL CARRITO
// Estas son las acciones que el usuario puede hacer: agregar, quitar,
// cambiar cantidad y vaciar. Cada una llama a saveCart al final para
// persistir el cambio y notificar a la app.
// ============================================================================

/**
 * addItem(producto, cantidad)
 * Agrega un producto al carrito. Si el producto ya estaba, suma la cantidad
 * en lugar de agregarlo dos veces.
 *
 * Parámetros:
 *   producto — objeto del catálogo con id, nombre, precio, etc.
 *   cantidad — cuántas unidades agregar (por defecto 1).
 */
export function addItem(producto, cantidad = 1) {
  const items = getCart();

  // Buscamos si el producto ya existe en el carrito comparando por id.
  // Array.find devuelve el objeto encontrado, o undefined si no está.
  const existente = items.find((i) => i.id === producto.id);

  if (existente) {
    // Si ya estaba, solo sumamos la cantidad al existente.
    existente.cantidad += cantidad;
  } else {
    // Si es nuevo, lo agregamos al array con toda su información.
    // Guardamos precioOriginal y descuento para poder calcular el ahorro
    // en la página del carrito.
    // El ?? (nullish coalescing) dice: "usa el valor de la izquierda,
    // y si es null o undefined usa el de la derecha".
    items.push({
      id:             producto.id,
      nombre:         producto.nombre,
      plataforma:     producto.plataforma,
      imagen:         producto.imagen,
      precio:         producto.precio,         // precio final (con descuento)
      precioOriginal: producto.precioOriginal ?? producto.precio, // precio sin descuento
      descuento:      producto.descuento ?? 0, // porcentaje de descuento
      cantidad,                                // shorthand: cantidad: cantidad
    });
  }

  saveCart(items);
}

/**
 * removeItem(id)
 * Elimina un producto del carrito por su id.
 *
 * Array.filter crea un NUEVO array que solo incluye los elementos que
 * pasan la condición. Aquí nos quedamos con todos EXCEPTO el que tiene
 * el id que queremos eliminar.
 */
export function removeItem(id) {
  saveCart(getCart().filter((i) => i.id !== id));
}

/**
 * setQty(id, cantidad)
 * Cambia la cantidad de un producto específico.
 * Se usa con los botones + y − de la página del carrito.
 *
 * Math.max(1, cantidad) garantiza que la cantidad nunca baje de 1.
 * Para quitar un producto completamente se usa removeItem.
 */
export function setQty(id, cantidad) {
  const items = getCart();
  const item = items.find((i) => i.id === id);
  if (!item) return; // si por alguna razón no existe, no hacemos nada

  item.cantidad = Math.max(1, cantidad);
  saveCart(items);
}

/**
 * clearCart()
 * Vacía el carrito completamente.
 * Guarda un array vacío, lo que dispara el evento y el badge en 0.
 */
export function clearCart() {
  saveCart([]);
}


// ============================================================================
// CÁLCULOS
// Funciones que leen el carrito y devuelven un número calculado.
// La página del carrito las usa para mostrar subtotal, descuentos y total.
// ============================================================================

/**
 * getCount()
 * Devuelve el número TOTAL de unidades en el carrito (sumando cantidades).
 * Ej: 2 unidades de Mario + 1 de Zelda = 3.
 *
 * Array.reduce recorre el array acumulando un valor.
 * acc (acumulador) empieza en 0 y va sumando la cantidad de cada item.
 */
export function getCount() {
  return getCart().reduce((acc, i) => acc + i.cantidad, 0);
}

/**
 * getSubtotal()
 * Suma los precios ORIGINALES (sin descuento) × cantidad de cada producto.
 * Representa cuánto costaría sin ninguna oferta.
 */
export function getSubtotal() {
  return getCart().reduce((acc, i) => acc + i.precioOriginal * i.cantidad, 0);
}

/**
 * getTotal()
 * Suma los precios FINALES (con descuento ya aplicado) × cantidad.
 * Es lo que el usuario realmente paga.
 */
export function getTotal() {
  return getCart().reduce((acc, i) => acc + i.precio * i.cantidad, 0);
}

/**
 * getAhorro()
 * Diferencia entre el subtotal (precio original) y el total (precio con descuento).
 * Es cuánto dinero se está ahorrando el usuario por las ofertas.
 */
export function getAhorro() {
  return getSubtotal() - getTotal();
}


// ============================================================================
// BADGE DEL NAVBAR
// El "badge" es el círculo rojo con número que aparece sobre el ícono del
// carrito en la barra de navegación.
// ============================================================================

/**
 * updateBadge()
 * Busca todos los elementos con clase "carrito-badge" en la página
 * (puede haber uno en móvil y otro en escritorio) y actualiza su número.
 *
 * Se llama automáticamente cada vez que saveCart guarda cambios,
 * y también al cargar cualquier página que importe este módulo.
 */
export function updateBadge() {
  const count = getCount();

  // querySelectorAll devuelve TODOS los elementos que coinciden con el selector.
  // forEach recorre cada uno y actualiza su texto.
  document.querySelectorAll(".carrito-badge").forEach((badge) => {
    badge.textContent = count;
    // Si el conteo es mayor a 0, quitamos cualquier display:none que pudiera tener.
    // Si es 0, dejamos el display como está (el CSS controla si se ve o no).
    badge.style.display = count > 0 ? "" : badge.style.display;
  });
}
