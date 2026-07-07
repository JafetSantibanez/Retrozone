// =============================================================================
// catalog.js — Lógica de la página del catálogo (catalog.html)
//
// Responsabilidades:
//   1. Cargar los productos desde products.json al abrir la página.
//   2. Filtrar y ordenar los productos según lo que el usuario seleccione.
//   3. Renderizar las tarjetas de producto en el grid HTML.
//   4. Manejar el botón "Agregar al carrito" en cada tarjeta.
//   5. Leer filtros desde la URL (ej: catalog.html?plataforma=NES).
// =============================================================================

// Importamos solo las dos funciones que necesitamos de cart-store:
//   - addItem: para agregar un producto al carrito al hacer clic
//   - updateBadge: para mostrar el conteo actual en el ícono del navbar
import { addItem, updateBadge } from "../../utils/cart-store.js";


// ============================================================================
// ESTADO GLOBAL DEL MÓDULO
// Estas variables viven durante toda la sesión de la página.
// "filtros" guarda qué tiene seleccionado el usuario en cada campo.
// "productos" guarda el array completo cargado desde products.json.
// ============================================================================

// Objeto con los filtros activos. Empieza con todo vacío (= sin filtro).
const filtros = {
  busqueda:  "",   // texto del campo de búsqueda
  plataforma: "",  // consola seleccionada (NES, SNES, GameBoy, etc.)
  categoria:  "",  // género seleccionado (RPG, Plataformas, Acción, etc.)
  estado:     "",  // condición física (Nuevo, Semi-nuevo, etc.)
  orden:      "",  // criterio de ordenación (precio-asc, nombre, etc.)
};

// Array que contendrá todos los productos una vez que se cargue el JSON.
// Declarado con "let" porque se reasigna en init().
let productos = [];


// ============================================================================
// FUNCIONES AUXILIARES (Helpers)
// Pequeñas funciones de apoyo que otros lugares del código usan.
// ============================================================================

/**
 * corazonesHTML(n)
 * Genera los 5 corazones de valoración de un producto.
 * Los primeros "n" son de color (rellenos), el resto están vacíos.
 * Retorna un string HTML con los 5 <span>.
 */
function corazonesHTML(n) {
  let html = "";
  for (let i = 1; i <= 5; i++) {
    // Si i es menor o igual a n, el corazón está relleno; si no, vacío.
    html += `<span class="${i <= n ? "heart-full" : "heart-empty"}">♥</span>`;
  }
  return html;
}

/**
 * estadoClass(estado)
 * Convierte el texto del estado físico del producto en una clase CSS
 * para darle el color correspondiente en la tarjeta.
 * El operador ?? devuelve "" si el estado no está en el mapa.
 */
function estadoClass(estado) {
  const map = {
    "Nuevo":       "estado-nuevo",
    "Semi-nuevo":  "estado-seminuevo",
    "Buen estado": "estado-buenestado",
    "Aceptable":   "estado-aceptable",
    "Desgastado":  "estado-desgastado",
  };
  return map[estado] ?? "";
}

/**
 * stockClass(stock) / stockLabel(stock)
 * Devuelven la clase CSS y el texto a mostrar según el nivel de stock.
 */
function stockClass(stock) {
  return stock === "pocas unidades" ? "pocas" : "enstock";
}

function stockLabel(stock) {
  return stock === "pocas unidades" ? "POCAS UNIDADES" : "EN STOCK";
}


