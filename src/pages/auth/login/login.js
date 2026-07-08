document.addEventListener("DOMContentLoaded", () => {
  const formularioLogin = document.getElementById("loginForm");
  const inputContrasena = document.getElementById("password");
  const togglePassword = document.getElementById("togglePassword");

  // imput hasheo
  if (togglePassword && inputContrasena) {
    togglePassword.addEventListener("click", () => {
      const type =
        inputContrasena.getAttribute("type") === "password"
          ? "text"
          : "password";
      inputContrasena.setAttribute("type", type);
      togglePassword.classList.toggle("bi-eye");
      togglePassword.classList.toggle("bi-eye-slash");
    });
  }

  // submit
  if (formularioLogin) {
    formularioLogin.addEventListener("submit", (event) => {
      event.preventDefault();

      const inputCorreo = document.getElementById("email");
      const inputContrasena = document.getElementById("password");

      const correo = inputCorreo ? inputCorreo.value.trim() : "";
      const contrasena = inputContrasena ? inputContrasena.value : "";

      let formularioCorrecto = true;

      [inputCorreo, inputContrasena].forEach((input) => {
        if (input) input.classList.remove("is-invalid");
      });

      const errorGlobal = document.getElementById("loginErrorGlobal");
      if (errorGlobal) errorGlobal.classList.add("d-none");

      // Validar formato del Correo
      const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!regexCorreo.test(correo) || contrasena === "") {
        if (inputCorreo) inputCorreo.classList.add("is-invalid");
        if (inputContrasena) inputContrasena.classList.add("is-invalid");
        if (errorGlobal) errorGlobal.classList.remove("d-none");
        formularioCorrecto = false;
      }
      //verificar el JSON
      if (formularioCorrecto) {
        const credencialesUsuario = {
          email: correo,
          password: contrasena,
          recordarme: document.getElementById("rememberMe")?.checked || false,
        };

        autenticarUsuario(credencialesUsuario);
      }
    });
  }
  //Autenticación
  // Antes esto traía TODA la lista de usuarios (GET /users) y comparaba
  // email+password en el navegador — además de inseguro (cualquiera podía
  // ver la lista completa de usuarios y contraseñas), dependía de
  // json-server, que nunca estuvo instalado. Ahora se manda solo el email
  // y password al backend real, que hace la verificación con BCrypt del
  // lado del servidor y responde 200 (con los datos del usuario) o 401.
  async function autenticarUsuario(credenciales) {
    try {
      const respuesta = await fetch("http://localhost:8080/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: credenciales.email,
          password: credenciales.password,
        }),
      });

      if (respuesta.ok) {
        const usuarioEncontrado = await respuesta.json();

        if (credenciales.recordarme) {
          localStorage.setItem(
            "usuarioLogueado",
            JSON.stringify(usuarioEncontrado),
          );
        } else {
          sessionStorage.setItem(
            "usuarioLogueado",
            JSON.stringify(usuarioEncontrado),
          );
        }

        window.location.href = "/index.html";
      } else {
        // 401: credenciales incorrectas
        const inputCorreo = document.getElementById("email");
        const inputContrasena = document.getElementById("password");
        const errorGlobal = document.getElementById("loginErrorGlobal");

        if (inputCorreo) inputCorreo.classList.add("is-invalid");
        if (inputContrasena) inputContrasena.classList.add("is-invalid");
        if (errorGlobal) errorGlobal.classList.remove("d-none");
      }
    } catch (error) {
      console.error("Error en el sistema:", error);
      alert(
        "No se pudo conectar con el servidor. ¿Está encendido el backend (Spring Boot, puerto 8080)?",
      );
    }
  }
});
//footer
fetch("../../components/Footer.html")
  .then((response) => response.text())
  .then((data) => {
    const contenedorFooter = document.getElementById("footer");
    // Solo intenta meter el HTML si el contenedor realmente existe en la página
    if (contenedorFooter) {
      contenedorFooter.innerHTML = data;
    }
    //fetch("/src/components/footer/footer.html")
    // .then((response) => response.text())
    //.then((data) => {
    // document.getElementById("footer").innerHTML = data;
  });
