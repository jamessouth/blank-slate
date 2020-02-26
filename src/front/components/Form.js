import React from 'react';
import PropTypes from 'prop-types';
import { bg, inv, signin } from '../styles/Form.module.css';

export default function Form({
  answered,
  dupeName,
  hasJoined,
  invalidInput,
  onEnter,
  playerName,
  playing,
  submitSignal,
}) {



  return (
    <section className={ signin }>
      {
        (invalidInput || !isValidInput) &&
              <p aria-live="assertive" className={ inv }>{ badChar ? badChar : 'That input'} is not allowed</p>
      }
      <label aria-live="assertive" htmlFor="inputbox">{ dupeName ? 'That name is taken!' : playerName ? 'Enter your answer:' : 'Please sign in:'}</label>
      <input
        id="inputbox"
        autoComplete="off"
        autoFocus
        ref={ inputBox }
        value={ inputText }
        spellCheck="false"
        onKeyPress={ ({ key }) => {
          if (key == 'Enter' && !disableSubmit) {
            onEnter(inputText.slice(0, ANSWER_MAX_LENGTH));
            setInputText('');
          }
        } }
        onChange={ e => setInputText(e.target.value) }
        type="text"
        placeholder={ !dupeName && hasJoined ? `length: 2 - ${ANSWER_MAX_LENGTH}` : `length: 2 - ${NAME_MAX_LENGTH}` }
        { ...(answered ? { 'readOnly': true } : {}) }
      />
      <span className={ bg }></span>
      <button
        type="button"
        onClick={() => {
          onEnter(inputText.slice(0, ANSWER_MAX_LENGTH));
          setInputText('');
        }}
        { ...(disableSubmit ? { 'disabled': true } : {}) }
      >
            Submit
      </button>
    </section>
  );
  
}

Form.propTypes = {
  answered: PropTypes.bool,
  dupeName: PropTypes.bool,
  hasJoined: PropTypes.bool,
  invalidInput: PropTypes.bool,
  onEnter: PropTypes.func,
  playerName: PropTypes.string,
  playing: PropTypes.bool,
  submitSignal: PropTypes.bool
}