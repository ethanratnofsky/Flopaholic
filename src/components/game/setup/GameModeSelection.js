import React from 'react';

// Styles
import './GameModeSelection.css';

// Constants
import { GAME_MODES } from '../constants';

const GameModeSelection = ({ gameMode, setGameMode }) => {
    return (
        <div className='game-mode-selection-container'>
            <h2>Select a Mode</h2>
            <ul className='game-mode-list'>
                {Object.values(GAME_MODES).map((mode, index) => (
                    <li className={`game-mode${mode === gameMode ? ' selected' : ''}`} onClick={() => setGameMode(mode)} key={index}>
                        <span className='game-mode-icon'>{mode.icon}</span>
                        <h3 className='game-mode-title'>{mode.name}</h3>
                        <p className='game-mode-description'>{mode.description}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default GameModeSelection;