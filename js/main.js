import { PatienceGame } from './Game.js';

const table = document.getElementById("table");
const scoreDisplay = document.getElementById("score");
const formulaEl = document.getElementById("formula");
const resetBtn = document.getElementById("reset");
resetBtn.addEventListener("click", resetGame);

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
    
    currentCard.hidden = false;
    wrapper.classList.remove("glow");
    target.remove();
    wrapper.appendChild(img);

    game.refreshScore();
    scoreDisplay.textContent = game.score;

    const nextCard = game.peekNextPointer(value); 
    const nextEl = document.getElementById(nextCard.id);

    if (!nextEl) {
        const finalScore = game.calculateScore(); 
    
        alert("game over :(");
    
        scoreDisplay.textContent = finalScore;
        formulaEl.textContent = `${game.scoreFormula} = ${finalScore}`;
    
        resetBtn.removeAttribute("disabled");
        saveGlobalScore(finalScore, game.scoreFormula);
        return;
    }

    game.updatePointer(value); 

    nextEl.onclick = cardBackClicked;
    nextEl.parentElement.classList.add("glow");
}

function resetGame() {
    resetBtn.setAttribute("disabled", "")
    table.replaceChildren();
    scoreDisplay.textContent = "0";
    game.reset();
    formulaEl.textContent = "";
    renderCards();
}

function renderCards() {
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
}

async function saveGlobalScore(finalScore, formula) {
    const response = await fetch('/save-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            score: finalScore,
            formula: formula,
            date: new Date().toLocaleDateString()
        })
    });
    
    const topScores = await response.json();
    displayLeaderboard(topScores);
}

function displayLeaderboard(scores) {
    const list = document.getElementById('leaderboard-list');
    const container = document.getElementById('leaderboard');
    
    list.innerHTML = scores.map((s, i) => `
        <div class="stat-item" style="flex-direction: row; justify-content: space-between; gap: 20px; font-size: 0.8rem;">
            <span>#${i+1} <strong>${s.score}</strong></span>
            <span style="color: var(--muted-color)">${s.formula}</span>
        </div>
    `).join('');
    
    container.style.display = 'flex';
}

renderCards();