// ============================================================================
// FUNCIÓN: tarjetaHTML(p, total)
// Genera el HTML completo de UNA tarjeta de producto.
//
// Parámetros:
//   p     — objeto del producto (viene de products.json)
//   total — cantidad total de resultados visibles (para ajustar el ancho)
//
// Retorna: string con el HTML de la tarjeta lista para insertar en el DOM.
// ============================================================================
function tarjetaHTML(p, total) {
  const tieneDescuento = p.descuento > 0;
  const imgSrc = `/src/assets/games/${p.imagen}`;

  // Elegimos las clases de columna de Bootstrap según cuántos resultados hay.
  // Con 1 o 2 tarjetas usamos columnas más anchas para que no se vean pequeñas.
  // Bootstrap divide la fila en 12 columnas: col-xl-3 = 3/12 = 25% del ancho.
  const col = total === 1
    ? "col-12 col-sm-10 col-md-7 col-lg-5 col-xl-4 mx-auto" // ~33% centrado
    : total === 2
    ? "col-12 col-sm-6 col-lg-5 col-xl-4"                   // ~40% cada una
    : "col-12 col-sm-6 col-lg-4 col-xl-3";                  // 25% (normal)

  return `
    <div class="${col}">
      <article class="product-card h-100">

        <!-- Zona de imagen con badges superpuestos -->
        <div class="product-img-wrap">
          <img
            src="${imgSrc}"
            alt="${p.nombre}"
            class="product-img"
            onerror="this.style.display='none'; this.nextElementSibling.style.display='block'"
          />
          <!-- Emoji de respaldo si la imagen no existe en el servidor -->
          <span class="product-img-placeholder" style="display:none">🎮</span>

          <!-- Badge de descuento (solo aparece si el descuento es > 0) -->
          ${tieneDescuento ? `<span class="badge-descuento">-${p.descuento}%</span>` : ""}

          <!-- Badge de stock: "EN STOCK" o "POCAS UNIDADES" -->
          <span class="badge-stock ${stockClass(p.stockEstado)}">${stockLabel(p.stockEstado)}</span>
        </div>

        <!-- Cuerpo de la tarjeta: texto e información -->
        <div class="product-body">
          <!-- Plataforma y género en la parte superior -->
          <span class="product-platform">${p.plataforma} · ${p.categoria}</span>

          <h2 class="product-name">${p.nombre}</h2>

          <!-- Valoración con corazones (de 1 a 5) -->
          <div class="product-hearts" aria-label="${p.corazones} de 5 corazones">
            ${corazonesHTML(p.corazones)}
          </div>

          <!-- Estado físico del cartucho con color según condición -->
          <span class="product-estado ${estadoClass(p.estado)}">${p.estado}</span>

          <p class="product-desc">${p.descripcion}</p>

          <!-- Precio: si hay descuento, mostramos el precio final y el original tachado -->
          <div class="product-precio-wrap">
            <span class="product-precio">$${p.precio}</span>
            ${tieneDescuento ? `<span class="product-precio-original">$${p.precioOriginal}</span>` : ""}
          </div>

          <!-- Botón de agregar al carrito. data-id guarda el id para identificar
               el producto cuando el usuario haga clic (ver listener más abajo) -->
          <button class="btn-agregar" data-id="${p.id}">
            🛒 AGREGAR AL CARRITO
          </button>
        </div>

      </article>
    </div>`;
}


// ============================================================================
// FUNCIÓN: productosFiltrados()
// Aplica los filtros activos sobre el array completo "productos" y devuelve
// un nuevo array solo con los que coinciden. Luego lo ordena si hay orden.
//
// No modifica el array "productos" original: Array.filter crea uno nuevo.
// ============================================================================
function productosFiltrados() {
  let lista = productos.filter((p) => {
    // Convertimos la búsqueda a minúsculas para comparar sin importar mayúsculas.
    const txt = filtros.busqueda.toLowerCase();

    // Si hay texto de búsqueda y el producto no lo contiene ni en nombre
    // ni en descripción, lo excluimos (return false = no pasa el filtro).
    if (txt && !p.nombre.toLowerCase().includes(txt) && !p.descripcion.toLowerCase().includes(txt)) return false;

    // Si hay filtro de plataforma y el producto no coincide, lo excluimos.
    if (filtros.plataforma && p.plataforma !== filtros.plataforma) return false;

    // Igual para categoría y estado.
    if (filtros.categoria && p.categoria !== filtros.categoria) return false;
    if (filtros.estado    && p.estado    !== filtros.estado)    return false;

    // Si pasó todas las condiciones anteriores, el producto SÍ se incluye.
    return true;
  });

  // Ordenamos la lista resultante según el criterio elegido.
  // Array.sort ordena "in-place" (modifica la lista).
  // La función de comparación (a, b) devuelve negativo, 0 o positivo
  // para determinar el orden relativo de dos elementos.
  switch (filtros.orden) {
    case "precio-asc":  lista.sort((a, b) => a.precio - b.precio);              break; // menor a mayor
    case "precio-desc": lista.sort((a, b) => b.precio - a.precio);              break; // mayor a menor
    case "descuento":   lista.sort((a, b) => b.descuento - a.descuento);        break; // mayor descuento primero
    case "nombre":      lista.sort((a, b) => a.nombre.localeCompare(b.nombre)); break; // A-Z (respeta acentos)
  }

  return lista;
}


