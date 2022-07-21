import Card from './Card.js';
import { RANKS, SUITS } from './config.js';

/**
 * Returns a copy of an array of cards that are sorted by rank.
 * Ties are broken by order of appearance.
 * 
 * O(n * m) time complexity, where n is the number of cards and m is the number of ranks.
 * 
 * @param {Array[Card]} cards - An array of cards.
 * @returns {Array[Card]} A copy of the array of cards sorted by rank.
 */
const sortByRank = cards => [...cards].sort((a, b) => RANKS.indexOf(b.rank) - RANKS.indexOf(a.rank));

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
