import React from 'react';

// Styles
import './Card.css';

const suitUnicode = {
    Clubs: '♣',
    Diamonds: '♦',
    Hearts: '♥',
    Spades: '♠',
}

const Card = ({ rank, suit, useImage = false }) => {
    const isShown = rank && suit;

    if (useImage) {
        let srcImg, altText;
        if (isShown) {
            try {
                srcImg = require(`../../assets/cards/${rank.toLowerCase()}_of_${suit.toLowerCase()}.svg`).default;
                altText = `${rank} of ${suit}`;
            } catch (e) {
                throw new Error(`Invalid card: ${rank} of ${suit}`);
            }
        } else {
            srcImg = require('../../assets/cards/card_back.svg').default;
            altText = 'Back of playing card';
        }
        return <img className={`card${isShown ? ' shown' : ''}`} src={srcImg} alt={altText} />
    } else {
        const style = isShown && {
            color: suit === 'Hearts' || suit === 'Diamonds' ? 'red' : 'black',
        }
        return (
            <div className={`card${isShown ? ' shown' : ''}`} style={style} >
                <div className='card-rank'>{Number(rank) || rank?.charAt(0)}</div>
                <div className='card-suit'>{suitUnicode[suit]}</div>
            </div>
        )
    }
}

export default Card;