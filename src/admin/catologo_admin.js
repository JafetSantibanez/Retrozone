const mainEl = document.querySelector("main"); 
const formEl = document.querySelector("#gameForm");
const sectiongamesEl = document.getElementById("games"); 
const navbarEl = document.querySelector(".navbar");
let gamesArray = []; 

window.addEventListener("load", () => {
  const savedGames = JSON.parse(localStorage.getItem("games"));  
  if (savedGames === null) return;
  gamesArray = savedGames;  
 gamesArray.forEach((game) => renderGame(game));
});

formEl.addEventListener("submit", (event) => {
    event.preventDefault(); 

    const formData = new FormData(formEl);
    const arrayData = [...formData]; 
    const gameObject = Object.fromEntries(arrayData);
    gamesArray.push(gameObject);
    saveGamesLocal(gamesArray);
  renderGame(gameObject);
    formEl.reset();
}); 

const renderGame = (objectGame) => {

    const cardGame = `
    
    <article class="game-card">

        <img
            src="https://placehold.co/400x300/142b20/ffffff?text=RetroZone"
            alt="${objectGame.name}"
        >

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
