import Card from './Card.js';
import { RANKS, SUITS } from './config.js';

/**
 * Returns a copy of an array of cards that are sorted by rank.
 * Ties are broken by order of appearance.
 * @param {Array[Card]} cards - An array of cards.
 * @returns {Array[Card]} A copy of the array of cards sorted by rank.
 */
const sortByRank = cards => [...cards].sort((a, b) => b.value - a.value);

/**
 * Returns an array of 5 cards that are a flush and suit.
 * If no flush is found, returns false.
 * @pre cards is an array of < 10 cards
 * @param {Array[Card]} cards - An array of cards to check for a flush.
 * @returns {Object|false} - A sorted array of 5 cards (high -> low) that are a flush and suit, or false.
 */
export const getFlush = cards => {
    // Ensure input is an array of < 10 cards
    if (cards.length >= 10)
        throw new Error('getFlush: cards must be an array of < 10 cards');

    // Group by suit
    let groupBySuit = {};
    for (const suit of SUITS) {
        groupBySuit[suit] = cards.filter(card => card.suit === suit);
    }
    
    // Check if number of cards in any suit is greater than or equal to 5
    for (const [suit, cards] of Object.entries(groupBySuit)) {
        if (cards.length >= 5) {
            const sortedCards = sortByRank(cards);
            return {
                suit,
                cards: sortedCards.slice(0, 5), // Return 5 highest ranked cards
            };
        }
    }

    return false;
}

/**
 * Returns an array of 5 cards that are a straight.
 * If no straight is found, returns false.
 * @param {Array[Card]} cards - An array of cards to check for a straight.
 * @param {Boolean} [allowWheel=true] - Whether to allow the wheel to be a straight.
 * @returns {Array[Card]|false} - A sorted array of 5 cards (high -> low) that are a straight, or false.
 */
export const getStraight = (cards, allowWheel = true) => {
    // Sort cards by rank
    const sortedCards = sortByRank(cards);

    // Check if there are 5 cards in a row
    for (let i = 0; i < sortedCards.length - 4; i++) {
        const sequence = sortedCards.slice(i, i + 5);
        const [ card_1, card_2, card_3, card_4, card_5 ] = sequence;

        if (card_1.value === card_2.value + 1 &&
            card_2.value === card_3.value + 1 &&
            card_3.value === card_4.value + 1 &&
            card_4.value === card_5.value + 1) {
            return sequence;
        }
    }

    // Check for Ace-low straight
    if (allowWheel) {
        const numCards = sortedCards.length;
        if (sortedCards[0].value === RANKS.length - 1 &&
            sortedCards[numCards - 1].value === 0 &&
            sortedCards[numCards - 2].value === 1 &&
            sortedCards[numCards - 3].value === 2 &&
            sortedCards[numCards - 4].value === 3) {
            return [...sortedCards.slice(numCards - 4), sortedCards[0]];
        }
    }

    return false;
}