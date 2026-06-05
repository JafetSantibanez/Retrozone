// Importa el HTML del Navbar
import navHtml from "./NavBar.html?raw";

// Importa estilos globales
import "../../styles/global.css";

/**
 * Devuelve el HTML del Navbar
 */
export function renderNavBar() {
	return navHtml;
}

/**
 * Inserta el Navbar en el contenedor #navbar
 */
function inicializarNavbar() {
	const navbarContainer = document.getElementById("navbar");

	if (!navbarContainer) {
		console.warn("No se encontró el contenedor #navbar");
		return;
	}

	navbarContainer.innerHTML = navHtml;

	configurarMenuHamburguesa();
}

/**
 * Configura el botón hamburguesa
 */
function configurarMenuHamburguesa() {
	const botonMenu = document.getElementById("boton-menu");
	const menuDesplegable = document.getElementById("menu-desplegable");

	if (!botonMenu || !menuDesplegable) {
		console.warn("No se encontraron elementos del menú hamburguesa");
		return;
	}

	botonMenu.addEventListener("click", () => {
		menuDesplegable.classList.toggle("mostrar-menu-retro");

		// Efecto visual del botón
		botonMenu.style.transform = "scale(0.95)";

		setTimeout(() => {
			botonMenu.style.transform = "scale(1)";
		}, 100);
	});
}

/**
 * Espera a que cargue el DOM
 */
document.addEventListener("DOMContentLoaded", () => {
	inicializarNavbar();
});
