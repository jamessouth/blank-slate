import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { div, flipL, flipR, h2, li, offScreenLeft, offScreenRight, onScreen, p, score, ul } from '../styles/Scoreboard.module.css';
import playerSort from '../utils/playerSort';
import mapFn from '../utils/mapFn';

export default function Scoreboard({ players, word }) {
  const [showScores, setShowScores] = useState(true);

  const scoreList = players
    .sort(playerSort('score', -1))
    .map(mapFn('score', li));
            
  const answerList = players
    .sort(playerSort('answer', 1))
    .map(mapFn('answer', li, p));

  return (
    <div style={{ height: `calc(95px + (28px * ${players.length}))` }} className={ score }>
      <button
        type="button"
        onClick={ () => setShowScores(!showScores) }
        className={ showScores ? flipR : flipL }
      ></button>
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

Scoreboard.propTypes = {
  players: PropTypes.array,
  word: PropTypes.string
}