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