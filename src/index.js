import React, { useEffect, useReducer, useState } from 'react';
import { createRoot } from 'react-dom/client';

// API
import { board, hand, hole, newHand, redealUntil } from './utils';

// Styles
import './index.css';

// Components
import Card from './components/Card';

// Constants
import { DEBUG, HAND_RANKINGS, ROUNDS } from './constants';

// Set up new hand
newHand();

// App component
const App = () => {
    // State
    const [roundNum, setRoundNum] = useState(DEBUG ? 3 : 0);
    const [round, setRound] = useState(ROUNDS[roundNum]);
    const [handRankingName, setHandRankingName] = useState('');

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

    // Get hand rank name
    const handleEvaluateHand = () => {
        setHandRankingName(hand.getLongName());
        forceUpdate(); // Component won't re-render without this if reset on initial round
    }

    // Update state upon round change
    useEffect(() => {
        setRound(ROUNDS[roundNum]); // set round
        setHandRankingName(''); // reset hand ranking name

        // Update hand
        switch (roundNum) {
            case 1: // Flop
                hand.addCards(board.slice(0, 3));
                break;
            case 2: // Turn
                hand.addCards([board[3]]);
                break;
            case 3: // River
                hand.addCards([board[4]]);
                break;
        }

        if (DEBUG) handleEvaluateHand(); // always show hand ranking if in debug mode
    }, [roundNum]);

    // Render
    return (
        <div className='container'>
            {DEBUG && (
                <div className='debug-button-container'>
                    <label>Redeal Until...</label>
                    {Object.values(HAND_RANKINGS).map((ranking, index) => (
                        <button key={index} onClick={() => {redealUntil(ranking); handleEvaluateHand();}}>{ranking}</button>
                    ))}
                </div>
            )}
            <div className='board-container'>
                <h2>BOARD {handRankingName && `(${handRankingName})`}</h2>
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