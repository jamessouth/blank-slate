import React from 'react';

export default function PlayerList({ players }) {
    const playerList = players
        .sort((a, b) => a > b ? 1 : -1)
        .map((user, ind) =>
            <li key={ ind }>
                { user }
            </li>);
  

  

    return (
        <>
            <h2>Players: { playerList.length }</h2>

            <ul>{ playerList }</ul>
        
        </>
    );
  
  }