// footer-loader.js
document.addEventListener("DOMContentLoaded", function () {
  const footerContainer = document.getElementById("footer-container");

  if (footerContainer) {
    footerContainer.innerHTML = `
      <div class="bg-dark-retro text-white pt-2 font-pixel" style="display: block !important; width: 100% !important;">
        <div class="container-fluid px-0" style="display: block !important; width: 100% !important;"> 
          
          <div class="pixel-border-top mb-4" style="display: block !important; width: 100% !important; clear: both !important;"></div>

          <div class="container" style="display: block !important; width: 100% !important; clear: both !important;">
            <div class="row pb-3 g-3">
              
              <div class="col-12 col-md-3 border-bottom border-secondary border-md-0 py-2 py-md-0">
                <button class="d-flex justify-content-between align-items-center w-100 bg-transparent border-0 text-white p-0 d-md-block text-md-start" 
                        data-bs-toggle="collapse" data-bs-target="#collapseDatos" aria-expanded="false" aria-controls="collapseDatos">
                  <h5 class="footer-title mb-0 mb-md-3">Protección de Datos</h5>
                  <i class="bi bi-chevron-down d-md-none arrow-icon"></i>
                </button>         
                <div id="collapseDatos" class="collapse d-md-block">
                  <ul class="list-unstyled footer-links ms-2 ms-md-0 mt-2 mt-md-0">
                    <li><a href="terminos.html" class="text-decoration-none text-white-50">Términos y Condiciones</a></li>
                    <li><a href="privacidad.html" class="text-decoration-none text-white-50">Aviso de Privacidad de Clientes</a></li>
                  </ul>
                </div>
              </div>       

              <div class="col-12 col-md-3 border-bottom border-secondary border-md-0 py-2 py-md-0">
                <button class="d-flex justify-content-between align-items-center w-100 bg-transparent border-0 text-white p-0 d-md-block text-md-start" 
                        data-bs-toggle="collapse" data-bs-target="#collapseInfo" aria-expanded="false" aria-controls="collapseInfo">
                  <h5 class="footer-title mb-0 mb-md-3">Información</h5>
                  <i class="bi bi-chevron-down d-md-none arrow-icon"></i>
                </button>
                <div id="collapseInfo" class="collapse d-md-block">
                  <ul class="list-unstyled footer-links ms-2 ms-md-0 mt-2 mt-md-0">
                    <li><a href="/src/pages/aboutus/aboutus.html" class="text-decoration-none text-white-50">Nosotros</a></li>
                    <li><a href="/src/pages/contact/contact.html" class="text-decoration-none text-white-50">Contacto</a></li>
                  </ul>
                <div class="social-icons ms-2 ms-md-0 my-2">
                  <a href="#" class="text-white me-2"><i class="bi bi-twitter-x" style="font-family: 'bootstrap-icons' !important;"></i></a>
                  <a href="#" class="text-white me-2"><i class="bi bi-instagram" style="font-family: 'bootstrap-icons' !important;"></i></a>
                  <a href="#" class="text-white me-2"><i class="bi bi-facebook" style="font-family: 'bootstrap-icons' !important;"></i></a>
                </div>
                </div>
              </div>

              <div class="col-12 col-md-3 border-bottom border-secondary border-md-0 py-2 py-md-0">
                <button class="d-flex justify-content-between align-items-center w-100 bg-transparent border-0 text-white p-0 d-md-block text-md-start" 
                        data-bs-toggle="collapse" data-bs-target="#collapseProducts" aria-expanded="false" aria-controls="collapseProducts">
                  <h5 class="footer-title mb-0 mb-md-3">Juegos</h5>
                  <i class="bi bi-chevron-down d-md-none arrow-icon"></i>
                </button>
                <div id="collapseProducts" class="collapse d-md-block">
                  <ul class="list-unstyled footer-links ms-2 ms-md-0 mt-2 mt-md-0">
                    <li><a href="categorias.html" class="text-decoration-none text-white-50">Estado</a></li>
                    <li><a href="juegos.html" class="text-decoration-none text-white-50">Genero</a></li>
                    <li><a href="consolas.html" class="text-decoration-none text-white-50">Consolas</a></li>
                  </ul>
                </div>
              </div>

              <div class="col-12 col-md-3 py-2 py-md-0">
                <button class="d-flex justify-content-between align-items-center w-100 bg-transparent border-0 text-white p-0 d-md-block text-md-start" 
                        data-bs-toggle="collapse" data-bs-target="#collapseCuenta" aria-expanded="false" aria-controls="collapseCuenta">
                  <h5 class="footer-title mb-0 mb-md-3">Mi Cuenta</h5>
                  <i class="bi bi-chevron-down d-md-none arrow-icon"></i>
                </button>
                <div id="collapseCuenta" class="collapse d-md-block">
                  <ul class="list-unstyled footer-links ms-2 ms-md-0 mt-2 mt-md-0">
                    <li><a href="perfil.html" class="text-decoration-none text-white-50">Perfil</a></li>
                    <li><a href="carrito.html" class="text-decoration-none text-white-50">Carrito</a></li>
                  </ul>
                </div>
              </div>

            </div>
          </div>

          <div style="display: block !important; width: 100% !important; clear: both !important; margin-top: 0px !important;">
            <div class="pixel-border-bottom"></div>
            <div class="bg-green-retro text-white copyright-text py-2 text-center" style="display: block !important; width: 100% !important;">
              © 2026 RetroZone. Todos los Derechos Reservados.
            </div>
          </div>

        </div>
      </div>
    `;

    // Re-inicializar el colapsable de Bootstrap dinámicamente si es necesario
    if (window.bootstrap && window.bootstrap.Collapse) {
      const collapseElementList = footerContainer.querySelectorAll('.collapse');
      collapseElementList.forEach(collapseEl => {
        // En pantallas grandes (md) evitamos que Bootstrap oculte el menú al hacer resize
        if (window.innerWidth >= 768) {
          collapseEl.classList.add('show');
        }
      });
    }
  }
});