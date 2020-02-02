import React, { useState } from 'react';
import { div, flipL, flipR, h2, li, offScreenLeft, offScreenRight, onScreen, p, score, ul } from '../styles/Scoreboard.module.css';
import playerSort from '../utils/playerSort';

export default function Scoreboard({ players, word }) {
    const [showScores, setShowScores] = useState(true);

    const scoreList = players
        .sort(playerSort('score', -1))
        .map((pl, ind) =>
            <li style={{backgroundColor: pl.color}} className={ li } key={ ind + pl.name }>
                <p>{ pl.name }</p>
                <p>{ pl.score }</p>
            </li>);
            
    const answerList = players
        .sort(playerSort('answer', 1))
        .map((pl, ind) =>
            <li style={{backgroundColor: pl.color}} className={ li } key={ ind + pl.name }>
                <p>{ pl.name }</p>
                <p className={ p }>{ pl.answer }</p>
            </li>);

    function swipe() {
        console.log('hello: ', 'ghghgh');
        setShowScores(!showScores)
    }

    return (
        <div style={{ height: `calc(95px + (28px * ${players.length}))` }} className={ score }>
            <button
              type="button"
              onClick={ swipe }
              className={ showScores ? flipR : flipL }
            >
            </button>
            <div className={ showScores ? [div, onScreen].join(' ') : [div, offScreenLeft].join(' ') }>
                <h2 className={ h2 }>Players:&nbsp;&nbsp;{ scoreList.length }</h2>
                <ul className={ ul }>{ scoreList }</ul>
            
            </div>
            <div className={ showScores ? [div, offScreenRight].join(' ') : [div, onScreen].join(' ') }>
                <h2 className={ h2 }>Word:&nbsp;&nbsp;{ word }</h2>
                <ul className={ ul }>{ answerList }</ul>
            
            </div>

        </div>
    );
  
}