const mainEl = document.querySelector("main"); 
const formEl = document.querySelector("#gameForm");
const sectiongamesEl = document.getElementById("games"); 
const navbarEl = document.querySelector(".navbar");
let gamesArray = [];
let editingId = null;

window.addEventListener("load", () => {
  const savedGames = JSON.parse(localStorage.getItem("games"));  
  if (savedGames === null) return;
  gamesArray = savedGames;  
  gamesArray.forEach((game) => renderGame(game));
});

formEl.addEventListener("submit", (event) => {
    event.preventDefault();
    console.log("editingId al guardar:", editingId);
    const formData = new FormData(formEl);
    const arrayData = [...formData];
    const formObject = Object.fromEntries(arrayData);
    console.log("editingId:", editingId);
    if(editingId !== null){
        const index = gamesArray.findIndex(
            game => Number(game.id) === Number(editingId)
        );
        gamesArray[index] = {
            id: editingId,
            ...formObject
        };
        saveGamesLocal(gamesArray);
        refreshGames();
        editingId = null;
        document.querySelector(".btn-primary").textContent =
            "Agregar al catálogo";
    } else {
        const gameObject = {
            id: Date.now(),
            ...formObject
        };
        gamesArray.push(gameObject);
        saveGamesLocal(gamesArray);
        renderGame(gameObject);
    }
    formEl.reset();
});

const refreshGames = () => {
    sectiongamesEl.innerHTML = "";
    gamesArray.forEach(game => {
        renderGame(game);
    });
};

const renderGame = (objectGame) => {
    const cardGame = `
    <article class="game-card" data-id="${objectGame.id}">
        <div class="image-container">
        <img
            src="${objectGame.image || 'https://placehold.co/400x300/142b20/ffffff?text=RetroZone'}"
            alt="${objectGame.name}"
        >
        </div>

        <div class="game-card-content">

            <h3>${objectGame.name}</h3>

            <p>
                ${objectGame.platform} • ${objectGame.category}
            </p>

            <p>
                Estado: ${objectGame.status}
            </p>

            <p>
                ${objectGame.description || "Sin descripción"}
            </p>

            <p class="game-discount">
                ${objectGame.discount || 0}% OFF
            </p>

            <p class="game-price">
                $${objectGame.price} MXN
            </p>

            <div class="card-actions">
                <button type="button" class="btn-edit" data-id="${objectGame.id}">
                    <i class="bi bi-pencil-square"></i>
                    Editar
                </button>

                <button type="button" class="btn-delete" data-id="${objectGame.id}">
                    <i class="bi bi-trash3-fill"></i>
                    Eliminar
                </button>
            </div>

        </div>

    </article>
    `;
    sectiongamesEl.insertAdjacentHTML("beforeend", cardGame);
};

const saveGamesLocal = (arrayGames) => {
  const textGames = JSON.stringify(arrayGames);
  console.log(textGames);
  localStorage.setItem("games", textGames);
};

/** Boton Eliminar */
sectiongamesEl.addEventListener("click", (event) => {
    const deleteButton = event.target.closest(".btn-delete");
    if (!deleteButton) return;
    const gameId = Number(deleteButton.dataset.id);
    const card = deleteButton.closest(".game-card");
    deleteGame(gameId, card);
});

const deleteGame = (gameId, card) => {
    const confirmDelete = confirm(
        "¿Deseas eliminar este producto?"
    );
    if (!confirmDelete) return;
    gamesArray = gamesArray.filter(
        game => Number(game.id) !== Number(gameId)
    );
    saveGamesLocal(gamesArray);
    card.remove();
};

/** Boton Modificar */
sectiongamesEl.addEventListener("click", (event) => {
    const editButton = event.target.closest(".btn-edit");
    if(!editButton) return;
    const gameId = Number(editButton.dataset.id);
    editGame(gameId);
});

const editGame = (gameId) => {
    console.log("Botón editar presionado");
    console.log("gameId:", gameId);
    const game = gamesArray.find(
        game => Number(game.id) === Number(gameId)
    );
    console.log("Juego encontrado:", game);
    if(!game) return;
    document.querySelector("#image").value = game.image || "";
    document.querySelector("#name").value = game.name;
    document.querySelector("#platform").value = game.platform;
    document.querySelector("#category").value = game.category;
    document.querySelector("#status").value = game.status;
    document.querySelector("#description").value = game.description;
    document.querySelector("#price").value = game.price;
    document.querySelector("#originprice").value = game.originprice;
    document.querySelector("#discount").value = game.discount;
    document.querySelector("#stock").value = game.stock;
    editingId = gameId;
    console.log("editingId asignado:", editingId);
    document.querySelector(".btn-primary").textContent =
        "Guardar Cambios";
};