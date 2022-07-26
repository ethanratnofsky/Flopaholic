import { HAND_RANKINGS, RANKS, SUITS } from '../constants';

import { getFourOfAKind, getHighCard, getPair, getThreeOfAKind, getFlush, getStraight, groupByRank, groupBySuit, sortByRank } from './utils';

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
                if (straightFlush[0].getValue() === RANKS.length - 1) {
                    // Royal Flush
                    this.#shortName = HAND_RANKINGS.ROYAL_FLUSH;
                    this.#longName = `${HAND_RANKINGS.ROYAL_FLUSH} of ${flush.suit}`;
                } else {
                    // Straight Flush
                    this.#shortName = HAND_RANKINGS.STRAIGHT_FLUSH;
                    this.#longName = `${straightFlush[0].getRank()}-High ${HAND_RANKINGS.STRAIGHT_FLUSH} of ${flush.suit}`;
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
            this.#longName = `${HAND_RANKINGS.FOUR_OF_A_KIND}, ${fourOfAKind.cards[0].getRank()}s`;
            this.#activeCards = fourOfAKind.cards;
            this.#kickers = [fourOfAKind.kickers[0]];
            return;
        }
    
        // Check for three of a kind and paired kicker
        const threeOfAKind = getThreeOfAKind(this.#cards);
        if (threeOfAKind) {
            // Check for highest paired kicker
            const kickers = threeOfAKind.kickers;
            for (let i = 0; i < kickers.length - 1; i++) {
                if (kickers[i].getValue() === kickers[i + 1].getValue()) {
                    // Full House
                    this.#shortName = HAND_RANKINGS.FULL_HOUSE;
                    this.#longName = `${HAND_RANKINGS.FULL_HOUSE} of ${threeOfAKind.cards[0].getRank()}s over ${kickers[i].getRank()}s`
                    this.#activeCards = [...threeOfAKind.cards, kickers[i], kickers[i + 1]];
                    return;
                }
            }
        }
    
        if (flush) {
            // Flush
            this.#shortName = HAND_RANKINGS.FLUSH;
            this.#longName = `${flush.cards[0].getRank()}-High ${HAND_RANKINGS.FLUSH} of ${flush.suit}`;
            this.#activeCards = flush.cards;
            return;
        }
    
        // Check for straight
        const straight = getStraight(this.#cards);
        if (straight) {
            // Straight
            this.#shortName = HAND_RANKINGS.STRAIGHT;
            this.#longName = `${straight[0].getRank()}-High ${HAND_RANKINGS.STRAIGHT}`;
            this.#activeCards = straight;
            return;
        }
    
        if (threeOfAKind) {
            // Three of a Kind
            this.#shortName = HAND_RANKINGS.THREE_OF_A_KIND;
            this.#longName = `${HAND_RANKINGS.THREE_OF_A_KIND}, ${threeOfAKind.cards[0].getRank()}s`;
            this.#activeCards = threeOfAKind.cards;
            this.#kickers = threeOfAKind.kickers.slice(0, 2);
            return;
        }
    
        const pair = getPair(this.#cards);
        if (pair) {
            const secondPair = getPair(pair.kickers);
            if (secondPair) {
                // Two Pair
                this.#shortName = HAND_RANKINGS.TWO_PAIR;
                this.#longName = `${HAND_RANKINGS.TWO_PAIR}, ${pair.cards[0].getRank()}s and ${secondPair.cards[0].getRank()}s`;
                this.#activeCards = [...pair.cards, ...secondPair.cards];
                this.#kickers = [secondPair.kickers[0]];
                return;
            } 

            // Pair
            this.#shortName = HAND_RANKINGS.PAIR;
            this.#longName = `${HAND_RANKINGS.PAIR} of ${pair.cards[0].getRank()}s`;
            this.#activeCards = pair.cards;
            this.#kickers = pair.kickers.slice(0, 3);
            return;
        }
    
        // High Card
        const highCard = getHighCard(this.#cards);
        this.#shortName = HAND_RANKINGS.HIGH_CARD;
        this.#longName = `${highCard.getRank()} High`;
        this.#activeCards = [highCard];
        this.#kickers = this.#cards.filter(card => card.getValue() !== highCard.getValue()).slice(0, 4);
        return;
    }

    // Calculates the probability of a specific hand ranking given the number of hidden cards
    calculateRankingProbability(ranking, numCardsHidden) {
        // Ensure valid ranking
        if (!Object.values(HAND_RANKINGS).includes(ranking))
            throw new Error(`Invalid ranking: ${ranking}`);

        const cards = this.#cards;
        const numCardsShown = cards.length;

        const maxCardsPerRank = SUITS.length;
        const maxCardsPerSuit = RANKS.length;
        const maxNumCards = maxCardsPerRank * maxCardsPerSuit;

        const cardsGroupedByRank = groupByRank(cards);
        const cardsGroupedBySuit = groupBySuit(cards);

        // TODO: Implement
        switch (ranking) {
            case HAND_RANKINGS.HIGH_CARD:
                // TODO:
                if (Object.values(cardsGroupedByRank).some(cards => cards.length > 1)) {
                    // If there is already more than one card of the same rank, the hand cannot be a high card
                    return 0;
                } else {
                    // Calculate probability of all shown and hidden cards being different ranks
                    let probability = 1;
                    for (let i = 0; i < numCardsHidden; i++) {
                        probability *= 1 - ((((numCardsShown + i) * (maxCardsPerRank - 1))) / (maxNumCards - (numCardsShown + i)));
                    }
                    return probability;
                }
                break;
            case HAND_RANKINGS.PAIR:
                if (Object.values(cardsGroupedByRank).some(cards => cards.length > 2)) {
                    // If there is already more than two cards of the same rank, the hand cannot be a high card
                    return 0;
                } else if (Object.values(cardsGroupedByRank).some(cards => cards.length === 2)) {
                    // Calculate probability that hidden cards are different ranks than shown cards and from each other
                } else {
                    // Calculate probability that exactly one shown card is paired or one hidden card is paired
                }
                return 0;
                break;
            case HAND_RANKINGS.TWO_PAIR:
                return 0;
                break;
            case HAND_RANKINGS.THREE_OF_A_KIND:
                return 0;
                break;
            case HAND_RANKINGS.STRAIGHT:
                return 0;
                break;
            case HAND_RANKINGS.FLUSH:
                return 0;
                break;
            case HAND_RANKINGS.FULL_HOUSE:
                return 0;
                break;
            case HAND_RANKINGS.FOUR_OF_A_KIND:
                return 0;
                break;
            case HAND_RANKINGS.STRAIGHT_FLUSH:
                return 0;
                break;
            case HAND_RANKINGS.ROYAL_FLUSH:
                return 0;
                break;
            default:
                // Should never get here because of ranking validation
                throw new Error('An unexpected error occurred when processing a hand ranking: ', ranking);
        }
    }
}