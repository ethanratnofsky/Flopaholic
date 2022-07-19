import React, { useEffect, useReducer, useState } from 'react';
import { createRoot } from 'react-dom/client';

// API
import Deck from './api/Deck';

// Styles
import './index.css';

// Components
import Card from './components/Card';

// Constants
const BOARD_SIZE = 5;
const HOLE_SIZE = 2;
const ROUNDS = {
    'Pre-Flop': 0,
    'Flop': 3,
    'Turn': 4,
    'River': 5
}

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
    const [round, setRound] = useState(0);
    const [roundName, setRoundName] = useState('');
    const [numShown, setNumShown] = useState(0);

    // Custom forceUpdate function
    const [, forceUpdate] = useReducer(prev => !prev, false);

    // Update state values
    useEffect(() => {
        setRoundName(Object.keys(ROUNDS)[round]);
        setNumShown(ROUNDS[roundName]);
    }, [round, roundName]);

    // Reset board and hole
    const handleReset = () => {
        newHand();
        setRound(0);
        forceUpdate(); // Component won't re-render without this if reset on initial round
    }

    // Update round
    const handleNextRound = () => {
        if (round === Object.keys(ROUNDS).length - 1) {
            handleReset();
        } else {
            setRound(prev => prev + 1);
        }
    }

    // Render
    return (
        <div className='container' >
            <div className='board-container' >
                <h2>Board ({roundName})</h2>
                <ul className='board'>
                    {board.map((card, index) => {
                        let { rank, suit } = card;

                        if (index >= numShown) {
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
                <button onClick={handleNextRound} >Next Round</button>
                <button onClick={handleReset} >Reset</button>
            </div>
            <div className='hole-container' >
                <h2>Hole</h2>
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