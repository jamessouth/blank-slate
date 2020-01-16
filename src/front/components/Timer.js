import React from 'react';
import { p } from '../styles/Timer.module.css';

export default function Timer({ timer }) {

    return (
        <p className={ p }>{ timer }</p>
    );

}