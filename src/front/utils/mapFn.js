import React from 'react';
import { li } from '../styles/Scoreboard.module.css';

export default function mapFn(crit) {
  return function innerMap(pl, ind) {
    return <li style={{backgroundColor: pl.color}} className={ li } key={ pl.name + '_' + ind }>
      <p>{ pl.name }</p>
      <p>{ pl[crit] }</p>
    </li>;
  }
}