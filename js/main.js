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

async function getGlobalScores() {
    try {
        const response = await fetch('/get-score');
        
        if (!response.ok) {
            console.warn("Leaderboard not found (404)");
            return;
        }

        const topScores = await response.json();
        displayLeaderboard(topScores);
    } catch (err) {
        console.error("Failed to load scores:", err);
    }
}

function displayLeaderboard(scores) {
    const tbody = document.getElementById('leaderboard-body');
    const container = document.getElementById('leaderboard');
    
    tbody.innerHTML = scores.map((s, i) => `
        <tr>
            <td>#${i + 1}</td>
            <td class="row-score">${s.score}</td>
            <td class="row-formula">${s.formula}</td>
        </tr>
    `).join('');
    
    container.style.display = 'flex';
}

renderCards();
getGlobalScores();