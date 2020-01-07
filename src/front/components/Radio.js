import React from 'react';
// import '../styles/Radio.module.css';

export default function Radio({ text, onChange, value, check }) {

  return (
    <label>
      { text }
      <input
        onChange={ e => onChange(e.target.value) }
        type="radio"
        checked={ check }
        name="gameType"
        value={ value }
      />
    </label>
  );

}
