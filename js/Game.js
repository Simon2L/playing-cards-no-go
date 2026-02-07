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

    updatePointer(step) {
        this.pointer = (this.pointer + step + 1) % this.deck.length;
        return this.deck[this.pointer];
    }
}