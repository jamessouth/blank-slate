import React, { useState } from 'react';
import Radio from './Radio';
import { inputdiv, p, radiodiv, signin } from '../styles/Form.module.css';


export default function Form({ dupeName, playerName, hasJoined, onEnter }) {

    const [inputText, setInputText] = useState('');
    const [radioValue, setRadioValue] = useState('mixed');

    function handleRadioChange(val) {
      setRadioValue(val);
    }

    return (

        <section className={ signin }>
          <div className={ inputdiv }>
            <label>{ dupeName ? 'That name is taken!' : playerName ? 'Enter your answer:' : 'Please sign in:'}</label>
            <input
              autoFocus
              value={ inputText }
              spellCheck="false"
              onKeyPress={ ({ key }) => {
                  if (key == "Enter") {
                      onEnter(inputText, radioValue);
                      setInputText('');
                  }
              } }
              onChange={ e => setInputText(e.target.value) }
              type="text"
              placeholder={ !dupeName && hasJoined ? "Answer" : "Name" }
            />
          </div>

          <div className={ radiodiv }>
            <div>
              <p>Select game type:</p>
              <p className={ p }>(Leave blank for a mix of both)</p>
            </div>
            <Radio
              text="Word ____"
              onChange={ handleRadioChange }
              value="word"
            />

            <Radio
              text="____ Word"
              onChange={ handleRadioChange }
              value="blank"
            />
          </div>

          <button
            type="button"
            onClick={() => {
              onEnter(inputText, radioValue);
              setInputText('');
            }}
            { ...(inputText.length < 1 || inputText.length > 10 ? { 'disabled': true } : {}) }
          >
            Submit
          </button>
        </section>

    );

}