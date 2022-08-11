import React from 'react';

import './CardRow.css';

import Card from './Card';

const CardRow = ({ cards, numCardsShown, useImages = false, numColors = 2 }) => {
    return (
        <ul className='card-row'>
            {cards.map((card, index) => {
                let rank = card.getRank();
                let suit = card.getSuit();

                // If card is hidden, don't pass rank and suit
                if (numCardsShown !== undefined && index >= numCardsShown) {
                    rank = suit = null;
                }

                return (
                    <li key={index}>
                        <div className='card-container'>
                            <Card rank={rank} suit={suit} useImage={useImages} numColors={numColors} />
                        </div>
                    </li>
                );
            })}
        </ul>
    );
}

export default CardRow;