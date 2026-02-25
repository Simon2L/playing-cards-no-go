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

    cheat() {
    this.deck = [
        new Card("4", Suite.CLUBS),    // 0
        new Card("2", Suite.CLUBS),    // 1
        new Card("8", Suite.CLUBS),    // 2
        new Card("3", Suite.CLUBS),    // 3
        new Card("7", Suite.CLUBS),    // 4
        new Card("4", Suite.DIAMONDS), // 5 (was 4 Clubs)
        new Card("5", Suite.HEARTS),   // 6
        new Card("5", Suite.CLUBS),    // 7
        new Card("7", Suite.DIAMONDS), // 8 (was 7 Clubs)
        new Card("10", Suite.CLUBS),   // 9
        new Card("6", Suite.CLUBS),    // 10
        new Card("king", Suite.CLUBS), // 11
        new Card("6", Suite.DIAMONDS), // 12 (was 6 Clubs)
        new Card("ace", Suite.CLUBS),  // 13
        new Card("queen", Suite.HEARTS),// 14
        new Card("8", Suite.DIAMONDS), // 15 (was 8 Clubs)
        new Card("4", Suite.HEARTS),   // 16 (was 4 Clubs)
        new Card("jack", Suite.CLUBS), // 17
        new Card("ace", Suite.HEARTS), // 18
        new Card("7", Suite.HEARTS),   // 19 (was 7 Clubs)
        new Card("king", Suite.DIAMONDS),// 20 (was King Clubs)
        new Card("6", Suite.HEARTS),   // 21 (was 6 Clubs)
        new Card("3", Suite.HEARTS),   // 22
        new Card("2", Suite.HEARTS),   // 23
        new Card("8", Suite.HEARTS),   // 24 (was 8 Clubs)
        new Card("5", Suite.DIAMONDS), // 25 (was 5 Clubs)
        new Card("ace", Suite.DIAMONDS),// 26 (was Ace Hearts)
        new Card("queen", Suite.CLUBS), // 27
        new Card("10", Suite.DIAMONDS),// 28 (was 10 Clubs)
        new Card("queen", Suite.DIAMONDS),// 29 (was Queen Clubs)
        new Card("3", Suite.DIAMONDS), // 30 (was 3 Hearts)
        new Card("10", Suite.HEARTS),  // 31 (was 10 Clubs)
        new Card("jack", Suite.HEARTS),// 32
        new Card("3", Suite.SPADES),   // 33 (was 3 Clubs)
        new Card("8", Suite.SPADES),   // 34 (was 8 Clubs)
        new Card("6", Suite.SPADES),   // 35 (was 6 Hearts)
        new Card("4", Suite.SPADES),   // 36 (was 4 Hearts)
        new Card("9", Suite.CLUBS),    // 37
        new Card("9", Suite.HEARTS),   // 38
        new Card("ace", Suite.SPADES), // 39 (was Ace Clubs)
        new Card("king", Suite.HEARTS),// 40 (was King Clubs)
        new Card("jack", Suite.DIAMONDS),// 41 (was Jack Clubs)
        new Card("queen", Suite.SPADES),// 42 (was Queen Clubs)
        new Card("2", Suite.DIAMONDS), // 43 (was 2 Clubs)
        new Card("7", Suite.SPADES),   // 44 (was 7 Hearts)
        new Card("9", Suite.DIAMONDS), // 45 (was 9 Hearts)
        new Card("2", Suite.SPADES),   // 46 (was 2 Clubs)
        new Card("king", Suite.SPADES),// 47 (was King Clubs)
        new Card("5", Suite.SPADES),   // 48 (was 5 Hearts)
        new Card("10", Suite.SPADES),  // 49 (was 10 Clubs)
        new Card("jack", Suite.SPADES),// 50 (was Jack Hearts)
        new Card("9", Suite.SPADES)    // 51 (was 9 Hearts)
    ];
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