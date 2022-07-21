import React, { useEffect, useReducer, useState } from 'react';
import { createRoot } from 'react-dom/client';

// API
import Deck from './api/Deck';
import { evaulateHand, getFourOfAKind, getHighCard, getPair, getThreeOfAKind, getFlush, getStraight } from './api/api';

// Styles
import './index.css';

// Components
import Card from './components/Card';

// Constants
const DEBUG = false;
const BOARD_SIZE = 5;
const HOLE_SIZE = 2;
const ROUNDS = [
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

// Set up board and hole
const deck = new Deck();

let board = [];
let hole = [];

const newHand = () => {
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
}

newHand();

// App component
const App = () => {
    // State
    const [roundNum, setRoundNum] = useState(DEBUG ? 3 : 0);
    const [round, setRound] = useState(ROUNDS[roundNum]);
    const [handRankName, setHandRankName] = useState('');

    // Custom forceUpdate function
    const [, forceUpdate] = useReducer(prev => !prev, false);

    // Reset board and hole
    const handleReset = () => {
        newHand();
        setRoundNum(0);
        setHandRankName('');
        forceUpdate(); // Component won't re-render without this if reset on initial round
    }

    // Update round
    const handleNextRound = () => {
        if (roundNum === ROUNDS.length - 1) {
            handleReset();
        } else {
            setRoundNum(prev => prev + 1);
        }
    }

    // FOR DEBUGGING FOUR OF A KIND
    const redealUntilFourOfAKind = () => {
        let fourOfAKind;
        let deals = [];

        do {
            newHand();
            fourOfAKind = getFourOfAKind([...board, ...hole]);
            deals.push({ board, hole });
        } while (!fourOfAKind);

        forceUpdate();
        console.log(`Four of A Kind, ${fourOfAKind.cards[0].rank}s`);
        console.log(fourOfAKind);
        console.log(`Redealt ${deals.length} time${deals.length === 1 ? '' : 's'}`);
        console.log(deals);
    }

    // FOR DEBUGGING FLUSH
    const redealUntilFlush = () => {
        let flush;
        let deals = [];

        do {
            newHand();
            flush = getFlush([...board, ...hole]);
            deals.push({ board, hole });
        } while (!flush);

        forceUpdate();
        console.log(`${flush.cards[0].rank}-High Flush of ${flush.suit}`);
        console.log(flush);
        console.log(`Redealt ${deals.length} time${deals.length === 1 ? '' : 's'}`);
        console.log(deals);
    }

    // FOR DEBUGGING STRAIGHT
    const redealUntilStraight = () => {
        let straight;
        let deals = [];

        do {
            newHand();
            straight = getStraight([...board, ...hole]);
            deals.push({ board, hole });
        } while (!straight);

        forceUpdate();
        console.log(`${straight[0].rank}-High Straight`);
        console.log(straight);
        console.log(`Redealt ${deals.length} time${deals.length === 1 ? '' : 's'}`);
        console.log(deals);
    }

    // FOR DEBUGGING THREE OF A KIND
    const redealUntilThreeOfAKind = () => {
        let threeOfAKind;
        let deals = [];

        do {
            newHand();
            threeOfAKind = getThreeOfAKind([...board, ...hole]);
            deals.push({ board, hole });
        } while (!threeOfAKind);

        forceUpdate();
        console.log(`Three of A Kind, ${threeOfAKind.cards[0].rank}s`);
        console.log(threeOfAKind);
        console.log(`Redealt ${deals.length} time${deals.length === 1 ? '' : 's'}`);
        console.log(deals);
    }

    // FOR DEBUGGING PAIR
    const redealUntilPair = () => {
        let pair;
        let deals = [];

        do {
            newHand();
            pair = getPair([...board, ...hole]);
            deals.push({ board, hole });
        } while (!pair);

        forceUpdate();
        console.log(`Pair of ${pair.cards[0].rank}s`);
        console.log(pair);
        console.log(`Redealt ${deals.length} time${deals.length === 1 ? '' : 's'}`);
        console.log(deals);
    }

    // FOR DEBUGGING HIGH CARD
    const redealUntilHighCard = () => {
        newHand();
        const highCard = getHighCard([...board, ...hole]);

        forceUpdate();
        console.log(`${highCard.rank} High`);
        console.log(highCard);
    }

    const handleEvaluateHand = () => {
        const handRank = evaulateHand([...board, ...hole]);
        setHandRankName(roundNum === 3 ? handRank.name : 'Nice Try 😉');
    }

    // Update round state
    useEffect(() => {
        setRound(ROUNDS[roundNum]);
        setHandRankName('');
    }, [roundNum]);

    if (DEBUG) handleEvaluateHand();

    // Render
    return (
        <div className='container'>
            {DEBUG && (
                <div className='debug-button-container'>
                    <label>Redeal Until...</label>
                    <button onClick={redealUntilFourOfAKind}>Four of A Kind</button>
                    <button onClick={redealUntilFlush}>Flush</button>
                    <button onClick={redealUntilStraight}>Straight</button>
                    <button onClick={redealUntilThreeOfAKind}>Three of A Kind</button>
                    <button onClick={redealUntilPair}>Pair</button>
                    <button onClick={redealUntilHighCard}>High Card</button>
                </div>
            )}
            <div className='board-container'>
                <h2>BOARD {handRankName && `(${handRankName})`}</h2>
                <div className='round-name'>{round.name}</div>
                <ul className='board'>
                    {board.map((card, index) => {
                        let { rank, suit } = card;

                        if (index >= round.numCardsShown) {
                            rank = suit = null;
                        }

                        return (
                            <li key={index}>
                                <div className='card-container'>
                                    <Card rank={rank} suit={suit} />
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </div>
            <div className='button-container'>
                <button className='btn' onClick={handleNextRound}>Next Round</button>
                <button className='btn' onClick={handleReset}>Reset</button>
                <button className='btn' onClick={handleEvaluateHand}>Evaluate Hand</button>
            </div>
            <div className='hole-container'>
                <h2>HOLE</h2>
                <ul className='hole'>
                    {hole.map((card, index) => (
                            <li key={index}>
                                <div className='card-container'>
                                    <Card rank={card.rank} suit={card.suit} />
                                </div>
                            </li>
                        )
                    )}
                </ul>
            </div>
        </div>
    );
};

// Mount app
const container = document.getElementById('app');
const root = createRoot(container);
root.render(<App />);

export default App;