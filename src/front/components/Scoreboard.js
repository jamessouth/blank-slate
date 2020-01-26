import React from 'react';
import { div, h2, li, p, ul } from '../styles/Scoreboard.module.css';
import playerSort from '../utils/playerSort';

export default function Scoreboard({ hidden, players, showScores, shown }) {
    const playerList = players
        .sort(playerSort)
        .map((pl, ind) =>
            <li style={{backgroundColor: pl.color}} className={ li } key={ ind + pl.name }>
                <p>{ pl.name }</p>
                {
                    !showScores &&
                        <p className={ p }>{ pl.answer }</p>
                }
                {
                    showScores &&
                        <p>{ pl.score }</p>
                }
            </li>);

    return (
        <div className={ div } style={  {transform: showScores ? shown: hidden }}>
            <h2 className={ h2 }>Players:&nbsp;&nbsp;{ playerList.length }</h2>

            <ul className={ ul }>{ playerList }</ul>
        
        </div>
    );
  
  }