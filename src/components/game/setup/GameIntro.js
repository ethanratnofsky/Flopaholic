import React from 'react';

// Styles
import './GameIntro.css';

const GameIntro = () => {
    return (
        <div className='intro-container'>
            <h2 className='intro-title'>Introduction</h2>
            <p className='intro-content'>
                Challenge your reaction time and poker hand recognition skills with a game of Flopaholic.
                Depending on the difficulty level, you will have a limited time to recognize the ranking of the hand you are dealt.
                Correctly identify as many Texas Hold'em poker hands as you can, and set a personal record or challenge your friends!
            </p>
        </div>
    )
}

export default GameIntro;