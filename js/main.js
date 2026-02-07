import { PatienceGame } from './Game.js';

const table = document.getElementById("table");
const scoreDisplay = document.querySelector("#score");
const game = new PatienceGame();

function createImageCardElement(card) {
    const img = document.createElement("img");
    img.draggable = false;
    img.classList.add("card");
    img.src = card.imagePath;
    img.alt = `${card.value} of ${card.suite}`;
    return img;
}

function cardBackClicked({ target }) {
    const currentCard = game.deck[game.pointer];
    const value = currentCard.numericValue;
    
    const img = createImageCardElement(currentCard);
    const wrapper = target.parentElement;
    
    wrapper.classList.remove("glow");
    target.remove();
    wrapper.appendChild(img);

    game.score++;
    scoreDisplay.textContent = game.score;

    const nextCard = game.updatePointer(value);
    const nextEl = document.getElementById(nextCard.id);
    
    if (!nextEl) {
        // game over
        alert("Game Over!");
        return;
    }

    nextEl.onclick = cardBackClicked;
    nextEl.parentElement.classList.add("glow");
}

game.deck.forEach((card, i) => {
    const wrapper = document.createElement("div");
    wrapper.classList.add("card-wrapper");

    const cardBack = document.createElement("div");
    cardBack.classList.add("card", "back");
    cardBack.id = card.id;

    if (i === game.pointer) {
        cardBack.onclick = cardBackClicked;
        wrapper.classList.add("glow");
    }

    wrapper.appendChild(cardBack);
    table.appendChild(wrapper);
});