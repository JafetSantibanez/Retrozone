document.addEventListener("DOMContentLoaded", function () {
  const toggles = document.querySelectorAll('.menu-toggle');
  toggles.forEach(toggle => {
    toggle.addEventListener('click', function () {
      const isExpanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', !isExpanded);
    });
  });
});

document.addEventListener("DOMContentLoaded", () => {
  cargarFooter();
});

function cargarFooter() {
  fetch('../../components/footer/Footer.html')
    .then(response => {
      if (!response.ok) throw new Error("No se pudo cargar el footer");
      return response.text();
    })
    .then(html => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      const footer = doc.querySelector("footer");
      if (footer) {
        document.getElementById('footer-container').innerHTML = footer.outerHTML;
      } else {
        document.getElementById('footer-container').innerHTML = html;
      }
    })
    .catch(error => console.error("Error al cargar el footer:", error));
}