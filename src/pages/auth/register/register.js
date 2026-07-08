document.addEventListener("DOMContentLoaded", () => {
  // API de teléfono
  const inputTelefono = document.querySelector("#phone");
  const iti = window.intlTelInput(inputTelefono, {
    initialCountry: "auto",
    geoIpLookup: (callback) => {
      fetch("https://ipapi.co/json/")
        .then((res) => res.json())
        .then((data) => callback(data.country_code))
        .catch(() => callback("mx"));
    },
    utilsScript:
      "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
  });

  //Contarseñas
  const iconTogglePassword = document.getElementById("togglePassword");
  const inputPassword = document.getElementById("password");
  if (iconTogglePassword && inputPassword) {
    iconTogglePassword.addEventListener("click", () => {
      if (inputPassword.type === "password") {
        inputPassword.type = "text";
        iconTogglePassword.classList.remove("bi-eye-slash");
        iconTogglePassword.classList.add("bi-eye");
      } else {
        inputPassword.type = "password";
        iconTogglePassword.classList.remove("bi-eye");
        iconTogglePassword.classList.add("bi-eye-slash");
      }
      inputPassword.focus();
    });
  }

  const iconToggleConfirm = document.getElementById("toggleConfirmPassword");
  const inputConfirm = document.getElementById("confirmPassword");
  if (iconToggleConfirm && inputConfirm) {
    iconToggleConfirm.addEventListener("click", () => {
      if (inputConfirm.type === "password") {
        inputConfirm.type = "text";
        iconToggleConfirm.classList.remove("bi-eye-slash");
        iconToggleConfirm.classList.add("bi-eye");
      } else {
        inputConfirm.type = "password";
        iconToggleConfirm.classList.remove("bi-eye");
        iconToggleConfirm.classList.add("bi-eye-slash");
      }
      inputConfirm.focus();
    });
  }
  const inputUsername = document.getElementById("username");
  const feedbackUsername = document.getElementById("usernameFeedback");

  if (inputUsername) {
    inputUsername.addEventListener("input", () => {
      validarNombreUsuario();
    });
  }

  //Validación de formulario
  const formulario = document.getElementById("registroForm");

  if (formulario) {
    formulario.addEventListener("submit", (event) => {
      event.preventDefault();

      const inputNombre = document.getElementById("fullName");
      const inputCorreo = document.getElementById("email");
      const inputContrasena = document.getElementById("password");
      const inputConfirmacion = document.getElementById("confirmPassword");

      const nombre = inputNombre.value.trim();
      const correo = inputCorreo.value.trim();
      const contrasena = inputContrasena.value;
      const confirmacion = inputConfirmacion.value;

      let formularioCorrecto = true;

      // Limpieza de estados previos
      [
        inputNombre,
        inputUsername,
        inputCorreo,
        inputTelefono,
        inputContrasena,
        inputConfirmacion,
      ].forEach((input) => {
        if (input) input.classList.remove("is-invalid", "is-valid");
      });

      // Validación: Nombre Completo
      const regexNombre = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
      if (nombre === "" || !regexNombre.test(nombre)) {
        if (inputNombre) inputNombre.classList.add("is-invalid");
        formularioCorrecto = false;
      } else {
        if (inputNombre) inputNombre.classList.add("is-valid");
      }

      // Validación: nombre de usuario
      if (!validarNombreUsuario()) {
        formularioCorrecto = false;
      }

      // Validación: correo electrónico
      const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!regexCorreo.test(correo)) {
        if (inputCorreo) inputCorreo.classList.add("is-invalid");
        formularioCorrecto = false;
      } else {
        if (inputCorreo) inputCorreo.classList.add("is-valid");
      }

      // Validación: teléfono
      if (!iti.isValidNumber()) {
        if (inputTelefono) inputTelefono.classList.add("is-invalid");
        formularioCorrecto = false;
      } else {
        if (inputTelefono) inputTelefono.classList.add("is-valid");
      }

      // Validación: contraseña
      const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
      if (!regexPassword.test(contrasena)) {
        if (inputContrasena) inputContrasena.classList.add("is-invalid");
        formularioCorrecto = false;
      } else {
        if (inputContrasena) inputContrasena.classList.add("is-valid");
      }

      // Validación: confirmación de contraseña
      if (confirmacion === "" || contrasena !== confirmacion) {
        if (inputConfirmacion) inputConfirmacion.classList.add("is-invalid");
        formularioCorrecto = false;
      } else {
        if (inputConfirmacion && regexPassword.test(contrasena)) {
          inputConfirmacion.classList.add("is-valid");
        }
      }

      // Hacer el objeto
      if (formularioCorrecto) {
        const nuevoUsuario = {
          nombreCompleto: document.getElementById("fullName").value.trim(),
          username: document.getElementById("username").value.trim(),
          email: document.getElementById("email").value.trim(),
          telefono: iti.getNumber(),
          password: document.getElementById("password").value,
        };
        enviarDatosAlBackend(nuevoUsuario);
      } else {
        alert("Error de validación en el formulario.");
      }
    });
    // Envío al backend real (Spring Boot).
    // Los nombres de estos campos deben coincidir EXACTO con los que espera
    // el modelo Users.java del backend: fullName, userName, email, phone,
    // password. (No mandamos registrationDate: el servidor la genera solo.)
    function enviarDatosAlBackend(datosUsuario) {
      const url = "http://localhost:8080/api/users";
      const usuarioFormatoJSON = {
        email: datosUsuario.email,
        password: datosUsuario.password,
        userName: datosUsuario.username,
        fullName: datosUsuario.nombreCompleto,
        phone: datosUsuario.telefono,
      };
      fetch(url, {
        method: "POST", // Indicamos que vamos a guardar/crear datos
        headers: {
          "Content-Type": "application/json", // Le avisamos al servidor que le mandamos un JSON
        },
        body: JSON.stringify(usuarioFormatoJSON), // Convertimos el objeto de JS a texto plano JSON
      })
        .then(async (response) => {
          if (response.ok) {
            // alert(`¡Cuenta creada con éxito! ${usuarioFormatoJSON.username}.`);
            //Aquí puedes redireccionar al login si quieres:
            window.location.href = "/src/pages/auth/login/login.html";
          } else if (response.status === 400) {
            // El backend responde 400 con { message: "..." } cuando el email
            // ya está registrado o la contraseña no cumple el formato.
            const cuerpo = await response.json().catch(() => null);
            alert(cuerpo?.message || "Datos de registro inválidos.");
          } else {
            alert("Hubo un error al registrar el usuario en el servidor.");
          }
        })
        .catch((error) => {
          console.error("Error en la conexión con el servidor:", error);
          alert(
            "No se pudo conectar con el servidor. ¿Está encendido el backend (Spring Boot, puerto 8080)?",
          );
        });
    }
  }
  //Apoyo validar username
  function validarNombreUsuario() {
    if (!inputUsername) return false;

    const valor = inputUsername.value.trim();
    const regexSoloLetrasNumeros = /^[a-zA-Z0-9]+$/;

    if (valor === "") {
      if (feedbackUsername)
        feedbackUsername.textContent = "El nombre de usuario es obligatorio.";
      inputUsername.classList.remove("is-valid");
      inputUsername.classList.add("is-invalid");
      return false;
    }

    if (!regexSoloLetrasNumeros.test(valor)) {
      if (feedbackUsername)
        feedbackUsername.textContent = "Solo se permiten letras y números.";
      inputUsername.classList.remove("is-valid");
      inputUsername.classList.add("is-invalid");
      return false;
    }

    // Nota: la verificación de "nombre de usuario ya en uso" se hace del
    // lado del servidor (al enviar el formulario), no aquí. Antes este
    // bloque usaba una variable "usuariosRegistrados" que nunca se
    // declaraba en ningún lado del proyecto — cada vez que se llamaba a
    // esta función (al escribir en el campo, y también al enviar el
    // formulario) lanzaba un ReferenceError sin capturar, lo que rompía
    // el envío del formulario de registro por completo.
    inputUsername.classList.remove("is-invalid");
    inputUsername.classList.add("is-valid");
    return true;
  }
});
//footer
fetch("../../components/Footer.html")
  .then((response) => response.text())
  .then((data) => {
    document.getElementById("footer").innerHTML = data;
  });
