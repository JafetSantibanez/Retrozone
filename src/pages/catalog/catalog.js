import { addItem, updateBadge } from "../../utils/cart-store.js";

// ── Estado de filtros ──────────────────────────────────────────────────────────
const filtros = { busqueda: "", plataforma: "", categoria: "", estado: "", orden: "" };
let productos = [];

// ── Helpers ────────────────────────────────────────────────────────────────────
function corazonesHTML(n) {
  let html = "";
  for (let i = 1; i <= 5; i++) {
    html += `<span class="${i <= n ? "heart-full" : "heart-empty"}">♥</span>`;
  }
  return html;
}

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

function stockClass(stock) {
  return stock === "pocas unidades" ? "pocas" : "enstock";
}

function stockLabel(stock) {
  return stock === "pocas unidades" ? "POCAS UNIDADES" : "EN STOCK";
}

// ── Render de una tarjeta ──────────────────────────────────────────────────────
function tarjetaHTML(p, total) {
  const tieneDescuento = p.descuento > 0;
  const imgSrc = `/src/assets/games/${p.imagen}`;
  const col = total === 1
    ? "col-12 col-sm-10 col-md-7 col-lg-5 col-xl-4 mx-auto"
    : total === 2
    ? "col-12 col-sm-6 col-lg-5 col-xl-4"
    : "col-12 col-sm-6 col-lg-4 col-xl-3";

  return `
    <div class="${col}">
      <article class="product-card h-100">

        <div class="product-img-wrap">
          <img
            src="${imgSrc}"
            alt="${p.nombre}"
            class="product-img"
            onerror="this.style.display='none'; this.nextElementSibling.style.display='block'"
          />
          <span class="product-img-placeholder" style="display:none">🎮</span>

          ${tieneDescuento ? `<span class="badge-descuento">-${p.descuento}%</span>` : ""}
          <span class="badge-stock ${stockClass(p.stockEstado)}">${stockLabel(p.stockEstado)}</span>
        </div>

        <div class="product-body">
          <span class="product-platform">${p.plataforma} · ${p.categoria}</span>
          <h2 class="product-name">${p.nombre}</h2>

          <div class="product-hearts" aria-label="${p.corazones} de 5 corazones">
            ${corazonesHTML(p.corazones)}
          </div>

          <span class="product-estado ${estadoClass(p.estado)}">${p.estado}</span>
          <p class="product-desc">${p.descripcion}</p>

          <div class="product-precio-wrap">
            <span class="product-precio">$${p.precio}</span>
            ${tieneDescuento ? `<span class="product-precio-original">$${p.precioOriginal}</span>` : ""}
          </div>

          <button class="btn-agregar" data-id="${p.id}">
            🛒 AGREGAR AL CARRITO
          </button>
        </div>

      </article>
    </div>`;
}

// ── Aplicar filtros y orden ────────────────────────────────────────────────────
function productosFiltrados() {
  let lista = productos.filter((p) => {
    const txt = filtros.busqueda.toLowerCase();
    if (txt && !p.nombre.toLowerCase().includes(txt) && !p.descripcion.toLowerCase().includes(txt)) return false;
    if (filtros.plataforma && p.plataforma !== filtros.plataforma) return false;
    if (filtros.categoria  && p.categoria  !== filtros.categoria)  return false;
    if (filtros.estado     && p.estado     !== filtros.estado)     return false;
    return true;
  });

  switch (filtros.orden) {
    case "precio-asc":  lista.sort((a, b) => a.precio - b.precio);              break;
    case "precio-desc": lista.sort((a, b) => b.precio - a.precio);              break;
    case "descuento":   lista.sort((a, b) => b.descuento - a.descuento);        break;
    case "nombre":      lista.sort((a, b) => a.nombre.localeCompare(b.nombre)); break;
  }

  return lista;
}

