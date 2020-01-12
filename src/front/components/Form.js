import React, { useState } from 'react';
import { signin } from '../styles/Form.module.css';


export default function Form({ dupeName, gameStarted, hasJoined, onEnter }) {

    const [inputText, setInputText] = useState('');

    return (

        <section className={ signin }>
          <label>{ dupeName ? 'That name is taken!' : gameStarted ? 'Enter your answer:' : 'Please sign in:'}</label>
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
            { ...(inputText.length < 1 || inputText.length > 10 ? { 'disabled': true } : {}) }
          >
            Submit
          </button>
        </section>

    );

}