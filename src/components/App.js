import React, { useEffect, useReducer, useState } from 'react';

// API
import { board, hand, hole, newHand, redealUntil } from '../utils';

// Styles
import './App.css';

// Components
import Card from './Card';

// Constants
import { DEBUG, HAND_RANKINGS, ROUNDS } from '../constants';

// Set up initial hand
newHand();

// App component
const App = () => {
    // State
    const [roundNum, setRoundNum] = useState(DEBUG ? 3 : 0);
    const [round, setRound] = useState(ROUNDS[roundNum]);
    const [handRankingName, setHandRankingName] = useState('');

    // Function used to force a re-render
    const [, forceUpdate] = useReducer(prev => !prev, false);

    // Update round
    const handleNextRound = () => {
        if (roundNum === ROUNDS.length - 1) {
            handleReset();
        } else {
            setRoundNum(prev => prev + 1);
        }
    }

    // Reset hand and state, then re-render
    const handleReset = () => {
        newHand();
        setRoundNum(0);
        setHandRankingName(DEBUG ? hand.getLongName() : '');
        forceUpdate(); // If round doesn't change and hand ranking doesn't change but cards are different, app won't re-render new cards without this
    }

    // Update hand ranking name
    const updateHandRankingName = () => {
        setHandRankingName(hand.getLongName());
    }

    // If round number changes, update round
    useEffect(() => {
        setRound(ROUNDS[roundNum]);
    }, [roundNum]);

    // If round changes, update hand and hand ranking name
    useEffect(() => {
        hand.setCards([...hole, ...board.slice(0, round.numCardsShown)]);
        setHandRankingName(DEBUG ? hand.getLongName() : '');
    }, [round])

    // Render
    return (
        <div className='container'>
            {DEBUG && (
                <div className='debug-button-container'>
                    <label>Redeal Until...</label>
                    {Object.values(HAND_RANKINGS).map((ranking, index) => (
                        <button key={index} onClick={() => {redealUntil(ranking); setRoundNum(3); updateHandRankingName(); forceUpdate();}}>{ranking}</button>
                    ))}
                </div>
            )}
            <div className='board-container'>
                <h2>BOARD{handRankingName && ` (${handRankingName})`}</h2>
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
                <button className='btn' onClick={updateHandRankingName}>Evaluate Hand</button>
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

export default App;