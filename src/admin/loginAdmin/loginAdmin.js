document.addEventListener("DOMContentLoaded", () => {
  const formularioLogin = document.getElementById("adminForm");
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
        const credencialesAdmin = {
          email: correo,
          password: contrasena,
        };

        autenticarAdmin(credencialesAdmin);
      }
    });
  }
  //Autenticación
  async function autenticarAdmin(credenciales) {
    try {
      const respuesta = await fetch("http://localhost:3000/admins");
      if (!respuesta.ok) throw new Error("No se pudo leer la base de datos.");

      const admins = await respuesta.json();

      const adminEncontrado = admins.find(
        (admin) =>
          admin.email === credenciales.email &&
          admin.password === credenciales.password,
      );

      if (adminEncontrado) {
        sessionStorage.setItem(
          "adminLogueado",
          JSON.stringify(adminEncontrado),
        );

        window.location.href = "/index.html";
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
// El footer de esta página lo carga /src/components/footer/Footer.js
// (referenciado directo en loginAdmin.html) — construye el HTML del footer
// él mismo, sin fetch. Este bloque quedó duplicado y apuntaba a una ruta
// que no existe ("../../components/Footer.html").
