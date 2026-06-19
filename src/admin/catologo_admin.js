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
    <div class="card" style="width: 18rem;">
      <div class="card-body">
        <h5 class="card-title">${objectGame.name}</h5>
        <h6 class="card-subtitle mb-2 text-body-secondary">${objectGame.platform} - ${objectGame.category}</h6>
        <p class="card-text"><strong>Precio:</strong> $${objectGame.price} MXN</p>
        <p class="card-text"><strong>Estado:</strong> ${objectGame.status} (${objectGame.stock})</p>
        <p class="card-text"><small>${objectGame.description || 'Sin descripción.'}</small></p>
        <p class="card-text">
        </p>
      </div>
    </div>
    `;
    sectiongamesEl.insertAdjacentHTML("beforeend", cardGame);
}; 

const saveGamesLocal = (arrayGames) => {
  const textGames = JSON.stringify(arrayGames);
  console.log(textGames);
  localStorage.setItem("games", textGames);
};
