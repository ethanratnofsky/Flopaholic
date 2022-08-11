import React, { useState } from 'react';

// Styles
import './MainMenu.css';

// Constants
import { GAME_MODES, STREAK_MASTER } from './constants';

// Components
import GameIntro from './setup/GameIntro';
import GameModeSelection from './setup/GameModeSelection';
import GameSettings from './setup/GameSettings';
import Game from './Game';

document.title = 'Flopaholic - The Game';

const MainMenu = () => {
    // Menu state
    const [setupIndex, setSetupIndex] = useState(0);
    const [gameMode, setGameMode] = useState(GAME_MODES.STREAK_MASTER);
    const [isStarted, setIsStarted] = useState(false);

    // General settings state
    const [useCardImages, setUseCardImages] = useState(false);
    const [numColors, setNumColors] = useState(2);
    const generalSettingsState = {
        useCardImages,
        setUseCardImages,
        numColors,
        setNumColors,
    }

    // Streak Master state
    const [SMTimeLimit, setSMTimeLimit] = useState(STREAK_MASTER.TIME_LIMIT.EASY);
    const streakMasterState = {
        SMTimeLimit,
        setSMTimeLimit,
    }

    // Time Trial state
    // const timeTrailState = {
    // }

    // Game mode states
    const gameModeStates = {
        [GAME_MODES.STREAK_MASTER.name]: streakMasterState,
        // [GAME_MODES.TIME_TRIAL.name]: timeTrailState,
    }

    // Game setup components
    const SETUP_SEQUENCE = [
        <GameIntro />,
        <GameModeSelection gameMode={gameMode} setGameMode={setGameMode} />,
        <GameSettings gameMode={gameMode.name} gameModeState={gameModeStates[gameMode.name]} generalSettingsState={generalSettingsState} />
    ];

    // Increment setup index
    const incrementSetupIndex = () => {
        setSetupIndex(prev => prev + 1);
    };

    // Decrement setup index
    const decrementSetupIndex = () => {
        setSetupIndex(prev => prev - 1);
    };

    // Render game
    if (isStarted) return <Game gameMode={gameMode.name} gameModeState={gameModeStates[gameMode.name]} generalSettingsState={generalSettingsState} />;

    // Render main menu
    return (
        <div className='main-menu-container'>
            <h1 className='game-title'>Flopaholic, The Game</h1>
            {SETUP_SEQUENCE[setupIndex]}
            <div className='nav-button-container'>
                {setupIndex !== 0 && <button className='btn' onClick={decrementSetupIndex}>Back</button>}
                {setupIndex === SETUP_SEQUENCE.length - 1 ?
                    <button className='btn' onClick={() => setIsStarted(true)}>Start</button>
                : <button className='btn' onClick={incrementSetupIndex}>{setupIndex ? 'Next' : 'Play'}</button>}
            </div>
        </div>
    );
}

export default MainMenu;