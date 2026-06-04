import { renderNavBar } from "./components/navbar/NavBar.js";

// Selecciona el contenedor <div id="app"></div> de tu index.html
const app = document.querySelector("#app");

// Ejecuta la función e inyecta el HTML del navbar adentro
app.innerHTML = renderNavBar();