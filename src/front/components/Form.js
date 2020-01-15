import React, { useState, useEffect } from 'react';
import Radio from './Radio';
import { inputdiv, p, radiodiv, signin, signedin } from '../styles/Form.module.css';


export default function Form({ dupeName, playerName, hasJoined, onEnter }) {

    const [inputText, setInputText] = useState('');
    const [maxLength, setMaxLength] = useState(10);
    const [radioValue, setRadioValue] = useState('mixed');

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



          {
            !hasJoined &&

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
          }

          <button
            type="button"
            onClick={() => {
              onEnter(inputText, radioValue);
              setInputText('');
            }}
            { ...(inputText.length < 1 || inputText.length > maxLength ? { 'disabled': true } : {}) }
          >
            Submit
          </button>
        </section>

    );

}