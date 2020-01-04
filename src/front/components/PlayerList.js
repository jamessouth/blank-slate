import React from 'react';

export default function PlayerList({ users }) {
    const players = users
        .sort((a, b) => a > b ? 1 : -1)
        .map((user, ind) =>
            <li key={ ind }>
                { user }
            </li>);
  

  

    return (
        <>
            <h2>Players: { players.length }</h2>

            <ul>{ players }</ul>
        
        </>
    );
  
  }