import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  div,
  flipL,
  flipR,
  h2,
  li,
  offScreenLeft,
  offScreenRight,
  onScreen,
  p,
  score,
  ul,
} from '../styles/Scoreboard.module.css';
import playerSort from '../utils/playerSort';
import mapFn from '../utils/mapFn';

export default function Scoreboard({ players, showAnswers, word }) {

  const [showScores, setShowScores] = useState(true);

  const scoreList = players
    .sort(playerSort('score', -1))
    .map(mapFn('score', li));

  const answerList = players
    .sort(playerSort('answer', 1))
    .map(mapFn('answer', li, p));

  return (
    <div style={{ height: `calc(95px + (28px * ${players.length}))` }} className={ score }>

    {
      !showAnswers &&
        <div className={ div }>
          <h2 className={ h2 }>
            Players:&nbsp;&nbsp;{ scoreList.length }
          </h2>
          <ul aria-label="scores" className={ ul }>{ scoreList }</ul>
        </div>
    }
    {
      showAnswers &&    
        <div className={ div }>
          <h2 className={ h2 }>
            Word:&nbsp;&nbsp;{ word }
          </h2>
          <ul aria-label="answers" className={ ul }>{ answerList }</ul>
        </div>
    }

    </div>
  );

}

Scoreboard.propTypes = {
  players: PropTypes.array,
  word: PropTypes.string
}

{/* <h2 className={ h2 }>
Word:&nbsp;&nbsp;{ word }
</h2> */}