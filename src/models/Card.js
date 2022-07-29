import { RANKS, SUITS } from '../constants';

export default class Card {
    // Private field declarations
    #rank;
    #suit;
    #value;

    // Constructor
    constructor(rank, suit) {
        if (!RANKS.includes(rank) || !SUITS.includes(suit))
            throw new Error('Invalid card: ' + rank + ' of ' + suit);

        this.#rank = rank;
        this.#suit = suit;
        this.#value = RANKS.indexOf(rank);
    }

    // Return the rank of the card
    getRank() {
        return this.#rank;
    }

    // Return the suit of the card
    getSuit() {
        return this.#suit;
    }

    // Return the rank of the card
    getValue() {
        return this.#value;
    }

    // Return the string representation of the card
    toString() {
        return this.#rank + ' of ' + this.#suit;
    }
}