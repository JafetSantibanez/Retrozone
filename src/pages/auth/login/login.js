document.addEventListener("DOMContentLoaded", () => {
  const formularioLogin = document.getElementById("loginForm");
  const inputContrasena = document.getElementById("password");
  const togglePassword = document.getElementById("togglePassword");

  // Control de visibilidad de contraseña
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

  // Submit del formulario
  if (formularioLogin) {
    formularioLogin.addEventListener("submit", (event) => {
      event.preventDefault();

      const inputCorreo = document.getElementById("email");
      const inputContrasenaSubmit = document.getElementById("password");

      const correo = inputCorreo ? inputCorreo.value.trim() : "";
      const contrasena = inputContrasenaSubmit
        ? inputContrasenaSubmit.value
        : "";

      let formularioCorrecto = true;

      [inputCorreo, inputContrasenaSubmit].forEach((input) => {
        if (input) input.classList.remove("is-invalid");
      });

      const errorGlobal = document.getElementById("loginErrorGlobal");
      if (errorGlobal) errorGlobal.classList.add("d-none");

      // Validar formato del Correo y contraseña no vacía
      const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!regexCorreo.test(correo) || contrasena === "") {
        if (inputCorreo) inputCorreo.classList.add("is-invalid");
        if (inputContrasenaSubmit)
          inputContrasenaSubmit.classList.add("is-invalid");
        if (errorGlobal) errorGlobal.classList.remove("d-none");
        formularioCorrecto = false;
      }

      // Verificar el JSON y autenticar
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

  // Autenticación con el Backend
  async function autenticarUsuario(credenciales) {
    try {
      const respuesta = await fetch("/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: credenciales.email,
          password: credenciales.password,
        }),
      });

      if (respuesta.ok) {
        // 🛠️ CORRECCIÓN: Leemos la respuesta como texto plano para evitar el SyntaxError
        const mensajeServidor = await respuesta.text();

        // Creamos un objeto de sesión básico con el correo ya que el backend devuelve un String
        const datosSesion = {
          email: credenciales.email,
          status: mensajeServidor,
        };

        if (credenciales.recordarme) {
          localStorage.setItem("usuarioLogueado", JSON.stringify(datosSesion));
        } else {
          sessionStorage.setItem(
            "usuarioLogueado",
            JSON.stringify(datosSesion),
          );
        }

        // Redirección exitosa a la página principal de Retrozone
        window.location.href = "/index.html";
      } else {
        // Manejo de credenciales incorrectas (401 u otros errores de validación)
        const inputCorreo = document.getElementById("email");
        const inputContrasenaLocal = document.getElementById("password");
        const errorGlobal = document.getElementById("loginErrorGlobal");

        if (inputCorreo) inputCorreo.classList.add("is-invalid");
        if (inputContrasenaLocal)
          inputContrasenaLocal.classList.add("is-invalid");
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
