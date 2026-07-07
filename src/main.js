const verificarConexion = async () => {
  try {
    // Apuntamos a tu controlador real de productos
    const respuesta = await fetch("http://localhost:8080/api/products");

    if (!respuesta.ok) {
      throw new Error(`Error en el servidor: ${respuesta.status}`);
    }

    const datos = await respuesta.json();
    console.log("🟢 ¡CONEXIÓN EXITOSA CON EL BACKEND REAL!");
    console.log("Datos recibidos (Productos):", datos);
    // Debería mostrarte un arreglo vacío [] o la lista si ya insertaste datos.
  } catch (error) {
    console.error("❌ Error de comunicación:", error.message);
  }
};

verificarConexion();
