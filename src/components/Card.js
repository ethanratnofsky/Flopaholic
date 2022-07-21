import React from 'react';

// Styles
import './Card.css';

const Card = ({ rank, suit }) => {
    let srcImg, altText;

    if (rank && suit) {
        try {
            srcImg = require(`../images/cards/${rank.toLowerCase()}_of_${suit.toLowerCase()}.svg`).default;
            altText = `${rank} of ${suit}`;
        } catch (e) {
            throw new Error(`Invalid card: ${rank} of ${suit}`);
        }
    } else {
        srcImg = require('../images/cards/card_back.svg').default;
        altText = 'Card Back';
    }

    return <img className='card' src={srcImg} alt={altText} />
}

export default Card;