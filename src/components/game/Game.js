import React from 'react';

// Styles
import './Game.css';

// Constants
import { GAME_MODES } from './constants';

// Components
import StreakMaster from './StreakMaster';

const Game = ({ gameMode, gameModeState, generalSettingsState }) => {
    // Set document title
    document.title = `Flopaholic - ${gameMode}`;

    // Game mode components
    const gameModeComponents = {
        [GAME_MODES.STREAK_MASTER.name]: <StreakMaster {...gameModeState} {...generalSettingsState} />,
        // [GAME_MODES.TIME_TRIAL.name]: timeTrailState,
    }

    return (
        <div className='game-container'>
            {gameModeComponents[gameMode]}
        </div>
    );
}

export default Game;