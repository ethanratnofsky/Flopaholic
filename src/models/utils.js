import { RANKS, SUITS } from '../constants';

/**
 * Returns a copy of an array of cards that are sorted by rank.
 * Ties are broken by order of appearance.
 * @param {Array[Card]} cards - An array of cards.
 * @returns {Array[Card]} A copy of the array of cards sorted by rank.
 */
export const sortByRank = cards => [...cards].sort((a, b) => b.getValue() - a.getValue());

/**
 * Groups an array of cards by suit.
 * @param {Array[Card]} cards - An array of cards.
 * @returns {Object} A map of suit to array of cards.
 */
export const groupBySuit = cards => {
    let groups = {};
    for (const suit of SUITS) {
        groups[suit] = cards.filter(card => card.getSuit() === suit);
    }
    return groups;
}

/**
 * Groups an array of cards by rank.
 * @param {Array[Card]} cards - An array of cards.
 * @returns {Object} A map of rank to array of cards.
 */
export const groupByRank = cards => {
    let groups = {};
    for (const rank of RANKS) {
        groups[rank] = cards.filter(card => card.getRank() === rank);
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
        if (group.length === 4 && group[0].getValue() > value) {
            value = group[0].getValue();
            quads = group;
        }
    }
    
    // Four of a kind was found
    if (value >= 0) {
        const kickers = sortedCards.filter(card => card.getValue() !== value);
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
    // Sort cards by rank and filter out cards with the same rank
    const sortedCards = sortByRank(cards).filter((card, index, cards) => index === 0 || card.getValue() !== cards[index - 1].getValue());

    // Check if there are 5 cards in a row
    for (let i = 0; i < sortedCards.length - 4; i++) {
        const sequence = sortedCards.slice(i, i + 5);
        const [ card_1, card_2, card_3, card_4, card_5 ] = sequence;

        if (card_1.getValue() === card_2.getValue() + 1 &&
            card_2.getValue() === card_3.getValue() + 1 &&
            card_3.getValue() === card_4.getValue() + 1 &&
            card_4.getValue() === card_5.getValue() + 1) {
            return sequence;
        }
    }

    // Check for Ace-low straight
    if (allowWheel) {
        const numCards = sortedCards.length;
        if (sortedCards[0].getValue() === RANKS.length - 1 &&
            sortedCards[numCards - 1].getValue() === 0 &&
            sortedCards[numCards - 2].getValue() === 1 &&
            sortedCards[numCards - 3].getValue() === 2 &&
            sortedCards[numCards - 4].getValue() === 3) {
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
        if (group.length === 3 && group[0].getValue() > value) {
            value = group[0].getValue();
            trips = group;
        }
    }
    
    // Three of a kind was found
    if (value >= 0) {
        const kickers = sortedCards.filter(card => card.getValue() !== value);
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
        if (group.length === 2 && group[0].getValue() > value) {
            value = group[0].getValue();
            pair = group;
        }
    }

    // Pair was found
    if (value >= 0) {
        const kickers = sortedCards.filter(card => card.getValue() !== value);
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
    let highestValue = highest.getValue();
    for (const card of cards) {
        let currentValue = card.getValue();
        if (card.getValue() > highestValue) {
            highest = card;
            highestValue = currentValue;
        }
    }
    return highest;
}