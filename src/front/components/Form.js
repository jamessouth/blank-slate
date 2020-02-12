import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { inv, signin, signedin } from '../styles/Form.module.css';

export default function Form({ answered, dupeName, hasJoined, invalidInput, onEnter, playerName, playing, submitSignal }) {
  const inputBox = useRef(null);
  const regex = /[^a-z0-9 '-]+/i;
  const NAME_MAX_LENGTH = 10;
  const ANSWER_MAX_LENGTH = 16;
  const INPUT_MIN_LENGTH = 2;
  const [inputText, setInputText] = useState('');
  const [maxLength, setMaxLength] = useState(NAME_MAX_LENGTH);
  const [disableSubmit, setDisableSubmit] = useState(true);
  const [isValidInput, setIsValidInput] = useState(true);
  const [badChar, setBadChar] = useState(null);

  useEffect(() => {
    const test = inputText.match(regex);
    if (test) {
      setBadChar(test[0]);
    } else {
      setBadChar(null);
    }
    setIsValidInput(!test);
  }, [inputText, regex]);

  useEffect(() => {
    if (answered) {
      inputBox.current.blur();
    }
  }, [answered]);

  useEffect(() => {
    if (hasJoined) {
      setMaxLength(ANSWER_MAX_LENGTH);
    }
  }, [hasJoined]);

  useEffect(() => {
    if (submitSignal) {
      onEnter(inputText.slice(0, ANSWER_MAX_LENGTH));
      setInputText('');
    }
  }, [inputText, onEnter, submitSignal]);

  useEffect(() => {
    setDisableSubmit((inputText.length < INPUT_MIN_LENGTH || inputText.length > maxLength) || answered || invalidInput || !isValidInput || (hasJoined && !playing));
  }, [inputText, maxLength, answered, invalidInput, isValidInput, hasJoined, playing]);

  return (
    <section className={ !hasJoined ? signin : [signin, signedin].join(' ') }>
      {
        (invalidInput || !isValidInput) &&
              <p className={ inv }>{ badChar ? badChar : 'That input'} is not allowed</p>
      }
      <label>{ dupeName ? 'That name is taken!' : playerName ? 'Enter your answer:' : 'Please sign in:'}</label>
      <input
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
        placeholder={ !dupeName && hasJoined ? 'length: 2 - 16' : 'Name' }
        { ...(answered ? { 'readOnly': true } : {}) }
      />
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