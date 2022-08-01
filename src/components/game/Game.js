import React, { useEffect, useState } from 'react';
import { useTimer } from 'react-timer-hook';

// Components
import TitleScreen from './TitleScreen';
import CardRow from '../CardRow';
import OverlayBanner from './OverlayBanner';
import GameSummary from './GameSummary';

// Styles
import './Game.css';

// Constants
import { HAND_RANKINGS, TIME_LIMIT } from '../../constants';

// API
import Deck from '../../models/Deck';
import Hand from '../../models/Hand';

const deck = new Deck();
let hand;

// Resets and shuffles deck and draws cards for a new hand
const newHand = () => {
    // Reset deck
    deck.reset();
    deck.shuffle();

    // Reset hand
    const cards = [];
    for (let i = 0; i < 7; i++) {
        cards.push(deck.draw());
    }
    hand = new Hand(cards);
}

// Set up initial hand
newHand();

// Initialize answer times array
const answerTimes = [];

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

    // Timer hook
    const expiryTimestamp = new Date();
    expiryTimestamp.setSeconds(expiryTimestamp.getSeconds() + timeLimit);
    const { pause, restart, isRunning, minutes, seconds } = useTimer({
        expiryTimestamp, 
        autoStart: false,
        onExpire: () => {
            // Time's up!
            setTimeout(() => {
                setIsGameOver(true);
            }, 1);
        }
    });

    // Start game
    const handleStart = () => {
        setIsStarted(true);

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
            setIsGameOver(true);
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
                    {isGameOver ? 
                        <GameSummary 
                            timeLimit={timeLimit}
                            streak={streak}
                            answerTimes={answerTimes}
                            message={`${seconds === 0 ? 'You ran out of time!' : 'Incorrect!'} The correct hand ranking is ${hand.getLongName()}.`}
                        /> : 
                        <div className='streak-container'>Current Streak: {streak} 🔥</div>
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
                    <h2 className='timer' style={{color: isGameOver ? '#ff3232' : isRunning ? 'inherit' : '#02db02'}}>
                        {minutes * 60 + seconds === 0 ? '⌛️ TIME IS UP!' : `⏳ ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`}
                    </h2>
                    <div className='guessing-panel'>
                        {Object.values(HAND_RANKINGS).map((ranking, index) => 
                            <button className='btn guess' key={index} onClick={() => handleUserGuess(ranking)}>{ranking}</button>
                        )}
                    </div>
                    <div className='board-container'>
                        <h3>BOARD</h3>
                        <CardRow cards={hand.getCards().slice(0, 5)} useImages={useCardImages} />
                    </div>
                    <div className='hole-container'>
                        <h3>HOLE</h3>
                        <CardRow cards={hand.getCards().slice(5)} useImages={useCardImages} />
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