// ============================================================================
// FUNCIÓN: renderGrid()
// Actualiza el grid de tarjetas en el HTML con los productos filtrados.
// Si no hay resultados, muestra el mensaje "No se encontraron juegos".
// ============================================================================
function renderGrid() {
  const lista    = productosFiltrados();
  const grid     = document.getElementById("gridProductos");
  const vacio    = document.getElementById("sinResultados");
  const contador = document.getElementById("contadorResultados");

  // Actualizamos el texto "X juegos encontrados" arriba del grid.
  // El operador ternario ajusta la palabra al singular o plural.
  contador.textContent = `${lista.length} juego${lista.length !== 1 ? "s" : ""} encontrado${lista.length !== 1 ? "s" : ""}`;

  if (lista.length === 0) {
    grid.innerHTML = "";                    // limpiamos el grid
    vacio.classList.remove("d-none");       // mostramos el mensaje de "sin resultados"
    return;
  }

  vacio.classList.add("d-none");            // ocultamos el mensaje de vacío

  // Transformamos cada producto en su HTML y los juntamos en el grid.
  // Pasamos lista.length para que tarjetaHTML ajuste el ancho según el total.
  grid.innerHTML = lista.map(p => tarjetaHTML(p, lista.length)).join("");
}


// ============================================================================
// FUNCIÓN: renderTags()
// Muestra los "tags" (etiquetas con ✕) de los filtros activos arriba del grid.
// Al hacer clic en un tag se desactiva ese filtro.
// ============================================================================
function renderTags() {
  const wrap = document.getElementById("filtrosActivos");

  // Construimos un array solo con los filtros que tienen valor (no vacíos).
  const activos = [
    { key: "busqueda",   label: filtros.busqueda   ? `"${filtros.busqueda}"` : "" },
    { key: "plataforma", label: filtros.plataforma },
    { key: "categoria",  label: filtros.categoria  },
    { key: "estado",     label: filtros.estado     },
  ].filter((f) => f.label); // filtramos los que tienen label no vacío

  // Generamos un botón por cada filtro activo.
  wrap.innerHTML = activos
    .map((f) => `<button class="tag-filtro" data-key="${f.key}">${f.label} ✕</button>`)
    .join("");

  // Listener para quitar un filtro al hacer clic en su tag.
  wrap.querySelectorAll(".tag-filtro").forEach((btn) => {
    btn.addEventListener("click", () => {
      const key = btn.dataset.key; // obtenemos qué filtro representa este tag

      // Reseteamos el filtro en el objeto "filtros".
      filtros[key] = "";

      // También limpiamos el valor visual del select/input correspondiente
      // para que el usuario vea que ya no está activo.
      if (key === "busqueda")   document.getElementById("busqueda").value        = "";
      if (key === "plataforma") document.getElementById("filtroPlatforma").value = "";
      if (key === "categoria")  document.getElementById("filtroCategoria").value = "";
      if (key === "estado")     document.getElementById("filtroEstado").value    = "";

      // Actualizamos tags y grid.
      renderTags();
      renderGrid();
    });
  });
}

