document.addEventListener("DOMContentLoaded", () => {
	cargarNavbar();
});

function cargarNavbar() {
	fetch("../../components/navbar/NavBar.html")
		.then((response) => {
			if (!response.ok) {
				throw new Error("No se pudo cargar el navbar");
			}
			return response.text();
		})
		.then((html) => {
			document.getElementById("navbar").innerHTML = html;
			configurarMenuHamburguesa();
		})
		.catch((error) => {
			console.error("Error cargando navbar:", error);
		});
}

function configurarMenuHamburguesa() {
	const botonMenu = document.getElementById("boton-menu");
	const menuDesplegable = document.getElementById("menu-desplegable");

	if (botonMenu && menuDesplegable) {
		botonMenu.addEventListener("click", () => {
			menuDesplegable.classList.toggle("mostrar-menu-retro");
		});
	}
}
