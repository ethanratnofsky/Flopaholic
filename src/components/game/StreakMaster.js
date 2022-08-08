import React, { useState } from 'react';
import { useTimer } from 'react-timer-hook';

// Styles
import './StreakMaster.css';

// API
import Deck from '../../models/Deck';
import Hand from '../../models/Hand';

// Components
import GameSummary from './GameSummary';
import OverlayBanner from './OverlayBanner';
import TimerClock from './TimerClock';
import CardRow from '../CardRow';

// Constants
import { HAND_RANKINGS } from '../../constants';

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const deck = new Deck();
let board = [];
let hole = [];
let hand;

// Resets and shuffles deck and draws cards for a new hand
const newHand = () => {
    // Reset deck
    deck.reset();
    deck.shuffle();

    // Reset hand
    board = [];
    for (let i = 0; i < 5; i++) {
        board.push(deck.draw());
    }

    hole = [];
    for (let i = 0; i < 2; i++) {
        hole.push(deck.draw());
    }

    hand = new Hand([...board, ...hole]);
}

// Initialize hand
newHand();
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const StreakMaster = ({ SMTimeLimit, useCardImages }) => {
    // Session state
    const [streak, setStreak] = useState(0);
    const [answerTimes, setAnswerTimes] = useState([]);

    // Session over state
    const [isGameOver, setIsGameOver] = useState(false);
    const [showGameSummary, setShowGameSummary] = useState(false);

    // Hand state
    const [handStartTime, setHandStartTime] = useState(Date.now());
    const [answerTime, setAnswerTime] = useState(0);
    const [isCorrectAnswer, setIsCorrectAnswer] = useState(false);

    // Timer hook
    const expiryTimestamp = new Date();
    expiryTimestamp.setSeconds(expiryTimestamp.getSeconds() + SMTimeLimit);
    const { pause, restart, isRunning, minutes, seconds } = useTimer({
        expiryTimestamp,
        onExpire: () => setTimeout(handleGameOver, 1),
    });

    // Start game
    const handleStart = () => {
        setIsGameOver(false); // Game is not over
        setStreak(0); // Reset streak
        setShowGameSummary(false); // Hide game summary
        setAnswerTimes([]); // Reset answer times

        // Deal new hand
        newHand();

        // Restart timer
        const timestamp = new Date();
        timestamp.setSeconds(timestamp.getSeconds() + SMTimeLimit);
        restart(timestamp);

        // Initial hand start time
        setHandStartTime(Date.now());
    }

    // Game over
    const handleGameOver = () => {
        setIsGameOver(true);
        setShowGameSummary(true);
    }

    // Check if user's guess is correct
    const handleUserGuess = (ranking) => {
        if (!isRunning) return; // Don't execute if game is paused

        pause(); // Pause timer

        // Get answer time
        const curAnswerTime = Date.now() - handStartTime;
        setAnswerTime(curAnswerTime);
        setAnswerTimes(prev => [...prev, curAnswerTime]);

        // Check if user's guess is correct
        if (hand.getShortName() === ranking) {
            // Correct guess
            setIsCorrectAnswer(true);
            setStreak(prev => prev + 1);
        } else {
            // Incorrect guess
            handleGameOver();
        }
    }

    // When overlay expires, reset timer and deal new hand
    const handleOverlayBannerExpire = () => {
        // Restart timer
        const timestamp = new Date();
        timestamp.setSeconds(timestamp.getSeconds() + SMTimeLimit);
        restart(timestamp);
        
        setIsCorrectAnswer(false); // Reset correct answer flag

        newHand(); // Deal new hand
        setHandStartTime(Date.now()); // Reset hand start time
    }

    return (
        <div className='streak-master-container'>
            {showGameSummary &&
                <GameSummary
                    timeLimit={SMTimeLimit}
                    timeLimitReached={seconds === 0}
                    streak={streak}
                    answerTimes={answerTimes}
                    message={hand.getLongName()}
                    onClose={() => setShowGameSummary(false)}
                    onRestart={handleStart}
                />
            }
            {isCorrectAnswer &&
                <OverlayBanner
                    title='NICE JOB!'
                    subtitle1={hand.getLongName()}
                    subtitle2={`Answered in ${(answerTime / 1000).toFixed(2)} seconds`}
                    duration={3}
                    onExpire={handleOverlayBannerExpire}
                />
            }
            <TimerClock minutes={minutes} seconds={seconds} streak={streak} isRunning={isRunning} isGameOver={isGameOver} />
            <div className='answer-panel'>
                {isGameOver ? 
                    <button className='btn' onClick={() => setShowGameSummary(true)} disabled={showGameSummary}>See Results</button>
                    :
                    Object.values(HAND_RANKINGS).map((ranking, index) => 
                        <button className='btn' key={index} onClick={() => handleUserGuess(ranking)}>{ranking}</button>
                    )
                }
            </div>
            <div className='board-container'>
                <CardRow cards={board} useImages={useCardImages} />
            </div>
            <div className='hole-container'>
                <CardRow cards={hole} useImages={useCardImages} />
            </div>
        </div>
    );
}

export default StreakMaster;