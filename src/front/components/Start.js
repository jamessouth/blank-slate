import React from 'react';
import { div, p } from '../styles/Start.module.css';

export default function Start({ gameHasBegun, onClick, players }) {

    return (
        <div className={ div }>
            {
                players.length < 3 &&
                    <p className={ p }>
                        Waiting for at least { 3 - players.length } more { 3 - players.length == 1 ? 'player' : 'players' }...
                    </p>
            }
            {
                !gameHasBegun &&
                    <button
                        type="button"
                        onClick={ onClick }
                        { ...(players.length < 3 ? { 'disabled': true } : {}) }
                    >
                        Start Game
                    </button>
            }
        </div>
    );

}