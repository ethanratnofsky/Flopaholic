import React from 'react';

const Card = ({ rank, suit }) => {
    try {
        return (
            <img src={require(`../../assets/cards/${rank.toLowerCase()}_of_${suit.toLowerCase()}.png`).default} alt={`${rank} of ${suit}`} style={{width:200}}/>
        );
    } catch (e) {
        throw new Error(`Invalid card: ${rank} of ${suit}`);
    }
}

export default Card;