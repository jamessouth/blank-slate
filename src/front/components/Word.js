import React from 'react';
import PropTypes from 'prop-types';
import { div, p } from '../styles/Word.module.css';

export default function Word({ onAnimationEnd, playerColor, showSVGTimer, word }) {

  const blankPos = word.startsWith("_") ? "word, blank first" : "word, blank last";

  return (
    <div className={ div }>
      <svg preserveAspectRatio="none">
        {
          showSVGTimer &&
                        <rect
                          x="0"
                          y="0"
                          width="100%"
                          height="100%"
                          onAnimationEnd={ onAnimationEnd }
                          style={{stroke: playerColor}}
                        />
        }
      </svg>
      <p aria-label={ blankPos } role="alert" className={ p }>{ word }</p>
    </div>
  );

}

Word.propTypes = {
  onAnimationEnd: PropTypes.func,
  playerColor: PropTypes.string,
  showSVGTimer: PropTypes.bool,
  word: PropTypes.string
}

// aria-live="assertive"