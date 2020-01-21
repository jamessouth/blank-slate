import React, { useState, useEffect } from 'react';
import Radio from './Radio';
import { inputdiv, p, radiodiv, signin, signedin } from '../styles/Form.module.css';


export default function Form({ answered, dupeName, playerName, hasJoined, onEnter }) {

    const [inputText, setInputText] = useState('');
    const [maxLength, setMaxLength] = useState(10);

    useEffect(() => {
      if (hasJoined) {
        setMaxLength(20);
      }
    }, [hasJoined]);

    function handleRadioChange(val) {
      setRadioValue(val);
    }

    return (

        <section className={ !hasJoined ? signin : [signin, signedin].join(' ') }>
     
          <label>{ dupeName ? 'That name is taken!' : playerName ? 'Enter your answer:' : 'Please sign in:'}</label>
          <input
            autoFocus
            value={ inputText }
            spellCheck="false"
            onKeyPress={ ({ key }) => {
                if (key == "Enter") {
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
            { ...((inputText.length < 2 || inputText.length > maxLength) || answered ? { 'disabled': true } : {}) }
          >
            Submit
          </button>
        </section>

    );

}