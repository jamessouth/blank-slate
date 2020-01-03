import React, { useState, useEffect, useReducer } from 'react';
import { initialState, reducer } from './reducers/appState';
import PlayerList from './components/PlayerList';

const server = 'ws://localhost:8000';
const ws = new WebSocket(server + '/ws');

export default function App() {
  console.log('app');

  const [hasJoined, setHasJoined] = useState(false);
  const [answer, setAnswer] = useState('');
  const [username, setUsername] = useState('');
  const [connected, setConnected] = useState(false);
  const [
    {
      users,
    },
    dispatch
  ] = useReducer(reducer, initialState);

  
  useEffect(() => {
    console.log('connect to server...', Date.now());


    ws.addEventListener('open', function (e) {
      setConnected(true);
      console.log(e, Date.now());
    }, false);

    ws.addEventListener('message', function (e) {
      console.log(e);
      // const data = { user: JSON.parse(e.data).message };
      // dispatch({ type: 'updateUsers', payload: data });
    }, false);

    ws.addEventListener('error', function (e) {
      console.log(e, Date.now());
    }, false);

    ws.addEventListener('close', function (e) {
      console.log(e, Date.now());
    }, false);

    

    return function cleanup() {
      ws.close(1000);
    };

  }, []);



  function send(text) {
    if (!hasJoined) {
      setUsername(text);
      setHasJoined(true);
      ws.send(JSON.stringify({
        username: text,
        message:"connect"
      }));
      setAnswer('');
    } else {

    }
  }



  return (
    <main>
      <h1>Blank Slate</h1>
      {
        username.length > 0 && <p>Hello, { username }</p>
      }

      <input value={ answer } onChange={ e => setAnswer(e.target.value) } type="text" placeholder={ hasJoined ? "Answer" : "Name" }/>

      {
        connected &&
          <button
            type="button"
            onClick={() => send(answer)}
            >
            submit
          </button>
      }
      {
        users.length > 0 &&
          <PlayerList users={ users } />
      }






    </main>
  );
}

// className={ button }

