import React from 'react';
import { div, p } from '../styles/Word.module.css';

export default function Word({ word }) {

    return (
        <div className={ div }>
            <p className={ p }>{ word }</p>
        </div>
    );

}