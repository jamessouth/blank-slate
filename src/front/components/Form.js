import React, { useState, useEffect } from 'react';
import { signin, signedin } from '../styles/Form.module.css';

export default function Form({ answered, dupeName, playerName, hasJoined, onEnter, playing }) {

    const [inputText, setInputText] = useState('');
    const [maxLength, setMaxLength] = useState(10);
    const [disableSubmit, setDisableSubmit] = useState(true);


    useEffect(() => {
      if (hasJoined) {
        setMaxLength(16);
      }
    }, [hasJoined]);

    useEffect(() => {
      setDisableSubmit((inputText.length < 2 || inputText.length > maxLength) || answered || (hasJoined && !playing));
    }, [inputText, maxLength, answered, hasJoined, playing]);

    return (

        <section className={ !hasJoined ? signin : [signin, signedin].join(' ') }>
     
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