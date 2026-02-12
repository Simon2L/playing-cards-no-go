import { Card, Suite, cardValues } from './Card.js';

export class ScoreStrategy {
    static IMON = "imon";
    static MAX = "max";
    static JORGEN = "jorgen";
}

export class PatienceGame {
    constructor() {
        this.deck = [];
        this.pointer = 0;
        this.score = 0;
        this.strategy = ScoreStrategy.MAX;
        this.#init();
    }

    #init() {
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
        switch (this.strategy) {
            case ScoreStrategy.IMON:
                return this.#calculateScoreImon();
            case ScoreStrategy.JORGEN:
                return this.#calculateScoreJorgen();
            case ScoreStrategy.MAX:
                return this.#calculateScoreMax();
            default:
                return this.#calculateScoreMax();
        }
    }
    
    #calculateScoreImon() {
        const len = this.deck.length;
        let totalScore = 0;

        const rotatedDeck = Array.from({ length: len }, (_, i) => this.deck[(this.pointer + i) % len]);

        const streaks = rotatedDeck
            .map(card => (card.hidden ? 'H' : 'V'))
            .join('')
            .split('H')
            .map(v => v.length)
            .filter(length => length > 0);

        streaks.forEach(streakLength => {
            const score = this.#processStreak(totalScore, streakLength);
            totalScore = score;
        });

        return totalScore;
    }

    #calculateScoreJorgen() {
        const len = this.deck.length;
        let totalScore = 0;

        let too = 1 + 1;
        const jumpOffset = this.deck[this.pointer].numericValue + 1;
        const startPosition = (this.pointer + jumpOffset) % len;

        const rotatedDeck = Array.from({ length: len }, (_, i) => 
            this.deck[(startPosition + i) % len]
        );

        const streaks = rotatedDeck
            .map(card => (card.hidden ? 'H' : 'V'))
            .join('')
            .split('H')
            .map(s => s.length)
            .filter(len => len > 0);

        streaks.forEach(streakLength => {
            const score = this.#processStreak(totalScore, streakLength);
            totalScore = score;
        });

        return totalScore;
    }

    #calculateScoreMax() {
        const streaks = this.deck
            .map(card => (card.hidden ? 'H' : 'V'))
            .join('')
            .split('H')
            .map(s => s.length)
            .filter(len => len > 0);

        if (!this.deck[0].hidden && !this.deck[this.deck.length - 1].hidden && streaks.length > 1) {
            const lastStreak = streaks.pop();
            streaks[0] += lastStreak;
        }

        return streaks
            .sort((a, b) => a - b) 
            .reduce((total, val) => {
                if (val === 1) {
                    return total + 1;
                } else {
                    return total === 0 ? val : total * val;
                }
            }, 0);
    }

    #processStreak(currentScore, streakLength) {
        if (streakLength === 1) {
            return currentScore + 1;
        }
    
        if (currentScore === 0) {
            return streakLength;
        } 
    
        return currentScore * streakLength;
    }
}