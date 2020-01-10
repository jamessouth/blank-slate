import React, { useState } from 'react';
import { signin } from '../styles/Form.module.css';


export default function Form({ dupeName, gameStarted, hasJoined, onClick }) {

    const [inputText, setInputText] = useState('');

    return (

        <section className={ signin }>
          <label>{ dupeName ? 'That name is taken!' : gameStarted ? 'Enter your answer:' : 'Please sign in:'}</label>
          <input
            value={ inputText }
            spellCheck="false"
            onChange={ e => setInputText(e.target.value) }
            type="text"
            placeholder={ !dupeName && hasJoined ? "Answer" : "Name" }
          />
          <button
            type="button"
            onClick={() => onClick(inputText)}
            { ...(inputText.length < 1 || inputText.length > 10 ? { 'disabled': true } : {}) }
          >
            Submit
          </button>
        </section>

    );

}