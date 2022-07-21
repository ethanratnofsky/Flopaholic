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
 * Does not check for higher ranking hands made with kickers.
 * @param {Array[Card]} cards - An array of cards.
 * @returns {Object|false} An object with an array of 4 cards that are four of a kind, sorted kicker cards, and value.
 */
export const getFourOfAKind = cards => {
    const sortedCards = sortByRank(cards);
    const groups = groupByRank(sortedCards);
    let value = -1;
    let quads = [];
    
    // Find the highest four of a kind if exists
    for (const group of Object.values(groups)) {
        if (group.length === 4 && group[0].value > value) {
            value = group[0].value;
            quads = group;
        }
    }
    
    // Four of a kind was found
    if (value >= 0) {
        const kickers = sortedCards.filter(card => card.value !== value);
        return { value, cards: quads, kickers };
    }

    // Four of a kind was not found
    return false;
}

/**
 * Returns an array of 5 cards that are a flush and suit.
 * If no flush is found, returns false.
 * Does not check for higher ranking hands.
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
 * Does not check for higher ranking hands.
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
 * Does not check for higher ranking hands made with kickers.
 * @param {Array[Card]} cards - An array of cards.
 * @returns {Object|false} An object with an array of 3 cards that are three of a kind, sorted kicker cards, and value.
 */
 export const getThreeOfAKind = cards => {
    const sortedCards = sortByRank(cards);
    const groups = groupByRank(sortedCards);
    let value = -1;
    let trips = [];
    
    // Find the highest three of a kind if exists
    for (const group of Object.values(groups)) {
        if (group.length === 3 && group[0].value > value) {
            value = group[0].value;
            trips = group;
        }
    }
    
    // Three of a kind was found
    if (value >= 0) {
        const kickers = sortedCards.filter(card => card.value !== value);
        return { value, cards: trips, kickers };
    }

    // Three of a kind was not found
    return false;
}

/**
 * Returns an object with an array of 2 cards that are a pair and sorted kicker cards.
 * If no pair is found, returns false.
 * If there are multiple pairs, returns the highest ranked pair.
 * Does not check for higher ranking hands made with kickers.
 * @param {Array[Card]} cards - An array of cards.
 * @returns {Object|false} An object with an array of 2 cards that are a pair, sorted kicker cards, and value.
 */
 export const getPair = cards => {
    const sortedCards = sortByRank(cards);
    const groups = groupByRank(sortedCards);
    let value = -1;
    let pair = [];
    
    // Find the highest pair if exists
    for (const group of Object.values(groups)) {
        if (group.length === 2 && group[0].value > value) {
            value = group[0].value;
            pair = group;
        }
    }

    // Pair was found
    if (value >= 0) {
        const kickers = sortedCards.filter(card => card.value !== value);
        return { value, cards: pair, kickers };
    }

    // Pair was not found
    return false;
}

/**
 * Returns the highest ranking card.
 * @param {Array[Card]} cards - An array of cards.
 * @returns {Card} The highest ranking card.
 */
export const getHighCard = cards => {
    let highest = cards[0];
    for (const card of cards) {
        if (card.value > highest.value) {
            highest = card;
        }
    }
    return highest;
}

/**
 * Evaluate a hand of cards
 * @param {Array[Card]} cards - An array of cards.
 * @returns {Object} 
 */
export const evaulateHand = cards => {
    // Check for flush
    const flush = getFlush(cards);
    if (flush) {
        const straightFlush = getStraight(flush.cards);
        if (straightFlush) {
            // Royal?/Straight Flush
            const isRoyal = straightFlush[0].value === RANKS.length - 1;
            return {
                name: `${isRoyal ? 'Royal' : straightFlush[0].rank + '-High Straight'} Flush of ${flush.suit}`,
                cards: straightFlush,
            };
        }
    }

    // Check for four of a kind
    const fourOfAKind = getFourOfAKind(cards);
    if (fourOfAKind) {
        // Four of a Kind
        return {
            name: `Four of a Kind, ${fourOfAKind.cards[0].rank}s`,
            cards: fourOfAKind.cards,
            kicker: fourOfAKind.kickers[0],
        };
    }

    // Check for three of a kind and pair
    const threeOfAKind = getThreeOfAKind(cards);
    const pair = getPair(cards);
    if (threeOfAKind && pair) {
        // Full House
        return {
            name: `Full House of ${threeOfAKind.cards[0].rank}s over ${pair.cards[0].rank}s`,
            three: threeOfAKind.cards,
            two: pair.cards,
        };
    }

    if (flush) {
        // Flush
        return {
            name: `${flush.cards[0].rank}-High Flush of ${flush.suit}`,
            cards: flush.cards,
        };
    }

    // Check for straight
    const straight = getStraight(cards);
    if (straight) {
        // Straight
        return {
            name: `${straight[0].rank + '-High Straight'}`,
            cards: straight,
        };
    }

    if (threeOfAKind) {
        // Three of a Kind
        return {
            name: `Three of a Kind, ${threeOfAKind.cards[0].rank}s`,
            cards: threeOfAKind.cards,
            kickers: threeOfAKind.kickers.slice(0, 2),
        };
    }

    if (pair) {
        const additionalPair = getPair(pair.kickers);
        if (additionalPair) {
            // Two Pair
            return {
                name: `Two Pair, ${pair.cards[0].rank}s and ${additionalPair.cards[0].rank}s`,
                pairOne: pair.cards,
                pairTwo: additionalPair.cards,
                kicker: additionalPair.kickers[0],
            };
        } else {
            // Pair
            return {
                name: `Pair of ${pair.cards[0].rank}s`,
                cards: pair.cards,
                kickers: pair.kickers.slice(0, 3),
            };
        }
    }

    // High Card
    const highCard = getHighCard(cards);
    const sortedCards = sortByRank(cards);
    return {
        name: `${highCard.rank} High`,
        card: highCard,
        kickers: sortedCards.filter(card => card.value !== highCard.value).slice(0, 4),
    }
}