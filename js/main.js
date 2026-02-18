import { PatienceGame } from './Game.js';

const table = document.getElementById("table");
const strategyButtons = document.querySelectorAll('.strat-btn');
const cheat = document.getElementById("cheat");

const game = new PatienceGame();

if (cheat) {
    cheat.addEventListener("click", () => {
        table.replaceChildren();
        game.reset();
        game.cheat();
        renderCards();
    })
}
strategyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        strategyButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const selectedMode = btn.getAttribute('data-strategy');
        game.strategy = selectedMode;
    });
});

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

    const nextCard = game.peekNextPointer(value); 
    const nextEl = document.getElementById(nextCard.id);

    if (!nextEl) {
        const finalScore = game.calculateScore(); 
        
        const modal = document.getElementById("game-over-modal");
        document.getElementById("modal-score").textContent = finalScore;
        
        modal.style.display = "flex";
        
        document.getElementById("modal-reset-btn").onclick = () => {
            resetGame();
            modal.style.display = "none";
            saveGlobalScore(finalScore, game.strategy);
        };
        return;
    }

    game.updatePointer(value); 
    nextEl.onclick = cardBackClicked;
    nextEl.parentElement.classList.add("glow");
}

function resetGame() {
    table.replaceChildren();
    game.reset();
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

async function saveGlobalScore(finalScore, strategy) {
    const response = await fetch('/save-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: document.getElementById("player-name").value,
            strategy: strategy,
            score: finalScore,
            date: new Date().toLocaleDateString()
        })
    });
    
    const data = await response.json();
    
    displayTopLeaderboard(data);
}

async function getGlobalScores() {
    try {
        const response = await fetch('/get-score');

        if (!response.ok) {
            console.warn("Leaderboard not found (404)");
            return;
        }

        const data = await response.json();
        displayTopLeaderboard(data);

    } catch (err) {
        console.error("Failed to load scores:", err);
    }
}

function displayTopLeaderboard(data) {
    Object.keys(data).forEach(strat => {
        const topBody = document.getElementById(`leaderboard-body-${strat}`);
        const botBody = document.getElementById(`leaderboard-bottom-body-${strat}`);
        const container = document.getElementById(`leaderboard-${strat}`);

        if (!topBody || !data[strat]) return;

        topBody.innerHTML = data[strat].top_10.map((s, i) => `
            <tr>
                <td>#${i + 1}</td>
                <td class="row-score">${s.score}</td>
                <td class="row-name">${s.name || 'clanka'}</td>
            </tr>
        `).join('');

        // if (botBody && data[strat].bot_10) {
        //     botBody.innerHTML = data[strat].bot_10.reverse().map((s, i) => `
        //         <tr>
        //             <td style="color: var(--muted-color)">#${i + 1}</td>
        //             <td class="row-score">${s.score}</td>
        //             <td class="row-name">${s.name || 'clanka'}</td>
        //         </tr>
        //     `).join('');
        // }

        container.style.display = 'flex';
    });
}
renderCards();
getGlobalScores();