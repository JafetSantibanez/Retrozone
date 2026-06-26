document.addEventListener("DOMContentLoaded", () => {
  //
  const buttons = document.querySelectorAll(".list-group-item");
  const sections = {
    pedidos: document.getElementById("pedidosSection"),
    perfil: document.getElementById("section-perfil"),
    seguridad: document.getElementById("section-seguridad"),
    direcciones: document.getElementById("section-directions"),
  };

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      buttons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");
      Object.values(sections).forEach((sec) => sec.classList.add("d-none"));
      sections[button.getAttribute("data-section")].classList.remove("d-none");
    });
  });

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

  const setupPasswordToggle = (iconId, inputId) => {
    const icon = document.getElementById(iconId);
    const input = document.getElementById(inputId);
    if (icon && input) {
      icon.addEventListener("click", () => {
        const type = input.type === "password" ? "text" : "password";
        input.type = type;
        icon.classList.toggle("bi-eye");
        icon.classList.toggle("bi-eye-slash");
      });
    }
  };
  setupPasswordToggle("toggleCurrentPassword", "currentPassword");
  setupPasswordToggle("toggleNewPassword", "newPassword");
  setupPasswordToggle("toggleConfirmNewPassword", "confirmNewPassword");

  // validaciones datos personales
  const regexNombre = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
  const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
  //constantes de validacion direcciones
  const regexCalle = /^[a-zA-Z0-9#\s]+$/;
  const regexCiudadEstadoPais = /^[a-zA-Z\s]+$/;
  const regexCP = /^[a-zA-Z0-9]+$/;

  const forms = {
    perfilForm: document.getElementById("perfilForm"),
    seguridadForm: document.getElementById("seguridadForm"),
    direccionesForm: document.getElementById("direccionesForm"),
  };

  //formularios individual
  Object.keys(forms).forEach((key) => {
    const form = forms[key];
    if (!form) return;

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      e.stopPropagation();

      let esValido = true;
      const currentForm = e.target;

      currentForm.querySelectorAll(".form-control").forEach((input) => {
        input.classList.remove("is-invalid", "is-valid");
      });
      // Lógica para perfilForm
      if (key === "perfilForm") {
        console.log("Validando perfil...");

        //Validar Nombre
        if (
          currentForm.fullName &&
          !regexNombre.test(currentForm.fullName.value.trim())
        ) {
          currentForm.fullName.classList.add("is-invalid");
          esValido = false;
        } else if (currentForm.fullName) {
          currentForm.fullName.classList.add("is-valid");
        }

        //Validar Correo
        if (
          currentForm.email &&
          !regexCorreo.test(currentForm.email.value.trim())
        ) {
          currentForm.email.classList.add("is-invalid");
          esValido = false;
        } else if (currentForm.email) {
          currentForm.email.classList.add("is-valid");
        }

        //Validar Teléfono
        if (!iti.isValidNumber()) {
          inputTelefono.classList.add("is-invalid");
          inputTelefono.closest(".iti").classList.add("is-invalid");
          esValido = false;
        } else {
          inputTelefono.classList.remove("is-invalid");
          inputTelefono.closest(".iti").classList.remove("is-invalid");

          inputTelefono.classList.add("is-valid");
        }

        console.log("¿Es válido?:", esValido);
      }

      // Validar seguridad
      if (key === "seguridadForm") {
        // Validar contraseña actual (solo que no esté vacía)
        if (currentForm.currentPassword.value.trim() === "") {
          currentForm.currentPassword.classList.add("is-invalid");
          esValido = false;
        } else {
          currentForm.currentPassword.classList.add("is-valid");
        }

        if (!regexPassword.test(currentForm.newPassword.value)) {
          currentForm.newPassword.classList.add("is-invalid");
          esValido = false;
        } else {
          currentForm.newPassword.classList.add("is-valid");
        }

        if (
          currentForm.confirmNewPassword.value === "" ||
          currentForm.confirmNewPassword.value !== currentForm.newPassword.value
        ) {
          currentForm.confirmNewPassword.classList.add("is-invalid");
          esValido = false;
        } else {
          currentForm.confirmNewPassword.classList.add("is-valid");
        }
      }

      //Validar direcciones
      if (key === "direccionesForm") {
        const validacionesDireccion = {
          street: regexCalle,
          city: regexCiudadEstadoPais,
          state: regexCiudadEstadoPais,
          country: regexCiudadEstadoPais,
          zipCode: regexCP,
        };

        Object.keys(validacionesDireccion).forEach((id) => {
          const input = currentForm.elements[id];
          const regex = validacionesDireccion[id];

          if (
            !input ||
            input.value.trim() === "" ||
            !regex.test(input.value.trim())
          ) {
            input.classList.add("is-invalid");
            esValido = false;
          } else {
            input.classList.add("is-valid");
          }
        });
      }

      if (esValido) {
        if (key === "direccionesForm") {
          const direccionTexto = `${currentForm.street.value}, ${currentForm.city.value}, ${currentForm.state.value}, ${currentForm.country.value}, CP: ${currentForm.zipCode.value}`;
          const divDireccion = document.createElement("div");
          divDireccion.className = "direccion-item";
          divDireccion.innerHTML = `<span>${direccionTexto}</span><button class="btn btn-sm btn-borrar-personalizado">Borrar</button>`;
          divDireccion.addEventListener("click", () => {
            document
              .querySelectorAll(".direccion-item")
              .forEach((i) => i.classList.remove("seleccionada"));
            divDireccion.classList.add("seleccionada");
          });
          divDireccion
            .querySelector("button")
            .addEventListener("click", (e) => {
              e.stopPropagation();
              divDireccion.remove();
            });
          document.getElementById("listaDirecciones").appendChild(divDireccion);
        }

        currentForm.reset();
        currentForm.querySelectorAll(".form-control").forEach((input) => {
          input.classList.remove("is-valid");
        });
      }
    });
  });
});
