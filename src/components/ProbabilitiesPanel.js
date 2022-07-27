import React from 'react';

import './ProbabilitiesPanel.css';

const ProbabilitiesPanel = ({ probabilities, hidden = false }) => {
    return (
        <div className={`probabilities-panel${hidden ? ' slide-left' : ' slide-right'}`}>
            <h3 className='probabilities-title'>Next Card Probabilities</h3>
            <ul className='probabilities-list'>
                {Object.keys(probabilities).reverse().map((ranking, index) => (
                    <li key={index} className='probability'>
                        <div className='ranking'>
                            {ranking}: {(probabilities[ranking] * 100).toFixed(2)}%
                        </div>
                        <div className='bar-container'>
                            <div className='bar' style={{ width: `${probabilities[ranking] * 100}%`, backgroundColor: `hsl(${probabilities[ranking] * 100}, 80%, 50%)` }} />
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ProbabilitiesPanel;