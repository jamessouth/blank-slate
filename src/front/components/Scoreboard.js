import React from 'react';
import { h2, li, ul } from '../styles/Scoreboard.module.css';

export default function Scoreboard({ players }) {
    const playerList = players
        .sort((a, b) => a > b ? 1 : -1)
        .map((user, ind) =>
            <li className={ li } key={ ind }>
                <p>{ user }</p>
                <p>58</p>
            </li>);
  

  

    return (
        <>
            <h2 className={ h2 }>Players: { playerList.length }</h2>

            <ul className={ ul }>{ playerList }</ul>
        
        </>
    );
  
  }