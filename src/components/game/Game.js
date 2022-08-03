import React, { useEffect, useState } from 'react';
import { useTimer } from 'react-timer-hook';

// Components
import TitleScreen from './TitleScreen';
import CardRow from '../CardRow';
import OverlayBanner from './OverlayBanner';
import GameSummary from './GameSummary';
import TimerClock from './TimerClock';

// Styles
import './Game.css';

// Constants
import { HAND_RANKINGS, TIME_LIMIT } from '../../constants';

// API
import Deck from '../../models/Deck';
import Hand from '../../models/Hand';

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

// Initialize answer times array
let answerTimes = [];

const Game = () => {
    document.title = 'Flopaholic - The Game';

    const [isStarted, setIsStarted] = useState(false);
    const [isGameOver, setIsGameOver] = useState(false);
    const [timeLimit, setTimeLimit] = useState(Object.values(TIME_LIMIT)[0]);
    const [useCardImages, setUseCardImages] = useState(false);
    const [streak, setStreak] = useState(0);
    const [startTime, setStartTime] = useState(Date.now());
    const [answerTime, setAnswerTime] = useState(0);
    const [showOverlayBanner, setShowOverlayBanner] = useState(false);
    const [showGameSummary, setShowGameSummary] = useState(false);

    // Timer hook
    const expiryTimestamp = new Date();
    expiryTimestamp.setSeconds(expiryTimestamp.getSeconds() + timeLimit);
    const { pause, restart, isRunning, minutes, seconds } = useTimer({
        expiryTimestamp, 
        autoStart: false,
        onExpire: () => {
            // Time's up!
            setTimeout(handleGameOver, 1);
        }
    });

    // Game over
    const handleGameOver = () => {
        setIsGameOver(true);
        setShowGameSummary(true);
    }

    // Start game
    const handleStart = () => {
        setIsStarted(true);
        setIsGameOver(false);
        setStreak(0);
        setShowGameSummary(false);

        // Reset answer times array
        answerTimes = [];

        // Deal new hand
        newHand();

        // Update timer based on time limit
        const timestamp = new Date();
        timestamp.setSeconds(timestamp.getSeconds() + timeLimit);
        restart(timestamp);

        // Initial answer start time
        setStartTime(Date.now());
    }

    // Check if user's guess is correct
    const handleUserGuess = (ranking) => {
        if (!isRunning) return; // Don't evaluate if game is paused

        pause(); // Pause timer
        const curAnswerTime = Date.now() - startTime;
        setAnswerTime(curAnswerTime);
        answerTimes.push(curAnswerTime); // Add answer time to array

        // Check if user's guess is correct
        if (hand.getShortName() === ranking) {
            // Correct guess
            setShowOverlayBanner(true);
            setStreak(prev => prev + 1);
        } else {
            // Incorrect guess
            handleGameOver();
        }
    }

    // When overlay expires, reset timer and deal new hand
    const handleOverlayBannerExpire = () => {
        const timestamp = new Date();
        timestamp.setSeconds(timestamp.getSeconds() + timeLimit);
        restart(timestamp);
        setStartTime(Date.now());
        newHand();
        setShowOverlayBanner(false);
    }

    return (
        <div className='game-container'>
            {isStarted ? 
                <div className='table-container'>
                    {isGameOver && showGameSummary &&
                            <GameSummary 
                                timeLimit={timeLimit}
                                timeLimitReached={seconds === 0}
                                streak={streak}
                                answerTimes={answerTimes}
                                message={hand.getLongName()}
                                onClose={() => setShowGameSummary(false)}
                                onRestart={handleStart}
                            /> 
                    }
                    {showOverlayBanner &&
                        <OverlayBanner
                            title='NICE JOB!'
                            subtitle1={hand.getLongName()}
                            subtitle2={`Answered in ${(answerTime / 1000).toFixed(2)} seconds`}
                            duration={3}
                            onExpire={handleOverlayBannerExpire}
                        />
                    }
                    <TimerClock minutes={minutes} seconds={seconds} streak={streak} isRunning={isRunning} isGameOver={isGameOver} />
                    <div className='guessing-panel'>
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
                :
                <TitleScreen
                    onStart={handleStart}
                    timeLimit={timeLimit}
                    setTimeLimit={setTimeLimit}
                    useCardImages={useCardImages}
                    setUseCardImages={setUseCardImages} 
                />
            }
        </div>
    );
}

export default Game;