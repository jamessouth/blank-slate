import React from 'react';
import PropTypes from 'prop-types';
import { div } from '../styles/Start.module.css';

export default function Start({ gameHasBegun, onClick, players }) {

  const ppl = 3 - players.length == 1 ? 'player' : 'players';

  return (
    <div className={ div }>
      {
        !gameHasBegun &&
                    <button
                      aria-live="polite"
                      type="button"
                      onClick={ onClick }
                      { ...(players.length < 3 ? { 'disabled': true } : {}) }
                    >
                      { players.length < 3 ? "Need " + (3 - players.length) + " more " + ppl : "Start Game" }
                    </button>
      }
    </div>
  );

}

Start.propTypes = {
  gameHasBegun: PropTypes.bool,
  onClick: PropTypes.func,
  players: PropTypes.array
}

// {
//   players.length < 3 &&
//               <p className={ p }>
//                   Waiting for at least { 3 - players.length } more { 3 - players.length == 1 ? 'player' : 'players' }...
//               </p>
// }