import React from 'react';

// Images
import CardBackImg from '../../assets/cards/card_back.png';

// Styles
import './Card.css';

const Card = ({ rank, suit }) => {
    if (!rank || !suit) 
        return (<img className='card' src={CardBackImg} alt='Card Back' />);

    try {
        return (
            <img className='card' src={require(`../../assets/cards/${rank.toLowerCase()}_of_${suit.toLowerCase()}.png`).default} alt={`${rank} of ${suit}`} />
        );
    } catch (e) {
        throw new Error(`Invalid card: ${rank} of ${suit}`);
    }
}

export default Card;