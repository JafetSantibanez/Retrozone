import "../styles/global.css";

export function renderNavBar() {
  return `

<body>
 <nav class="navbar navbar-expand-lg mi-navbar-retro">
  <div class="container-fluid">
    
    <a class="navbar-brand logo-pixel" href="#">R</a>

    <div class="navbar-nav enlaces-retro">
      <a class="nav-link boton-pixel" href="#">Inicio</a>
      <a class="nav-link boton-pixel" href="#">Juegos 3</a>
      <a class="nav-link boton-pixel" href="#">Consolas</a>
      <a class="nav-link boton-pixel" href="#">Perfil</a>
    </div>

    <div class="derecha-navbar">
      
      <div class="carrito-retro"></div>

      <form class="d-flex gap-2" role="search">
        <input class="form-control buscador-retro input-busqueda" type="search" placeholder="Buscar">
        <button class="btn boton-pixel buscador-retro" type="submit">
          Buscar
        </button>
      </form>

    </div>

  </div>
</nav>


      

  
  <script src="../styles/global.css"></script>
  <script
    src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.8/dist/umd/popper.min.js"
    integrity="sha384-I7E8VVD/ismYTF4hNIPjVp/Zjvgyol6VFvRkX/vR+Vc4jQkC+hVqc2pM8ODewa9r"
    crossorigin="anonymous"
  ></script>
  <script
    src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.min.js"
    integrity="sha384-G/EV+4j2dNv+tEPo3++6LCgdCROaejBqfUeNjuKAiuXbjrxilcCdDz6ZAVfHWe1Y"
    crossorigin="anonymous"
  ></script>
</body>;
`;
}
