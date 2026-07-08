document.addEventListener("DOMContentLoaded", () => {
  const API_URL = "http://localhost:8080/api/users";

  // El usuario logueado se guarda en login.js como un UsersDTO (id, fullName,
  // userName, email, phone, registrationDate, address) en localStorage si
  // marcó "recordarme", o en sessionStorage si no.
  function obtenerUsuarioSesion() {
    const datos =
      localStorage.getItem("usuarioLogueado") ||
      sessionStorage.getItem("usuarioLogueado");
    return datos ? JSON.parse(datos) : null;
  }

  // Vuelve a guardar el usuario actualizado en el mismo storage donde ya
  // estaba, para que el navbar y el resto del sitio vean los datos frescos
  // sin necesidad de volver a iniciar sesión.
  function guardarUsuarioSesion(usuario) {
    if (localStorage.getItem("usuarioLogueado")) {
      localStorage.setItem("usuarioLogueado", JSON.stringify(usuario));
    } else {
      sessionStorage.setItem("usuarioLogueado", JSON.stringify(usuario));
    }
  }

  const usuarioSesion = obtenerUsuarioSesion();
  if (!usuarioSesion) {
    alert("Debes iniciar sesión para ver tu perfil.");
    window.location.href = "/src/pages/auth/login/login.html";
    return;
  }

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

  // Dibuja (o reemplaza) la tarjeta de dirección en la lista. El backend solo
  // guarda UNA dirección por usuario (campo Users.address, texto simple), así
  // que aquí siempre reemplazamos en vez de acumular varias.
  function renderizarDireccion(direccionTexto) {
    const lista = document.getElementById("listaDirecciones");
    lista.innerHTML = "";
    if (!direccionTexto) return;

    const divDireccion = document.createElement("div");
    divDireccion.className = "direccion-item";
    divDireccion.innerHTML = `<span>${direccionTexto}</span><button class="btn btn-sm btn-borrar-personalizado">Borrar</button>`;
    divDireccion.addEventListener("click", () => {
      document
        .querySelectorAll(".direccion-item")
        .forEach((i) => i.classList.remove("seleccionada"));
      divDireccion.classList.add("seleccionada");
    });
    divDireccion.querySelector("button").addEventListener("click", (e) => {
      e.stopPropagation();
      fetch(`${API_URL}/${usuarioSesion.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address: "" }),
      })
        .then((res) => {
          if (!res.ok) throw new Error("No se pudo borrar la dirección.");
          return res.json();
        })
        .then((usuarioActualizado) => {
          guardarUsuarioSesion(usuarioActualizado);
          divDireccion.remove();
        })
        .catch((error) => {
          console.error("Error al borrar la dirección:", error);
          alert("No se pudo borrar la dirección del servidor.");
        });
    });
    lista.appendChild(divDireccion);
  }

  // Trae los datos actuales del usuario y llena el formulario de "Datos
  // personales" y la tarjeta de dirección (si tiene una guardada).
  fetch(`${API_URL}/${usuarioSesion.id}`)
    .then((res) => {
      if (!res.ok) throw new Error("No se pudo cargar el perfil.");
      return res.json();
    })
    .then((usuario) => {
      const elFullName = document.getElementById("fullName");
      const elUsername = document.getElementById("username");
      const elEmail = document.getElementById("email");

      if (elFullName) elFullName.value = usuario.fullName || "";
      if (elUsername) elUsername.value = usuario.userName || "";
      if (elEmail) elEmail.value = usuario.email || "";
      if (usuario.phone && iti.setNumber) iti.setNumber(String(usuario.phone));

      renderizarDireccion(usuario.address);
    })
    .catch((error) => {
      console.error("Error al cargar el perfil:", error);
      alert(
        "No se pudieron cargar tus datos. ¿Está encendido el backend (Spring Boot, puerto 8080)?",
      );
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

      if (!esValido) return;

      // --- Datos personales: PUT sin password, para que el backend
      // conserve la contraseña actual (UserService la deja igual si no
      // se la mandas). No reseteamos el formulario: son datos de perfil,
      // no un formulario de captura única — debe seguir mostrando lo que
      // el usuario acaba de guardar.
      if (key === "perfilForm") {
        const datosActualizados = {
          fullName: currentForm.fullName.value.trim(),
          userName: currentForm.username.value.trim(),
          email: currentForm.email.value.trim(),
          phone: iti.getNumber(),
        };
        fetch(`${API_URL}/${usuarioSesion.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(datosActualizados),
        })
          .then((res) => {
            if (!res.ok) throw new Error("No se pudo guardar el perfil.");
            return res.json();
          })
          .then((usuarioActualizado) => {
            guardarUsuarioSesion(usuarioActualizado);
            alert("Datos personales actualizados correctamente.");
          })
          .catch((error) => {
            console.error("Error al actualizar el perfil:", error);
            alert(
              "No se pudieron guardar los cambios. ¿Está encendido el backend (Spring Boot, puerto 8080)?",
            );
          });
        return;
      }

      // --- Seguridad: primero confirmamos la contraseña actual reusando
      // el endpoint de login (no hay uno dedicado a "verificar contraseña"),
      // y solo si es correcta mandamos la nueva con PUT.
      if (key === "seguridadForm") {
        const currentPassword = currentForm.currentPassword.value;
        const newPassword = currentForm.newPassword.value;

        fetch(`${API_URL}/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: usuarioSesion.email,
            password: currentPassword,
          }),
        })
          .then((res) => {
            if (!res.ok) {
              currentForm.currentPassword.classList.remove("is-valid");
              currentForm.currentPassword.classList.add("is-invalid");
              throw new Error("La contraseña actual es incorrecta.");
            }
            return fetch(`${API_URL}/${usuarioSesion.id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ password: newPassword }),
            });
          })
          .then((res) => {
            if (!res.ok) throw new Error("No se pudo actualizar la contraseña.");
            alert("Contraseña actualizada correctamente.");
            currentForm.reset();
            currentForm.querySelectorAll(".form-control").forEach((input) => {
              input.classList.remove("is-valid");
            });
          })
          .catch((error) => {
            console.error("Error al actualizar la contraseña:", error);
            alert(error.message || "No se pudo actualizar la contraseña.");
          });
        return;
      }

      // --- Direcciones: el backend solo tiene UN campo de texto para
      // dirección (Users.address) — no hay tabla/entidad de direcciones
      // múltiples. Guardamos la dirección armada ahí, reemplazando
      // cualquier dirección anterior.
      if (key === "direccionesForm") {
        const direccionTexto = `${currentForm.street.value}, ${currentForm.city.value}, ${currentForm.state.value}, ${currentForm.country.value}, CP: ${currentForm.zipCode.value}`;

        fetch(`${API_URL}/${usuarioSesion.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ address: direccionTexto }),
        })
          .then((res) => {
            if (!res.ok) throw new Error("No se pudo guardar la dirección.");
            return res.json();
          })
          .then((usuarioActualizado) => {
            guardarUsuarioSesion(usuarioActualizado);
            renderizarDireccion(direccionTexto);
            alert(
              "Dirección guardada. Por ahora solo se puede guardar una dirección a la vez.",
            );
          })
          .catch((error) => {
            console.error("Error al guardar la dirección:", error);
            alert(
              "No se pudo guardar la dirección. ¿Está encendido el backend (Spring Boot, puerto 8080)?",
            );
          });

        currentForm.reset();
        currentForm.querySelectorAll(".form-control").forEach((input) => {
          input.classList.remove("is-valid");
        });
      }
    });
  });
});
