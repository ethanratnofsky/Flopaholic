import React from 'react';
import { useTimer } from 'react-timer-hook';

import './OverlayBanner.css';

const OverlayBanner = ({ title, subtitle1, subtitle2, duration, onExpire }) => {
    const expiryTimestamp = new Date();
    expiryTimestamp.setSeconds(expiryTimestamp.getSeconds() + duration);
    const { seconds } = useTimer({ expiryTimestamp, onExpire });

    return (
        <div className='overlay-banner'>
            <h1 className='overlay-banner-title'>{title}</h1>
            <h3 className='overlay-banner-subtitle'>{subtitle1}</h3>
            <h3 className='overlay-banner-subtitle'>{subtitle2}</h3>
            <h4 className='overlay-banner-duration'>Continuing in {seconds}...</h4>
        </div>
    )
}

export default OverlayBanner;