// ── Renderizar grid ────────────────────────────────────────────────────────────
function renderGrid() {
  const lista    = productosFiltrados();
  const grid     = document.getElementById("gridProductos");
  const vacio    = document.getElementById("sinResultados");
  const contador = document.getElementById("contadorResultados");

  contador.textContent = `${lista.length} juego${lista.length !== 1 ? "s" : ""} encontrado${lista.length !== 1 ? "s" : ""}`;

  if (lista.length === 0) {
    grid.innerHTML = "";
    vacio.classList.remove("d-none");
    return;
  }

  vacio.classList.add("d-none");
  grid.innerHTML = lista.map(p => tarjetaHTML(p, lista.length)).join("");
}

// ── Tags de filtros activos ────────────────────────────────────────────────────
function renderTags() {
  const wrap = document.getElementById("filtrosActivos");
  const activos = [
    { key: "busqueda",   label: filtros.busqueda   ? `"${filtros.busqueda}"` : "" },
    { key: "plataforma", label: filtros.plataforma },
    { key: "categoria",  label: filtros.categoria  },
    { key: "estado",     label: filtros.estado     },
  ].filter((f) => f.label);

  wrap.innerHTML = activos
    .map((f) => `<button class="tag-filtro" data-key="${f.key}">${f.label} ✕</button>`)
    .join("");

  wrap.querySelectorAll(".tag-filtro").forEach((btn) => {
    btn.addEventListener("click", () => {
      const key = btn.dataset.key;
      filtros[key] = "";
      if (key === "busqueda")   document.getElementById("busqueda").value        = "";
      if (key === "plataforma") document.getElementById("filtroPlatforma").value = "";
      if (key === "categoria")  document.getElementById("filtroCategoria").value = "";
      if (key === "estado")     document.getElementById("filtroEstado").value    = "";
      renderTags();
      renderGrid();
    });
  });
}

function actualizar() {
  renderTags();
  renderGrid();
}

// ── Cargar JSON e inicializar ──────────────────────────────────────────────────
async function init() {
  try {
    const response = await fetch("/src/pages/catalog/products.json");
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    productos = await response.json();
  } catch (err) {
    console.error("No se pudo cargar products.json:", err);
    document.getElementById("gridProductos").innerHTML =
      `<p class="text-center text-danger" style="font-size:0.5rem">Error al cargar los productos.</p>`;
    return;
  }

  // ── Pre-aplicar filtros desde URL params (?plataforma=NES&categoria=RPG etc.) ──
  const params = new URLSearchParams(window.location.search);
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

  // Filtros
  document.getElementById("busqueda").addEventListener("input", (e) => {
    filtros.busqueda = e.target.value.trim();
    actualizar();
  });
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
  document.getElementById("filtroOrden").addEventListener("change", (e) => {
    filtros.orden = e.target.value;
    renderGrid();
  });

  // Limpiar filtros desde estado "sin resultados"
  document.getElementById("sinResultados").addEventListener("click", (e) => {
    if (e.target.id !== "btnLimpiarFiltros") return;
    Object.keys(filtros).forEach((k) => (filtros[k] = ""));
    document.getElementById("busqueda").value        = "";
    document.getElementById("filtroPlatforma").value = "";
    document.getElementById("filtroCategoria").value = "";
    document.getElementById("filtroEstado").value    = "";
    document.getElementById("filtroOrden").value     = "";
    actualizar();
  });

  // Agregar al carrito
  document.getElementById("gridProductos").addEventListener("click", (e) => {
    const btn = e.target.closest(".btn-agregar");
    if (!btn) return;
    const producto = productos.find((p) => p.id === Number(btn.dataset.id));
    if (!producto) return;

    addItem(producto);

    // Feedback visual: el botón confirma brevemente
    const textoOriginal = btn.innerHTML;
    btn.innerHTML = "✓ AGREGADO";
    btn.disabled = true;
    setTimeout(() => {
      btn.innerHTML = textoOriginal;
      btn.disabled = false;
    }, 900);
  });

  updateBadge();
  actualizar();
}

document.addEventListener("DOMContentLoaded", init);
