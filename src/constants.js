export const RANKS = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King', 'Ace'];
export const SUITS = ['Clubs', 'Diamonds', 'Hearts', 'Spades'];
export const HAND_RANKINGS = {
    HIGH_CARD: 'High Card',
    PAIR: 'Pair',
    TWO_PAIR: 'Two Pair',
    THREE_OF_A_KIND: 'Three of a Kind',
    STRAIGHT: 'Straight',
    FLUSH: 'Flush',
    FULL_HOUSE: 'Full House',
    FOUR_OF_A_KIND: 'Four of a Kind',
    STRAIGHT_FLUSH: 'Straight Flush',
    ROYAL_FLUSH: 'Royal Flush',
};

export const DEBUG = false;
export const BOARD_SIZE = 5;
export const HOLE_SIZE = 2;
export const ROUNDS = [
    {
        name: 'Pre-Flop',
        numCardsShown: 0
    },
    {
        name: 'Flop',
        numCardsShown: 3
    },
    {
        name: 'Turn',
        numCardsShown: 4
    },
    {
        name: 'River',
        numCardsShown: 5
    }
];