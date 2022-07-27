import React, { useEffect, useReducer, useState } from 'react';

// API
import { board, calculateHandProbability, deck, hand, hole, newHand, redealUntil } from '../utils';

// Styles
import './App.css';

// Components
import Card from './Card';
import ProbabilitiesPanel from './ProbabilitiesPanel';

// Constants
import { BOARD_SIZE, HAND_RANKINGS, ROUNDS } from '../constants';

// Set up initial hand
newHand();

// App component
const App = () => {
    // State
    const [roundNum, setRoundNum] = useState(0);
    const [round, setRound] = useState(ROUNDS[roundNum]);
    const [showRanking, setShowRanking] = useState(false);

    const [showOptions, setShowOptions] = useState(false);
    const [autoEvaluate, setAutoEvaluate] = useState(false);
    const [showBoard, setShowBoard] = useState(false);
    const [showProbabilities, setShowProbabilities] = useState(false);

    // Function used to force a re-render (use every time hand changes)
    const [, forceUpdate] = useReducer(prev => !prev, false);

    // Update round
    const handleNextRound = () => {
        if (roundNum === ROUNDS.length - 1) {
            handleReset();
        } else {
            setRoundNum(prev => prev + 1);
        }
    }

    // If round number changes, update round
    useEffect(() => {
        setRound(ROUNDS[roundNum]);
    }, [roundNum]);

    // Reset hand and state, then re-render
    const handleReset = () => {
        newHand();
        if (showBoard) hand.setCards([...hole, ...board]);
        forceUpdate();
        setRoundNum(0);
        setShowRanking(false || autoEvaluate);
    }

    // Show hand ranking name
    const handleShowRanking = () => {
        setShowRanking(true);
    }

    // If round changes, update hand
    useEffect(() => {
        hand.setCards([...hole, ...board.slice(0, round.numCardsShown)]);
        forceUpdate();
        setShowRanking(false || autoEvaluate);
    }, [round])

    // If show board option is toggled, update hand
    useEffect(() => {
        hand.setCards([...hole, ...board.slice(0, showBoard ?  BOARD_SIZE : round.numCardsShown)]);
        forceUpdate();
        setShowRanking(false || autoEvaluate);
    }, [showBoard])

    // If auto evaluate option is toggled, update show ranking state
    useEffect(() => {
        setShowRanking(autoEvaluate);
    }, [autoEvaluate])

    // Render
    return (
        <div className='container'>
            <div className='options-container'>
                <div className={`options-panel${showOptions ? ' slide-right' : ' slide-left'}`}>
                    <h3 className='options-title'>Options</h3>
                    <label>
                        <input type='checkbox' checked={autoEvaluate} onChange={() => setAutoEvaluate(prev => !prev)} />
                        Auto-Evaluate
                    </label>
                    <label>
                        <input type='checkbox' checked={showBoard} onChange={() => setShowBoard(prev => !prev)} />
                        Show Board
                    </label>
                    <label>
                        <input type='checkbox' checked={showProbabilities} onChange={() => setShowProbabilities(prev => !prev)} />
                        Show Probabilities
                    </label>
                    <h4>Redeal Until...</h4>
                    {Object.values(HAND_RANKINGS).map((ranking, index) => (
                        <button key={index} onClick={() => {redealUntil(ranking); setShowBoard(true); setAutoEvaluate(true); forceUpdate();}}>{ranking}</button>
                    ))}
                </div>
                <div className='gear-container'>
                    <span className='gear' onClick={() => setShowOptions(prev => !prev)}>⚙</span>
                </div>
            </div>
            <ProbabilitiesPanel probabilities={calculateHandProbability(hand, [...deck.cards, ...board.slice(round.numCardsShown)])} hidden={!showProbabilities} />
            <div className='board-container'>
                <h2>BOARD{showRanking && ` (${hand.getLongName()})`}</h2>
                <div className='round-name'>{showBoard ? '---' : round.name}</div>
                <ul className='board'>
                    {board.map((card, index) => {
                        let { rank, suit } = card;

                        // If card is hidden, don't pass rank and suit
                        if (!showBoard && index >= round.numCardsShown) {
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
                <button className='btn' onClick={handleNextRound} disabled={showBoard}>Next Round</button>
                <button className='btn' onClick={handleReset}>New Deal</button>
                <button className='btn' onClick={handleShowRanking} disabled={autoEvaluate}>Show Hand Ranking</button>
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