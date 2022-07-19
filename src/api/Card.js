import { RANKS, SUITS } from './config.js';

export default class Card {
    constructor(rank, suit) {
        if (!RANKS.includes(rank) || !SUITS.includes(suit))
            throw new Error('Invalid card: ' + rank + ' of ' + suit);

        this.rank = rank;
        this.suit = suit;
    }

    // Return the string representation of the card
    toString() {
        return this.rank + ' of ' + this.suit;
    }
}