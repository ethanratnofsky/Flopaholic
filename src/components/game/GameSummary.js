import React from 'react';

import './GameSummary.css';

const GameSummary = ({ timeLimit, timeLimitReached, streak, answerTimes, message, onClose, onRestart }) => {
    const averageAnswerTime = (answerTimes.reduce((acc, time) => acc + time, 0) / answerTimes.length) / 1000 || 0;

    return (
        <div className='game-summary-container'>
            <span className='close' onClick={onClose}>X</span>
            <h1 className='game-summary-title'>GAME OVER</h1>
            <h3 className='game-summary-subtitle'>{timeLimitReached ? '⌛️ Time is up!' : '❌ Incorrect!'}</h3>
            <h4 className='game-summary-message'>{message}</h4>
            <div className='game-summary-stats'>
                <ul className='game-summary-stats-names'>
                    <li className='stat'>Streak: </li>
                    <li className='stat'>⏳ Time Limit: </li>
                    <li className='stat'>⏱ Avg. Answer Time: </li>
                </ul>
                <ul className='game-summary-stats-values'>
                    <li className='stat'>{streak} 🔥</li>
                    <li className='stat'>{timeLimit} seconds</li>
                    <li className='stat'>{averageAnswerTime.toFixed(2)} seconds</li>
                </ul>
            </div>
            <div className='button-container'>
                <button className='btn' onClick={onRestart}>Restart</button>
                <button className='btn' onClick={() => document.location.reload()}>Main Menu</button>
            </div>
        </div>
    )
}

export default GameSummary;