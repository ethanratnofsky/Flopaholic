import React, { useEffect, useReducer, useState } from 'react';

// API
import { board, calculateHandProbability, deck, hand, hole, newHand, redealUntil } from '../utils';

// Styles
import './App.css';

// Components
import CardRow from './CardRow';
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
    const [useCardImages, setUseCardImages] = useState(false);
    const [numColors, setNumColors] = useState(2);
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
                    <div className='option'>
                        <input id='card-image-option' type='checkbox' checked={!useCardImages} onChange={() => setUseCardImages(prev => !prev)} />
                        <label htmlFor='card-image-option'>Use Simple Cards</label>
                    </div>
                    <div className='option'>
                        <select id='num-colors-option' value={numColors} onChange={(e) => setNumColors(Number(e.target.value))}>
                            <option value={1}>1-Color</option>
                            <option value={2}>2-Color</option>
                            <option value={4}>4-Color</option>
                        </select>
                        <label htmlFor='num-colors-option'>Deck Style</label>
                    </div>
                    <div className='option'>
                        <input id='auto-evaluate-option' type='checkbox' checked={autoEvaluate} onChange={() => setAutoEvaluate(prev => !prev)} />
                        <label htmlFor='auto-evaluate-option'>Auto Evaluate</label>
                    </div>
                    <div className='option'>
                        <input id='show-board-option' type='checkbox' checked={showBoard} onChange={() => setShowBoard(prev => !prev)} />
                        <label htmlFor='show-board-option'>Show Board</label>
                    </div>
                    <div className='option'>
                        <input id='show-probabilities-option' type='checkbox' checked={showProbabilities} onChange={() => setShowProbabilities(prev => !prev)} />
                        <label htmlFor='show-probabilities-option'>Show Probabilities</label>
                    </div>
                    <h4>Redeal Until...</h4>
                    {Object.values(HAND_RANKINGS).map((ranking, index) => (
                        <button key={index} onClick={() => {redealUntil(ranking); setShowBoard(true); setAutoEvaluate(true); forceUpdate();}}>{ranking}</button>
                    ))}
                </div>
                <div className='gear-container'>
                    <span className='gear' onClick={() => setShowOptions(prev => !prev)}>⚙</span>
                </div>
            </div>
            <ProbabilitiesPanel probabilities={calculateHandProbability(hand, [...deck.getCards(), ...board.slice(round.numCardsShown)])} hidden={!showProbabilities} />
            <div className='board-container'>
                <h2>BOARD{showRanking && ` (${hand.getLongName()})`}</h2>
                <div className='round-name'>{showBoard ? '---' : round.name}</div>
                <CardRow cards={board} numCardsShown={showBoard ? board.length : round.numCardsShown} useImages={useCardImages} numColors={numColors} />
            </div>
            <div className='button-container'>
                <button className='btn' onClick={handleNextRound} disabled={showBoard}>Next Round</button>
                <button className='btn' onClick={handleReset}>New Deal</button>
                <button className='btn' onClick={handleShowRanking} disabled={autoEvaluate}>Show Hand Ranking</button>
            </div>
            <div className='hole-container'>
                <h2>HOLE</h2>
                <CardRow cards={hole} useImages={useCardImages} numColors={numColors} />
            </div>
        </div>
    );
};

export default App;