import React from 'react';
import PropTypes from 'prop-types';
import { ul } from '../styles/Scoreboard.module.css';
import playerSort from '../utils/playerSort';
import mapFn from '../utils/mapFn';

export default function Scoreboard({
  playerName,
  players,
  showAnswers,
  word,
}) {

  const scoreList = players
    .sort(playerSort('score', -1))
    .map(mapFn('score'));

  const rank = scoreList.findIndex(l => l.key.split('_')[0] == playerName) + 1;

  const answerList = players
    .sort(playerSort('answer', 1))
    .map(mapFn('answer'));

  const titleBegin = showAnswers ? 'Last word:' : 'Scores:';

  const titleEnd = showAnswers ? word : `You're no. ${rank}!`;

  return (
    <div style={{ height: `calc(82px + (28px * ${players.length}))`, width: '100%' }}>
      <h2 style={{ marginBottom: '1.25em' }}>{ titleBegin }&nbsp;{ titleEnd }</h2>
      <ul
        aria-label={ showAnswers ? 'answers' : 'scores' }
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