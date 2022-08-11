import React from 'react';

// Styles
import './Card.css';

const suitUnicode = {
    Clubs: '♣',
    Diamonds: '♦',
    Hearts: '♥',
    Spades: '♠',
}

const getColorBySuit = (suit, numColors) => {
    switch (numColors) {
        case 1:
            return 'black';
            break;
        case 2:
            switch (suit) {
                case 'Clubs':
                case 'Spades':
                    return 'black';
                case 'Diamonds':
                case 'Hearts':
                    return 'red';
                default:
                    throw new Error(`Invalid suit: ${suit}`);
            }
            break;
        case 4:
            switch (suit) {
                case 'Clubs':
                    return 'green';
                case 'Diamonds':
                    return 'blue';
                case 'Hearts':
                    return 'red';
                case 'Spades':
                    return 'black';
                default:
                    throw new Error(`Invalid suit: ${suit}`);
            }
            break;
        default:
            throw new Error(`Invalid number of colors for deck: ${numColors}`);
    }
}

const Card = ({ rank, suit, useImage = false, numColors = 2 }) => {
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
        const style = isShown && { color: getColorBySuit(suit, numColors) };
        return (
            <div className={`card${isShown ? ' shown' : ''}`} style={style} >
                <div className='card-rank'>{Number(rank) || rank?.charAt(0)}</div>
                <div className='card-suit'>{suitUnicode[suit]}</div>
            </div>
        )
    }
}

export default Card;