/**
 * actualizar()
 * Atajo que llama a renderTags y renderGrid juntas.
 * Se usa cuando cambia cualquier filtro (búsqueda, plataforma, etc.)
 * porque ambas vistas deben actualizarse al mismo tiempo.
 */
function actualizar() {
  renderTags();
  renderGrid();
}


// ============================================================================
// FUNCIÓN PRINCIPAL: init()
// Se ejecuta una sola vez cuando carga la página.
// Es "async" porque necesita esperar la respuesta del servidor (fetch).
//
// Pasos:
//   1. Descarga products.json
//   2. Lee filtros de la URL (si vienen de un link externo)
//   3. Conecta todos los listeners de los controles de filtro
//   4. Conecta el botón "Agregar al carrito"
//   5. Renderiza el catálogo inicial
// ============================================================================
async function init() {

  // --------------------------------------------------------------------------
  // PASO 1: Cargar productos desde el archivo JSON
  //
  // fetch() hace una petición HTTP al servidor para obtener el archivo.
  // "await" pausa la ejecución hasta que llegue la respuesta
  // (sin bloquear el navegador, gracias a las Promesas de JavaScript).
  // --------------------------------------------------------------------------
  try {
    const response = await fetch("/src/pages/catalog/products.json");

    // Si el servidor responde con un error (ej: 404 Not Found), lanzamos
    // un error manualmente para que lo capture el catch de abajo.
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    // Convertimos la respuesta JSON a un array de objetos JavaScript.
    productos = await response.json();

  } catch (err) {
    // Si algo falló (sin internet, archivo no existe, JSON malformado, etc.)
    // mostramos un error en pantalla en lugar de dejar la página en blanco.
    console.error("No se pudo cargar products.json:", err);
    document.getElementById("gridProductos").innerHTML =
      `<p class="text-center text-danger" style="font-size:0.5rem">Error al cargar los productos.</p>`;
    return; // salimos de init, no tiene sentido continuar sin productos
  }

  // --------------------------------------------------------------------------
  // PASO 2: Leer filtros desde los parámetros de la URL
  //
  // Si alguien llega al catálogo desde un link como:
  //   catalog.html?plataforma=NES&categoria=RPG
  // queremos pre-aplicar esos filtros automáticamente.
  //
  // URLSearchParams es una clase nativa del navegador que parsea la
  // "query string" (la parte después del ? en la URL).
  // window.location.search devuelve esa parte, ej: "?plataforma=NES"
  // --------------------------------------------------------------------------
  const params = new URLSearchParams(window.location.search);

  // Para cada parámetro posible: si existe en la URL, lo aplicamos
  // tanto al objeto "filtros" como al elemento HTML del select/input.
  if (params.get("plataforma")) {
    filtros.plataforma = params.get("plataforma");
    document.getElementById("filtroPlatforma").value = filtros.plataforma;
  }
  if (params.get("categoria")) {
    filtros.categoria = params.get("categoria");
    document.getElementById("filtroCategoria").value = filtros.categoria;
  }
  if (params.get("estado")) {
    filtros.estado = params.get("estado");
    document.getElementById("filtroEstado").value = filtros.estado;
  }
  if (params.get("q")) {
    filtros.busqueda = params.get("q");
    document.getElementById("busqueda").value = filtros.busqueda;
  }
  if (params.get("orden")) {
    filtros.orden = params.get("orden");
    document.getElementById("filtroOrden").value = filtros.orden;
  }

  // --------------------------------------------------------------------------
  // PASO 3: Conectar los controles de filtro
  //
  // Cada control (input de búsqueda, selects de filtro) tiene un listener
  // que actualiza el objeto "filtros" y re-renderiza el grid.
  // --------------------------------------------------------------------------

  // El evento "input" se dispara con cada tecla que escribe el usuario,
  // para filtrar en tiempo real sin necesidad de presionar Enter.
  document.getElementById("busqueda").addEventListener("input", (e) => {
    filtros.busqueda = e.target.value.trim(); // .trim() elimina espacios al inicio/final
    actualizar();
  });

  // El evento "change" se dispara cuando el usuario selecciona una opción.
  document.getElementById("filtroPlatforma").addEventListener("change", (e) => {
    filtros.plataforma = e.target.value;
    actualizar();
  });
  document.getElementById("filtroCategoria").addEventListener("change", (e) => {
    filtros.categoria = e.target.value;
    actualizar();
  });
  document.getElementById("filtroEstado").addEventListener("change", (e) => {
    filtros.estado = e.target.value;
    actualizar();
  });

  // El orden solo necesita re-dibujar el grid (no los tags de filtros activos).
  document.getElementById("filtroOrden").addEventListener("change", (e) => {
    filtros.orden = e.target.value;
    renderGrid(); // solo renderGrid, no actualizar() completo
  });

  // --------------------------------------------------------------------------
  // Botón "Limpiar filtros" que aparece cuando no hay resultados.
  // Resetea todos los filtros y vuelve a mostrar todos los productos.
  // --------------------------------------------------------------------------
  document.getElementById("sinResultados").addEventListener("click", (e) => {
    // Verificamos que el clic fue en el botón específico (no en el contenedor).
    if (e.target.id !== "btnLimpiarFiltros") return;

    // Vaciamos todas las propiedades del objeto filtros de una vez.
    // Object.keys devuelve ["busqueda", "plataforma", "categoria", "estado", "orden"]
    Object.keys(filtros).forEach((k) => (filtros[k] = ""));

    // Limpiamos también los valores visuales de los controles.
    document.getElementById("busqueda").value        = "";
    document.getElementById("filtroPlatforma").value = "";
    document.getElementById("filtroCategoria").value = "";
    document.getElementById("filtroEstado").value    = "";
    document.getElementById("filtroOrden").value     = "";

    actualizar();
  });

  // --------------------------------------------------------------------------
  // PASO 4: Conectar el botón "Agregar al carrito"
  //
  // IMPORTANTE: usamos delegación de eventos (un solo listener en el padre
  // #gridProductos en lugar de un listener por tarjeta). Esto es necesario
  // porque las tarjetas se recrean con innerHTML cada vez que se filtra,
  // lo que destruiría los listeners individuales.
  // --------------------------------------------------------------------------
  document.getElementById("gridProductos").addEventListener("click", (e) => {
    // ¿El clic fue en un botón .btn-agregar, o dentro de uno?
    const btn = e.target.closest(".btn-agregar");
    if (!btn) return; // no fue en un botón de agregar, ignoramos

    // Buscamos el producto en el array usando el id guardado en data-id.
    // Number() convierte el string del atributo HTML a número.
    const producto = productos.find((p) => p.id === Number(btn.dataset.id));
    if (!producto) return;

    // Llamamos a cart-store para agregar el producto.
    // cart-store maneja el localStorage y el badge automáticamente.
    addItem(producto);

    // Feedback visual: cambiamos el texto del botón por 900ms para confirmar.
    const textoOriginal = btn.innerHTML;
    btn.innerHTML = "✓ AGREGADO";
    btn.disabled = true; // deshabilitamos para evitar doble clic
    setTimeout(() => {
      btn.innerHTML = textoOriginal;
      btn.disabled = false;
    }, 900);
  });

  // --------------------------------------------------------------------------
  // PASO 5: Renderizado inicial
  // Actualizamos el badge con el conteo actual del carrito (por si ya había
  // algo guardado de sesiones anteriores) y mostramos todos los productos.
  // --------------------------------------------------------------------------
  updateBadge();
  actualizar();
}

// Cuando el HTML esté listo, arrancamos init().
document.addEventListener("DOMContentLoaded", init);
