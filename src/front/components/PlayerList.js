import React from 'react';

export default function PlayerList({ users }) {
    const players = users.map((user, ind) =>
        <li key={ ind }>
            { user }
        </li>);
  

  

    return (
        <>
            <h2>Players</h2>

            <ul>{ players }</ul>
        
        </>
    );
  
  }