import React from 'react';

// Styles
import './GameSettings.css';

// Constants
import { STREAK_MASTER } from '../constants';

// Streak Master Settings component
const StreakMasterSettings = ({ SMTimeLimit, setSMTimeLimit }) => {
    const handleTimeLimitChange = (e) => {
        const input = Number(e.target.value);

        if (input <= 0) {
            setSMTimeLimit(1);
        } else if (input > STREAK_MASTER.MAX_TIME_LIMIT) {
            setSMTimeLimit(STREAK_MASTER.MAX_TIME_LIMIT);
        } else {
            setSMTimeLimit(input);
        }
    }

    return (
        <ul className='game-settings'>
            <li className='game-setting'>
                <label className='game-setting-label'>Difficulty</label>
                <div className='button-container'>
                    {Object.keys(STREAK_MASTER.TIME_LIMIT).map((difficulty, index) => {
                        return (
                            <button
                                key={index}
                                className={`btn ${difficulty.toLowerCase()}${SMTimeLimit === STREAK_MASTER.TIME_LIMIT[difficulty] ? ' selected' : ''}`}
                                onClick={() => setSMTimeLimit(STREAK_MASTER.TIME_LIMIT[difficulty])}
                            >
                            {`${difficulty.charAt(0) + difficulty.slice(1).toLowerCase()} (${STREAK_MASTER.TIME_LIMIT[difficulty]}s)`}
                            </button>
                        );
                    })}
                </div>
            </li>
            <li className='game-setting row'>
                <label className='game-setting-label' htmlFor='time-limit-input'>Time Limit:</label>
                <input 
                    id='time-limit-input'
                    type='number'
                    value={SMTimeLimit}
                    onChange={handleTimeLimitChange}
                    min={1}
                    max={STREAK_MASTER.MAX_TIME_LIMIT}
                    style={{ width: `${SMTimeLimit.toString().length + 1.5}em`}}
                />
                second{SMTimeLimit === 1 ? '' : 's'}
            </li>
        </ul>
    )
}

const GameSettings = ({ gameMode, gameModeState, generalSettingsState }) => {
    return (
        <div className='game-settings-container'>
            <h2 className='game-settings-title'>General Settings</h2>
            <ul className='game-settings'>
                <li className='game-setting'>
                    <label className='game-setting-label'>Card Style</label>
                    <div className='button-container'>
                        <button className={`btn${generalSettingsState.useCardImages ? '' : ' selected'}`} onClick={() => generalSettingsState.setUseCardImages(false)}>Simple</button>
                        <button className={`btn${generalSettingsState.useCardImages ? ' selected' : ''}`} onClick={() => generalSettingsState.setUseCardImages(true)}>Realistic</button>
                    </div>
                </li>
                <li className='game-setting'>
                    <label className='game-setting-label'>Deck Style</label>
                    <div className='button-container'>
                        <button className={`btn${generalSettingsState.numColors === 1 ? ' selected' : ''}`} onClick={() => generalSettingsState.setNumColors(1)}>1-Color</button>
                        <button className={`btn${generalSettingsState.numColors === 2 ? ' selected' : ''}`} onClick={() => generalSettingsState.setNumColors(2)}>2-Color</button>
                        <button className={`btn${generalSettingsState.numColors === 4 ? ' selected' : ''}`} onClick={() => generalSettingsState.setNumColors(4)}>4-Color</button>
                    </div>
                </li>
            </ul>
            <hr style={{ width: '100%' }}/>
            <h2 className='game-settings-title'>{gameMode} Settings</h2>
            <StreakMasterSettings {...gameModeState} />
        </div>
    );
}

export default GameSettings;