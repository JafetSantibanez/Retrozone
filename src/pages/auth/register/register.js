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

  // Control de visibilidad de contraseñas
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

  // Input de Nombre de Usuario
  const inputUsername = document.getElementById("username");
  const feedbackUsername = document.getElementById("usernameFeedback");

  if (inputUsername) {
    inputUsername.addEventListener("input", () => {
      validarNombreUsuario();
    });
  }

  // Validación de formulario
  const formulario = document.getElementById("registroForm");

  if (formulario) {
    formulario.addEventListener("submit", (event) => {
      event.preventDefault();

      const inputNombre = document.getElementById("fullName");
      const inputCorreo = document.getElementById("email");

      const nombre = inputNombre.value.trim();
      const correo = inputCorreo.value.trim();
      const contrasena = inputPassword.value;
      const confirmacion = inputConfirm.value;

      let formularioCorrecto = true;

      // Limpieza de estados previos
      [
        inputNombre,
        inputUsername,
        inputCorreo,
        inputTelefono,
        inputPassword,
        inputConfirm,
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

      // Validación: Nombre de usuario
      if (!validarNombreUsuario()) {
        formularioCorrecto = false;
      }

      // Validación: Correo electrónico
      const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!regexCorreo.test(correo)) {
        if (inputCorreo) inputCorreo.classList.add("is-invalid");
        formularioCorrecto = false;
      } else {
        if (inputCorreo) inputCorreo.classList.add("is-valid");
      }

      // Validación: Teléfono
      if (!iti.isValidNumber()) {
        if (inputTelefono) inputTelefono.classList.add("is-invalid");
        formularioCorrecto = false;
      } else {
        if (inputTelefono) inputTelefono.classList.add("is-valid");
      }

      // Validación: Contraseña
      const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
      if (!regexPassword.test(contrasena)) {
        if (inputPassword) inputPassword.classList.add("is-invalid");
        formularioCorrecto = false;
      } else {
        if (inputPassword) inputPassword.classList.add("is-valid");
      }

      // Validación: Confirmación de contraseña
      if (confirmacion === "" || contrasena !== confirmacion) {
        if (inputConfirm) inputConfirm.classList.add("is-invalid");
        formularioCorrecto = false;
      } else {
        if (inputConfirm && regexPassword.test(contrasena)) {
          inputConfirm.classList.add("is-valid");
        }
      }

      // Construcción del objeto corregido
      if (formularioCorrecto) {
        const nuevoUsuario = {
          fullName: nombre,
          userName: inputUsername.value.trim(), // Corregida la referencia para evitar 'undefined'
          email: correo,
          phone: iti.getNumber(),
          password: contrasena,
          registrationDate: new Date().toISOString().split("T")[0], // Genera formato AAAA-MM-DD
          address: "Sin dirección especificada", // Evita nulos en la Base de Datos
        };
        enviarDatosAlBackend(nuevoUsuario);
      } else {
        alert("Error de validación en el formulario.");
      }
    });

    // Envío al backend (Spring Boot)
    function enviarDatosAlBackend(usuarioFormatoJSON) {
      const url = "/api/users";

      fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(usuarioFormatoJSON), // Envía el objeto directo sin reconstrucciones innecesarias
      })
        .then(async (response) => {
          if (response.ok) {
            window.location.href = "/src/pages/auth/login/login.html";
          } else if (response.status === 400) {
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

  // Apoyo validar username
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

    inputUsername.classList.remove("is-invalid");
    inputUsername.classList.add("is-valid");
    return true;
  }
});
