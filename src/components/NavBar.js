// manda a llamar al Navdar desde el html

import navHtml from "./NavBar.html?raw";
import "../styles/global.css";

export function renderNavBar() {
  return navHtml;
}
