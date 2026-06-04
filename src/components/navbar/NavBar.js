// Importación del HTML 
import navHtml from "./NavBar.html?raw";
import "../../styles/global.css";

// Función para renderizar
export function renderNavBar() {
  return navHtml;
}

// Al ser un módulo, esto se ejecuta de forma segura
const navbarContainer = document.getElementById('navbar');
if (navbarContainer) {
  navbarContainer.innerHTML = navHtml;
  // Inicialización del menu de hamburguesa
  configurarMenuHamburguesa();
}

function configurarMenuHamburguesa() {
  const botonMenu = document.getElementById("boton-menu");
  const menuDesplegable = document.getElementById("menu-desplegable");

  // Verificación de que se encuentren los elementos 
  if (botonMenu && menuDesplegable) {
    botonMenu.addEventListener("click", () => {
            menuDesplegable.classList.toggle("mostrar-menu-retro");
      // Feedback visual recomendada por documentación
      botonMenu.style.transform = "scale(0.95)";
      setTimeout(() => {
        botonMenu.style.transform = "scale(1)";
      }, 100);
    });
  }
}