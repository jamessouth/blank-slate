import React from 'react';
import { div, p } from '../styles/Word.module.css';

export default function Word({ playerColor, word }) {

    return (
        <div style={{borderColor: playerColor}} className={ div }>
            <p className={ p }>{ word }</p>
        </div>
    );

}