import { RANKS, SUITS } from '../constants';
import Card from './Card';

export default class Deck {
    constructor() {
        this.cards = [];
        this.numCards = 0;
        for (let suit of SUITS) {
            for (let rank of RANKS) {
                this.cards.push(new Card(rank, suit));
                this.numCards++;
            }
        }
    }

    // Reset the deck to its original state
    reset() {
        this.constructor();
    }

    // Determines whether the deck is empty
    isEmpty() {
        return this.numCards === 0;
    }

    // Shuffle the deck
    shuffle() {
        // Fisher-Yates shuffle (https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle)
        for (let i = 0; i < this.numCards; i++) {
            const index = Math.floor(Math.random() * this.numCards);
            const card = this.cards[index];
            this.cards.splice(index, 1);
            this.cards.push(card);
        }
    }

    // Return a random card from the deck
    draw() {
        if (this.isEmpty())
            throw new Error('Deck is empty');

        const card = this.cards.pop();
        this.numCards--;
        return card;
    }
}