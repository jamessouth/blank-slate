import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  h2,
  h22,
  li,
  ul,
} from '../styles/Scoreboard.module.css';
import playerSort from '../utils/playerSort';
import mapFn from '../utils/mapFn';
// check font letters, aria labels

export default function Scoreboard({
  playerName,
  players,
  showAnswers,
  word,
}) {

  const scoreList = players
    .sort(playerSort('score', -1))
    .map(mapFn('score', li));

  const rank = scoreList.findIndex(l => l.key.split('_')[0] == playerName) + 1;

  const answerList = players
    .sort(playerSort('answer', 1))
    .map(mapFn('answer', li));

  const titleBegin = showAnswers ? 'Last word:' : 'Scores:';

  const titleEnd = showAnswers ? word : `You're no. ${rank}!`;

  return (
    <div style={{ height: `calc(95px + (28px * ${players.length}))`, width: '100%' }}>
      <h2 className={ showAnswers ? h22 : h2 }>{ titleBegin }&nbsp;{ titleEnd }</h2>
      <ul
        aria-label={ showAnswers ? "answers" : "scores" }
        className={ ul }
      >
        { showAnswers ? answerList : scoreList }
      </ul>
    </div>
  );

}

Scoreboard.propTypes = {
  playerName: PropTypes.string,
  players: PropTypes.array,
  showAnswers: PropTypes.bool,
  word: PropTypes.string
}