import React, { useEffect, useReducer, useState } from 'react';
import { createRoot } from 'react-dom/client';

// API
import Deck from './api/Deck';
import { getFlush, getStraight } from './api/api';

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

    // Custom forceUpdate function
    const [, forceUpdate] = useReducer(prev => !prev, false);

    // Reset board and hole
    const handleReset = () => {
        newHand();
        setRoundNum(0);
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
        console.log(`Redealt ${deals.length} times`);
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
        console.log(`Redealt ${deals.length} times`);
        console.log(deals);
    }

    // Update round state
    useEffect(() => {
        setRound(ROUNDS[roundNum]);
    }, [roundNum]);

    // Render
    return (
        <div className='container'>
            {DEBUG && (
                <div className='debug-button-container'>
                    <label>Redeal Until...</label>
                    <button onClick={redealUntilFlush}>Flush</button>
                    <button onClick={redealUntilStraight}>Straight</button>
                </div>
            )}
            <div className='board-container'>
                <h2>BOARD</h2>
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