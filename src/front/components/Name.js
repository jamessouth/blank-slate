import React from 'react';
import { name } from '../styles/Name.module.css';

export default function Name({ playerColor, playerName }) {

    return (
        <p
            style={{color: playerColor}}
            className={ name }>
                { playerName }
        </p>
    );

  }