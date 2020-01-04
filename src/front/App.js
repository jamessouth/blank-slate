import React, { useState, useEffect, useReducer } from 'react';
import { initialState, reducer } from './reducers/appState';
import PlayerList from './components/PlayerList';

const server = 'ws://localhost:8000';
const ws = new WebSocket(server + '/ws');

export default function App() {
  console.log('app');

  const [hasJoined, setHasJoined] = useState(false);
  const [inputText, setInputText] = useState('');
  const [username, setUsername] = useState('');
  const [connected, setConnected] = useState(false);
  const [closed, setClosed] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
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
      const data = JSON.parse(e.data);
      console.log('msg: ', e, data);
      if (data.users) {
        dispatch({ type: 'updateUsers', payload: data });
      
      } else {
        setGameStarted(true);
      }
    }, false);

    ws.addEventListener('error', function (e) {
      console.log(e, Date.now());
    }, false);

    ws.addEventListener('close', function (e) {
      setClosed(true);
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
      setInputText('');
    } else {

    }
  }



  function startGame() {
    console.log('start');
    ws.send(JSON.stringify({
      message: "start"
    }));
  }




  return (
    <main>
      <h1>Blank Slate</h1>
      {
        username.length > 0 && <p>Hello, { username }</p>
      }

      {
        !closed &&
            <input value={ inputText } onChange={ e => setInputText(e.target.value) } type="text" placeholder={ hasJoined ? "Answer" : "Name" }/>
      }
      {
        closed &&
            <p>Server not available. Please try again.</p>
      }





      {
        connected &&
          <button
            type="button"
            onClick={() => send(inputText)}
          >
            submit
          </button>
      }

      {
        !connected &&
            <p>connecting...</p>
      }




      {
        users.length > 0 &&
          <PlayerList users={ users } />
      }
      {
        users.length > 2 && !gameStarted &&
          <button
            type="button"
            onClick={ startGame }
          >
            Start Game
          </button>
      }






    </main>
  );
}

// className={ button }

