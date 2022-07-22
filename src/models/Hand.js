import { RANKS, HAND_RANKINGS } from '../constants';

import { getFourOfAKind, getHighCard, getPair, getThreeOfAKind, getFlush, getStraight, sortByRank } from './utils';

export default class Hand {
    // Private field declarations
    #cards;
    #activeCards;
    #shortName;
    #longName;
    #kickers;

    // Constructor
    constructor(cards) {
        this.#cards = sortByRank(cards); // sorted input cards
        this.#activeCards = []; // <= 5 cards that classify ranking
        this.#shortName = 'No Ranking'; // short name of hand ranking
        this.#longName = 'No Ranking'; // long name of hand ranking
        this.#kickers = []; // kickers of hand ranking in order of highest to lowest
        
        this.#evaluate();
    }


    // Returns the sorted array of cards considered
    getCards() {
        return this.#cards;
    }

    // Sets the cards of the hand and re-evaluates the ranking
    setCards(cards) {
        this.#cards = sortByRank(cards);
        this.#evaluate();
    }

    // Returns array of cards that classify ranking
    getActiveCards() {
        return this.#activeCards;
    }

    // Returns short name of hand ranking
    getShortName() {
        return this.#shortName;
    }

    // Returns long name of hand ranking
    getLongName() {
        return this.#longName;
    }

    // Returns array of kickers of hand ranking in order of highest to lowest
    getKickers() {
        return this.#kickers;
    }
    
    // Evaluates the hand ranking and sets the short name, long name, active cards, and kickers
    #evaluate() {
        // Check for flush
        const flush = getFlush(this.#cards);
        if (flush) {
            const straightFlush = getStraight(flush.cards);
            if (straightFlush) {
                if (straightFlush[0].value === RANKS.length - 1) {
                    // Royal Flush
                    this.#shortName = HAND_RANKINGS.ROYAL_FLUSH;
                    this.#longName = `${HAND_RANKINGS.ROYAL_FLUSH} of ${flush.suit}`;
                } else {
                    // Straight Flush
                    this.#shortName = HAND_RANKINGS.STRAIGHT_FLUSH;
                    this.#longName = `${straightFlush[0].rank}-High ${HAND_RANKINGS.STRAIGHT_FLUSH} of ${flush.suit}`;
                }
                this.#activeCards = straightFlush;
                return;
            }
        }
    
        // Check for four of a kind
        const fourOfAKind = getFourOfAKind(this.#cards);
        if (fourOfAKind) {
            // Four of a Kind
            this.#shortName = HAND_RANKINGS.FOUR_OF_A_KIND;
            this.#longName = `${HAND_RANKINGS.FOUR_OF_A_KIND}, ${fourOfAKind.cards[0].rank}s`;
            this.#activeCards = fourOfAKind.cards;
            this.#kickers = [fourOfAKind.kickers[0]];
            return;
        }
    
        // Check for three of a kind and pair
        const threeOfAKind = getThreeOfAKind(this.#cards);
        const pair = getPair(this.#cards);
        if (threeOfAKind && pair) {
            // Full House TODO: doesn't handle case of two sets of three of a kind
            this.#shortName = HAND_RANKINGS.FULL_HOUSE;
            this.#longName = `${HAND_RANKINGS.FULL_HOUSE} of ${threeOfAKind.cards[0].rank}s over ${pair.cards[0].rank}s`
            this.#activeCards = [...threeOfAKind.cards, ...pair.cards];
            return;
        }
    
        if (flush) {
            // Flush
            this.#shortName = HAND_RANKINGS.FLUSH;
            this.#longName = `${flush.cards[0].rank}-High ${HAND_RANKINGS.FLUSH} of ${flush.suit}`;
            this.#activeCards = flush.cards;
            return;
        }
    
        // Check for straight
        const straight = getStraight(this.#cards);
        if (straight) {
            // Straight
            this.#shortName = HAND_RANKINGS.STRAIGHT;
            this.#longName = `${straight[0].rank}-High ${HAND_RANKINGS.STRAIGHT}`;
            this.#activeCards = straight;
            return;
        }
    
        if (threeOfAKind) {
            // Three of a Kind
            this.#shortName = HAND_RANKINGS.THREE_OF_A_KIND;
            this.#longName = `${HAND_RANKINGS.THREE_OF_A_KIND}, ${threeOfAKind.cards[0].rank}s`;
            this.#activeCards = threeOfAKind.cards;
            this.#kickers = threeOfAKind.kickers.slice(0, 2);
            return;
        }
    
        if (pair) {
            const secondPair = getPair(pair.kickers);
            if (secondPair) {
                // Two Pair
                this.#shortName = HAND_RANKINGS.TWO_PAIR;
                this.#longName = `${HAND_RANKINGS.TWO_PAIR}, ${pair.cards[0].rank}s and ${secondPair.cards[0].rank}s`;
                this.#activeCards = [...pair.cards, ...secondPair.cards];
                this.#kickers = [secondPair.kickers[0]];
                return;
            } 

            // Pair
            this.#shortName = HAND_RANKINGS.PAIR;
            this.#longName = `${HAND_RANKINGS.PAIR} of ${pair.cards[0].rank}s`;
            this.#activeCards = pair.cards;
            this.#kickers = pair.kickers.slice(0, 3);
            return;
        }
    
        // High Card
        const highCard = getHighCard(this.#cards);
        this.#shortName = HAND_RANKINGS.HIGH_CARD;
        this.#longName = `${highCard.rank} High`;
        this.#activeCards = [highCard];
        this.#kickers = this.#cards.filter(card => card.value !== highCard.value).slice(0, 4);
        return;
    }
}