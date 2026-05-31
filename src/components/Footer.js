document.addEventListener("DOMContentLoaded", function () {
  const toggles = document.querySelectorAll('.menu-toggle');
  
  toggles.forEach(toggle => {
    toggle.addEventListener('click', function () {
      // Alternamos un atributo para controlar el estado visual de la flecha si es necesario
      const isExpanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', !isExpanded);
    });
  });
});

// Esta función sirve para cargar el Footer en las páginas
document.addEventListener("DOMContentLoaded", () => {
    cargarFooter();
});

function cargarFooter() {
    fetch('../../components/Footer.html')
        .then(response => {
            if (!response.ok) {
                throw new Error("No se pudo cargar el footer");
            }
            return response.text();
        })
        .then(html => {
             document.getElementById('footer-container').innerHTML = html;
        })
        .catch(error => {
            console.error("Error al cargar el componente:", error);
        });
}