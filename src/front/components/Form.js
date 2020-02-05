import React, { useState, useEffect } from 'react';
import { inv, signin, signedin } from '../styles/Form.module.css';

export default function Form({ answered, dupeName, hasJoined, invalidInput, onEnter, playerName, playing }) {

    const regex = /^[a-z0-9 -']+$/i;
    const NAME_MAX_LENGTH = 10;
    const ANSWER_MAX_LENGTH = 16;
    const INPUT_MIN_LENGTH = 2;
    const [inputText, setInputText] = useState('');
    const [maxLength, setMaxLength] = useState(NAME_MAX_LENGTH);
    const [disableSubmit, setDisableSubmit] = useState(true);
    const [isValidInput, setIsValidInput] = useState(false);

    useEffect(() => {
      setIsValidInput(regex.test(inputText));
    }, [inputText]);

    useEffect(() => {
      if (hasJoined) {
        setMaxLength(ANSWER_MAX_LENGTH);
      }
    }, [hasJoined]);

    useEffect(() => {
      setDisableSubmit((inputText.length < INPUT_MIN_LENGTH || inputText.length > maxLength) || answered || invalidInput || !isValidInput || (hasJoined && !playing));
    }, [inputText, maxLength, answered, invalidInput, isValidInput, hasJoined, playing]);

    return (
        <section className={ !hasJoined ? signin : [signin, signedin].join(' ') }>
          {
            invalidInput &&
            <p className={ inv }>Letters, numbers, space, ' and - only</p>
          }
          <label>{ dupeName ? 'That name is taken!' : playerName ? 'Enter your answer:' : 'Please sign in:'}</label>
          <input
            autoFocus
            value={ inputText }
            spellCheck="false"
            onKeyPress={ ({ key }) => {
                if (key == "Enter" && !disableSubmit) {
                    onEnter(inputText);
                    setInputText('');
                }
            } }
            onChange={ e => setInputText(e.target.value) }
            type="text"
            placeholder={ !dupeName && hasJoined ? "Answer" : "Name" }
          />
          <button
            type="button"
            onClick={() => {
              onEnter(inputText);
              setInputText('');
            }}
            { ...(disableSubmit ? { 'disabled': true } : {}) }
          >
            Submit
          </button>
        </section>
    );
}