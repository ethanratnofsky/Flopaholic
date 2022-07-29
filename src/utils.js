import Card from './models/Card';
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

    let numRedeals = 0;

    do {
        newHand();
        hand.setCards([...hole, ...board]);
        numRedeals++;
    } while (hand.getShortName() !== ranking);

    console.log(hand.getLongName());
    console.log(`Redealt ${numRedeals} time${numRedeals === 1 ? '' : 's'}`);
}


/**
 * Calculates the probability for each ranking of a hand upon drawing one additional card.
 * @param {Hand} hand - The hand to calculate the probability of.
 * @param {Array[Card]} otherCards - The other cards in the deck.
 * @param {Boolean} limitHandSize - Whether to limit the hand size to the size of the board + the size of the hole.
 * @returns {Object} An object with the probability of each ranking of a hand.
 */
 export const calculateHandProbability = (hand, otherCards, limitHandSize = true) => {
    const cards = hand.getCards();

    const probabilities = {};

    if (limitHandSize && cards.length === BOARD_SIZE + HOLE_SIZE) {
        // Full, no need to calculate probability
        const handRanking = hand.getShortName();

        for (const ranking of Object.values(HAND_RANKINGS)) {
            probabilities[ranking] = ranking === handRanking ? 1 : 0;
        }
    } else {
        // Initialize counts for each ranking
        const rankingsCount = {};
        for (const ranking of Object.values(HAND_RANKINGS)) {
            rankingsCount[ranking] = 0;
        }

        const tempHand = new Hand(cards);

        // Count the number of each ranking
        for (const card of otherCards) {
            tempHand.setCards([...cards, card]);
            rankingsCount[tempHand.getShortName()]++;
        }

        // Convert counts to probabilities
        for (const [ranking, count] of Object.entries(rankingsCount)) {
            probabilities[ranking] = (count / otherCards.length).toFixed(4);
        }
    }

    return probabilities;
}