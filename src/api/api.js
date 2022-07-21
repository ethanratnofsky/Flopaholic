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
 * Groups an array of cards by suit.
 * @param {Array[Card]} cards - An array of cards.
 * @returns {Object} A map of suit to array of cards.
 */
const groupBySuit = cards => {
    let groups = {};
    for (const suit of SUITS) {
        groups[suit] = cards.filter(card => card.suit === suit);
    }
    return groups;
}

/**
 * Groups an array of cards by rank.
 * @param {Array[Card]} cards - An array of cards.
 * @returns {Object} A map of rank to array of cards.
 */
const groupByRank = cards => {
    let groups = {};
    for (const rank of RANKS) {
        groups[rank] = cards.filter(card => card.rank === rank);
    }
    return groups;
}

/**
 * Returns an object with an array of 4 cards that are four of a kind and sorted kicker cards.
 * If no four of a kind is found, returns false.
 * If there are multiple ranks of four of a kind, returns the highest ranked.
 * @param {Array[Card]} cards - An array of cards.
 * @returns {Object|false} An object with an array of 4 cards that are four of a kind, sorted kicker cards, and value.
 */
export const getFourOfAKind = cards => {
    const sortedCards = sortByRank(cards);
    const groups = groupByRank(sortedCards);
    let value = -1;
    let quads = [];
    let kickers = [];
    
    for (const group of Object.values(groups)) {
        if (group.length === 4 && group[0].value > value) {
            value = group[0].value;
            quads = group;
            kickers = sortedCards.filter(card => card.value !== value);
        }
    }
    
    return (value >= 0) ? { value, cards: quads, kickers } : false;
}

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
    const suitGroups = groupBySuit(cards);
    
    // Check if number of cards in any suit is greater than or equal to 5
    for (const [suit, cards] of Object.entries(suitGroups)) {
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

/**
 * Returns an object with an array of 3 cards that are three of a kind and sorted kicker cards.
 * If no three of a kind is found, returns false.
 * If there are multiple ranks of three of a kind, returns the highest ranked.
 * Does not check for a full house.
 * @param {Array[Card]} cards - An array of cards.
 * @returns {Object|false} An object with an array of 3 cards that are three of a kind, sorted kicker cards, and value.
 */
 export const getThreeOfAKind = cards => {
    const sortedCards = sortByRank(cards);
    const groups = groupByRank(sortedCards);
    let value = -1;
    let trips = [];
    let kickers = [];
    
    for (const group of Object.values(groups)) {
        if (group.length === 3 && group[0].value > value) {
            value = group[0].value;
            trips = group;
            kickers = sortedCards.filter(card => card.value !== value);
        }
    }
    
    return (value >= 0) ? { value, cards: trips, kickers } : false;
}