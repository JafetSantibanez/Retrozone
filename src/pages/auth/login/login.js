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
  async function autenticarUsuario(credenciales) {
    try {
      const respuesta = await fetch("./users.json");
      if (!respuesta.ok) throw new Error("No se pudo leer la base de datos.");

      const usuarios = await respuesta.json();

      const usuarioEncontrado = usuarios.find(
        (user) =>
          user.email === credenciales.email &&
          user.password === credenciales.password,
      );

      if (usuarioEncontrado) {
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

        window.location.href = "../../../index.html";
      } else {
        // Si no se encuentra en el JSON
        const inputCorreo = document.getElementById("email");
        const inputContrasena = document.getElementById("password");
        const errorGlobal = document.getElementById("loginErrorGlobal");

        if (inputCorreo) inputCorreo.classList.add("is-invalid");
        if (inputContrasena) inputContrasena.classList.add("is-invalid");
        if (errorGlobal) errorGlobal.classList.remove("d-none");
      }
    } catch (error) {
      console.error("Error en el sistema:", error);
    }
  }
});
//navbar
fetch("../../components/Footer.html")
  .then((response) => response.text())
  .then((data) => {
    document.getElementById("footer").innerHTML = data;
  });
