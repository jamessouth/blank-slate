import React from 'react';

export default function mapFn(crit, classOne, classTwo = '') {
  return function innerMap(pl, ind) {
    return <li style={{backgroundColor: pl.color}} className={ classOne } key={ ind + pl.name }>
      <p>{ pl.name }</p>
      <p className={ classTwo }>{ pl[crit] }</p>
    </li>;
  }
}