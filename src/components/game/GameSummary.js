import React from 'react';

import './GameSummary.css';

const GameSummary = ({ timeLimit, streak, answerTimes, message, onClose }) => {
    const averageAnswerTime = (answerTimes.reduce((acc, time) => acc + time, 0) / answerTimes.length) / 1000 || 0;

    return (
        <div className='game-summary-container'>
            <span className='close' onClick={onClose}>X</span>
            <h1 className='game-summary-title'>GAME OVER</h1>
            <h3 className='game-summary-subtitle'>Summary</h3>
            <h4 className='game-summary-message'>{message}</h4>
            <ul className='game-summary-list'>
                <li className='game-summary-item'>🔥 Streak: {streak}</li>
                <li className='game-summary-item'>⏳ Time Limit: {timeLimit} seconds</li>
                <li className='game-summary-item'>⏱ Average Answer Time: {averageAnswerTime.toFixed(2)}s</li>
            </ul>
            <button className='btn main-menu' onClick={() => document.location.reload()}>Main Menu</button>
        </div>
    )
}

export default GameSummary;