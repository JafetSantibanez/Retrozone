// Importa utilidades
import { updateBadge } from "../../utils/cart-store.js";

// NOTA: "NavBar.html?raw" e "import ...css" son transformaciones de Vite —
// solo funcionan cuando el proyecto corre a través del dev server de Vite.
// Con Live Server (sirve archivos tal cual, sin transformar nada), el
// navegador intenta interpretar esos archivos como JavaScript y falla,
// lo que rompe este script completo y por eso no aparece el navbar.
// Usamos fetch() en su lugar, que funciona igual en ambos casos.
// (global.css ya se carga aparte con un <link> en cada página, así que no
// hace falta importarlo aquí.)
export async function renderNavBar() {
	const navbarContainer = document.getElementById("navbar");
	if (!navbarContainer) return;

	const res = await fetch("/src/components/navbar/NavBar.html");
	const navHtml = await res.text();
	navbarContainer.innerHTML = navHtml;

	// Actualiza el botón de sesión
	actualizarBotonAuth();

	// Configura menú hamburguesa
	configurarMenuHamburguesa();

	// Actualiza el contador del carrito
	if (typeof updateBadge === "function") {
		updateBadge();
	}
}

// Iniciar sesión
function actualizarBotonAuth() {
	const dropdownToggle = document.querySelector(".boton-sesion-toggle");
	const dropdownMenu = document.getElementById("menu-sesion-desplegable");

	const usuarioLogueado =
		localStorage.getItem("usuarioLogueado") ||
		sessionStorage.getItem("usuarioLogueado");

	if (!dropdownToggle || !dropdownMenu) return;

	if (usuarioLogueado) {
		dropdownToggle.textContent = "Mi Cuenta";
		dropdownMenu.innerHTML = `
            <li><a class="dropdown-item text-white" href="/src/pages/profile/profile.html">Ver Perfil</a></li>
            <li><button class="dropdown-item text-white" onclick="cerrarSesion()" style="background:none; border:none; width:100%; text-align:left;">Cerrar Sesión</button></li>
        `;
	} else {
		dropdownToggle.textContent = "Usuario";
		dropdownMenu.innerHTML = `
            <li><a class="dropdown-item text-white" href="/src/pages/auth/login/login.html">Iniciar Sesión</a></li>
            <li><a class="dropdown-item text-white" href="/src/pages/auth/register/register.html">Registrarse</a></li>
        `;
	}
}

// Cierre de sesión
window.cerrarSesion = function () {
	localStorage.removeItem("usuarioLogueado");
	sessionStorage.removeItem("usuarioLogueado");
	window.location.href = "/index.html";
};

function configurarMenuHamburguesa() {}

// Renderizar cuando cargue el DOM
document.addEventListener("DOMContentLoaded", () => {
	renderNavBar();
});
