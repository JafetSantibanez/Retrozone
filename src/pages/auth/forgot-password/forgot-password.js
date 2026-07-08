// manda a llamamar html

document.addEventListener("DOMContentLoaded", () => {
  const formularioLogin = document.getElementById("loginForm");
  // valida ingreso de credenciales
  if (formularioLogin) {
    formularioLogin.addEventListener("submit", (event) => {
      event.preventDefault();

      //almacena informacion para validarla
      const inputCorreo = document.getElementById("email");
      const inputContrasena = document.getElementById("password");

      const correo = inputCorreo.value.trim();
      const contrasena = inputContrasena.value;

      // valida y limpia para escribir d enuevo
      let formularioCorrecto = true;

      [inputCorreo, inputContrasena].forEach((input) => {
        if (input) input.classList.remove("is-invalid", "is-valid");
      });
      // valida correo
      const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!regexCorreo.test(correo)) {
        if (inputCorreo) inputCorreo.classList.add("is-invalid");
        formularioCorrecto = false;
      } else {
        if (inputCorreo) inputCorreo.classList.add("is-valid");
      }
      // calida contraseña
      const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
      if (!regexPassword.test(contrasena)) {
        if (inputContrasena) inputContrasena.classList.add("is-invalid");
        formularioCorrecto = false;
      } else {
        if (inputContrasena) inputContrasena.classList.add("is-valid");
      }
      // envia si esta correcto
      if (formularioCorrecto) {
        const credencialesUsuario = {
          email: correo,
          password: contrasena,
          recordarme: document.getElementById("rememberMe")?.checked || false, // Por si añades el checkbox de "Recordarme"
        };

        autenticarUsuario(credencialesUsuario);
      } else {
        alert("Por favor, verifica que los campos tengan el formato correcto.");
      }
    });

    // envio a back
    function autenticarUsuario(credenciales) {
      console.log("Listo para autenticar en el backend:", credenciales);
      // Aquí irá tu fetch() hacia la API de inicio de sesión en el futuro
    }
  }
});

// NOTA: forgot-password.html todavía es una página placeholder (sin navbar,
// sin #footer-container, sin estilos) — le falta maquetación real antes de
// que tenga sentido cargarle un footer. Este bloque apuntaba a una ruta que
// no existe ("../../components/Footer.html") y a un elemento #footer que
// tampoco existe en la página.
