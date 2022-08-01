import React from 'react';

import './TitleScreen.css';

import { MAX_TIME_LIMIT, TIME_LIMIT } from '../../constants';

const TitleScreen = ({ onStart, timeLimit, setTimeLimit, useCardImages, setUseCardImages }) => {
    const handleStart = () => {
        // Check for valid time limit
        if (timeLimit <= 0) {
            alert('💥 Mission: Impossible! Please choose a time limit greater than 0.');
            return;
        }
        
        onStart();
    }

    const handleTimeLimitChange = (event) => {
        const input = parseInt(event.target.value) || 0;
        setTimeLimit(input > MAX_TIME_LIMIT ? MAX_TIME_LIMIT : input); // Handle time limit exceeding max
    }

    return (
        <div className='title-screen-container'>
            <h1 className='game-title'>Flopaholic, The Game</h1>
            <div className='intro-container'>
                <h3 className='intro-title'>Introduction</h3>
                <hr />
                <p className='intro-content'>
                    Challenge your reaction time and poker hand recognition skills with a game of Flopaholic.
                    Depending on the difficulty level, you will have a limited time to recognize the ranking of the hand you are dealt.
                    Correctly identify as many Texas Hold'em poker hands as you can, and set a personal record or challenge your friends!
                </p>
                <hr />
                <div className='difficulty-container'>
                    <h3 className='intro-title'>Select Difficulty</h3>
                    <div className='button-container'>
                        {Object.keys(TIME_LIMIT).map((difficulty, index) => {
                            return (
                                <button
                                    key={index}
                                    className={`btn ${difficulty.toLowerCase()}${timeLimit === TIME_LIMIT[difficulty] ? ' selected' : ''}`}
                                    onClick={() => setTimeLimit(TIME_LIMIT[difficulty])}
                                >
                                {`${difficulty} (${TIME_LIMIT[difficulty]}s)`}
                                </button>
                            );
                        })}
                    </div>
                    <label>
                        Time Limit: 
                        <input 
                            className='time-limit'
                            type='number'
                            value={timeLimit}
                            onChange={handleTimeLimitChange}
                            min={1}
                            max={3599}
                            style={{ width: (timeLimit.toString().length + 1.5) + 'em' }}
                        />
                        second{timeLimit === 1 ? '' : 's'}
                    </label>
                    <label>
                        <input type='checkbox' checked={!useCardImages} onChange={() => setUseCardImages(prev => !prev)} />
                        Use Simple Cards
                    </label>
                </div>
            </div>
            <button className='btn start-btn' onClick={handleStart}>Start</button>
        </div>
    );
}

export default TitleScreen;