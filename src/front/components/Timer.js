import React from 'react';
import { p, span } from '../styles/Timer.module.css';

export default function Timer({ timer }) {

    return (
        <p className={ p }>The game will start in&nbsp;&nbsp;<span className={ span }>{ timer }</span>&nbsp;&nbsp;seconds</p>
    );

}