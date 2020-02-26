import React from 'react';
import PropTypes from 'prop-types';
import { p } from '../styles/Timer.module.css';

export default function Timer({ timer }) {

  return (
    <p
      aria-live="assertive"
      role="alert"
      className={ p }
    >
      { timer }
    </p>
  );

}

Timer.propTypes = {
  timer: PropTypes.number
}