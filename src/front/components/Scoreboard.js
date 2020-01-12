import React from 'react';
import { h2, li, ul } from '../styles/Scoreboard.module.css';
import playerSort from '../utils/playerSort';

export default function Scoreboard({ players }) {
    const playerList = players
        .sort(playerSort)
        .map((pl, ind) =>
            <li style={{backgroundColor: pl.color}} className={ li } key={ ind + pl.name }>
                <p>{ pl.name }</p>
                <p>{ pl.score}</p>
            </li>);
  

  

    return (
        <>
            <h2 className={ h2 }>Players: { playerList.length }</h2>

            <ul className={ ul }>{ playerList }</ul>
        
        </>
    );
  
  }