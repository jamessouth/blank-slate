import React from 'react';
import { div, h2, li, p, ul } from '../styles/Scoreboard.module.css';
import playerSort from '../utils/playerSort';

export default function Scoreboard({ hidden, players, score, showScores, shown, word }) {
    const sortFunc = score ? playerSort('score', -1) : playerSort('answer', 1);

    const playerList = players
        .sort(sortFunc)
        .map((pl, ind) =>
            <li style={{backgroundColor: pl.color}} className={ li } key={ ind + pl.name }>
                <p>{ pl.name }</p>
                {
                    !score &&
                        <p className={ p }>{ pl.answer }</p>
                }
                {
                    score &&
                        <p>{ pl.score }</p>
                }
            </li>);

    const titleStart = score ? 'Players:' : 'Last round:';

    const titleEnd = score ? playerList.length : word;

    return (
        <div className={ div } style={  {transform: showScores ? shown: hidden }}>
            <h2 className={ h2 }>{ titleStart }&nbsp;&nbsp;{ titleEnd }</h2>

            <ul className={ ul }>{ playerList }</ul>
        
        </div>
    );
  
  }