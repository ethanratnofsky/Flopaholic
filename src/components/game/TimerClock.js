import React from 'react';

import './TimerClock.css';

const TimerClock = ({ minutes, seconds, streak, isRunning, isGameOver }) => {
    const isTimeUp = minutes === 0 && seconds === 0;

    return (
        <div className='timer-clock-container'>
            <div className='streak'>{streak} 🔥</div>
            <div className='icon'> {isTimeUp ? '⌛️' : '⏳'} </div>
            <div className='clock' style={{color: isGameOver ? '#ff3232' : isRunning ? 'inherit' : '#02db02'}} >{`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`}</div>
        </div>
    );
}

export default TimerClock;