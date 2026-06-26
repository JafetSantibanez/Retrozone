import { updateBadge } from "../../utils/cart-store.js";

export async function renderNavBar() {
  const navbarContainer = document.getElementById("navbar");
  if (!navbarContainer) return;

  const res = await fetch("/src/components/navbar/NavBar.html");
  const navHtml = await res.text();
  navbarContainer.innerHTML = navHtml;

  // Aquí llamamos a la función que verifica el login
  actualizarBotonAuth();
  configurarMenuHamburguesa();

  // Sincroniza el contador del carrito con lo guardado en localStorage
  updateBadge();
  // Si el carrito cambia (en esta u otra pestaña), refresca el badge
  document.addEventListener("cart:updated", updateBadge);
}

//iniciar sesion
function actualizarBotonAuth() {
  const dropdownToggle = document.querySelector(".boton-sesion-toggle");
  const dropdownMenu = document.getElementById("menu-sesion-desplegable");

  const usuarioLogueado =
    localStorage.getItem("usuarioLogueado") ||
    sessionStorage.getItem("usuarioLogueado");

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
//cierre de sesion
window.cerrarSesion = function () {
  localStorage.removeItem("usuarioLogueado");
  sessionStorage.removeItem("usuarioLogueado");
  // Al recargar, la Navbar volverá a ejecutar la lógica y mostrará "Iniciar Sesión"
  window.location.href = "/index.html";
};
function configurarMenuHamburguesa() {}

document.addEventListener("DOMContentLoaded", () => {
  renderNavBar();
});
