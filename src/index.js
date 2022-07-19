import React, { useEffect, useReducer, useState } from 'react';
import { createRoot } from 'react-dom/client';

// Classes
import Deck from './card-deck/Deck';

// Styles
import './index.css';

// Components
import Card from './components/Card';
import CardBack from './components/CardBack';

// Constants
const BOARD_SIZE = 5;
const POCKET_SIZE = 2;
const ROUNDS = {
    'Pre-Flop': 0,
    'Flop': 3,
    'Turn': 4,
    'River': 5
}

// Set up board and pocket
const deck = new Deck();

let pocket = [];
let board = [];

const newHand = () => {
    // Reset deck
    deck.reset();
    deck.shuffle();

    // Reset board
    board = [];
    for (let i = 0; i < BOARD_SIZE; i++) {
        board.push(deck.draw());
    }

    // Reset pocket
    pocket = [];
    for (let i = 0; i < POCKET_SIZE; i++) {
        pocket.push(deck.draw());
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

    // Reset board and pocket
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
        <div>
            <div>
                <h2>Board ({roundName})</h2>
                <ul className='board'>
                    {board.map((card, index) => (
                            <li key={index}>
                                <div className='card-container'>
                                    {index < numShown ? <Card rank={card.rank} suit={card.suit} /> : <CardBack />}
                                </div>
                            </li>
                        )
                    )}
                </ul>
            </div>
            <button onClick={handleNextRound} >Next Round</button>
            <button onClick={handleReset} >Reset</button>
            <div>
                <h2>Pocket</h2>
                <ul className='pocket'>
                    {pocket.map((card, index) => (
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