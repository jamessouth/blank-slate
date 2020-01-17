import React from 'react';
import { div, p } from '../styles/Word.module.css';

export default function Word({ playerColor, word }) {

    return (
        <div className={ div }>
            <svg preserveAspectRatio="none"><rect x="0" y="0" width="100%" style={{stroke: playerColor}} height="100%"/></svg>
            <p className={ p }>{ word }</p>
        </div>
    );

}