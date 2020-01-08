import React from 'react';
// import '../styles/Radio.module.css';

export default function Radio({ text, onChange, value }) {

  return (
    <label>
      { text }
      <input
        onChange={ e => onChange(e.target.value) }
        type="radio"
        name="gameType"
        value={ value }
      />
    </label>
  );

}
