import { Card, Suite, cardValues } from './Card.js';

export class PatienceGame {
    constructor() {
        this.deck = [];
        this.pointer = 0;
        this.score = 0;
        this.init();
    }

    init() {
        const suites = [Suite.SPADES, Suite.HEARTS, Suite.DIAMONDS, Suite.CLUBS];
        for (const suite of suites) {
            for (const value of cardValues) {
                this.deck.push(new Card(value, suite));
            }
        }
        this.shuffle();
    }

    shuffle() {
        for (let i = this.deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
        }
    }

    refreshScore() {
        this.score = this.calculateScore();
    }

    peekNextPointer(step) {
        const potentialIndex = (this.pointer + step + 1) % this.deck.length;
        return this.deck[potentialIndex];
    }

    updatePointer(step) {
        this.pointer = (this.pointer + step + 1) % this.deck.length;
        return this.deck[this.pointer];
    }

    reset() {
        this.pointer = 0;
        this.score = 0;
        this.deck.forEach(card => {
            card.hidden = true;
        });
        this.shuffle();
    }

    calculateScore() {
        let totalScore = 0;
        let formulaParts = [];
        const len = this.deck.length;
        let cardsInARow = [];

        for (let i = 0; i < len; i++) {
            const currentIndex = (this.pointer + i) % len;
            const card = this.deck[currentIndex];

            if (card.hidden) {
                if (cardsInARow.length > 0) {
                    const result = this.processStreak(totalScore, cardsInARow.length);
                    totalScore = result.score;
                    formulaParts.push(result.symbol);
                    cardsInARow = [];
                }
                continue;
            }
            cardsInARow.push(card);
        }

        if (cardsInARow.length > 0) {
            const result = this.processStreak(totalScore, cardsInARow.length);
            totalScore = result.score;
            formulaParts.push(result.symbol);
        }

        this.scoreFormula = formulaParts.join(" "); 
        return totalScore;
    }

    processStreak(currentScore, streakLength) {
        if (streakLength === 1) {
            return { 
                score: currentScore + 1, 
                symbol: currentScore === 0 ? "1" : "+ 1" 
            };
        }
    
        if (currentScore === 0) {
            return { 
                score: streakLength, 
                symbol: `${streakLength}` 
            };
        } 
    
        return { 
            score: currentScore * streakLength, 
            symbol: `* ${streakLength}` 
        };
    }
}