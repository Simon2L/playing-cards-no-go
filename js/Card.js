// dd
export class Suite {
    static SPADES = "spades";
    static HEARTS = "hearts";
    static DIAMONDS = "diamonds";
    static CLUBS = "clubs";
}

export const cardValues = [
    "ace", "2", "3", "4", "5", "6", "7",
    "8", "9", "10", "jack", "queen", "king"
];


export class Card {
    constructor(value, suite) {
        this.value = value;
        this.suite = suite;
        this.hidden = true;
    }

    get numericValue() {
        return cardValues.indexOf(this.value) + 1;
    }

    get id() {
        return `card-${this.value}-${this.suite}`;
    }

    get imagePath() {
        return `SVG-cards-1.3/${this.value}_of_${this.suite}.svg`;
    }
}