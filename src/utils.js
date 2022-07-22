import Deck from './models/Deck';
import Hand from './models/Hand';

import { BOARD_SIZE, HAND_RANKINGS, HOLE_SIZE } from './constants';

// Set up board and hole
export const deck = new Deck();

export let board = [];
export let hole = [];
export let hand;

export const newHand = () => {
    // Reset deck
    deck.reset();
    deck.shuffle();

    // Reset board
    board = [];
    for (let i = 0; i < BOARD_SIZE; i++) {
        board.push(deck.draw());
    }

    // Reset hole
    hole = [];
    for (let i = 0; i < HOLE_SIZE; i++) {
        hole.push(deck.draw());
    }

    // Reset hand
    hand = new Hand(hole);
}

export const redealUntil = (ranking) => {
    // Ensure valid hand ranking
    if (HAND_RANKINGS.ranking)
        throw new Error(`Invalid hand ranking: ${ranking}`);

    const deals = [];

    do {
        newHand();
        hand.addCards(board);
        deals.push(hand.getCards());
    } while (hand.getShortName() !== ranking);

    console.log(hand.getLongName());
    console.log(`Redealt ${deals.length} time${deals.length === 1 ? '' : 's'}`);
    console.log(deals);
}