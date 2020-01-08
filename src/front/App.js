import React, { useState, useEffect, useReducer } from 'react';
import { initialState, reducer } from './reducers/appState';
import PlayerList from './components/PlayerList';
import Radio from './components/Radio';

const server = 'ws://localhost:8000';
const ws = new WebSocket(server + '/ws');

export default function App() {
  console.log('app');


  

  const [radioValue, setRadioValue] = useState('mixed');
  const [hasJoined, setHasJoined] = useState(false);
  const [inputText, setInputText] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [connected, setConnected] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [startTimer, setStartTimer] = useState(null);
  const [
    {
      players,
    },
    dispatch
  ] = useReducer(reducer, initialState);






  

  
  function handleRadioChange(val) {
    setRadioValue(val);
  }

  useEffect(() => {
    console.log('useeff: ', startTimer);
    if (startTimer == 0) {
      ws.send(JSON.stringify({
        message: `vote: ${radioValue}`
      }));
    }
  }, [startTimer]);

  
  useEffect(() => {
    console.log('connect to server...', Date.now());




    ws.addEventListener('open', function (e) {
      setConnected(true);
      console.log(e, Date.now());
    }, false);





    ws.addEventListener('message', function (e) {
      const data = JSON.parse(e.data);
      console.log('msg: ', e, data);

      if (data.players) {
        dispatch({ type: 'updateUsers', payload: data });
      
      } else if (data.message && data.message.startsWith('remove')) {
        setGameStarted(true);
      } else if (data.time) {
        setStartTimer(data.time - 1);
      } else {
        setGameStarted(true);
      }

    }, false);



    ws.addEventListener('error', function (e) {
      console.log(e, Date.now());
    }, false);

    ws.addEventListener('close', function (e) {
      setConnected(false);
      console.log(e, Date.now());
    }, false);

    

    return function cleanup() {
      ws.close(1000);
    };

  }, []);



  function send(text) {
    if (!hasJoined) {
      setPlayerName(text);
      setHasJoined(true);
      ws.send(JSON.stringify({
        playerName: text,
        message: "connect"
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
        playerName.length > 0 && connected && <p>Hello, { playerName }</p>
      }



      {
        connected &&
          <>
            <input
              value={ inputText }
              onChange={ e => setInputText(e.target.value) }
              type="text"
              placeholder={ hasJoined ? "Answer" : "Name" }
            />
            <button
              type="button"
              onClick={() => send(inputText)}
            >
              submit
            </button>
          </>
      }

      {
        !connected &&
          <p>Server not available. Please try again.</p>
      }




      {
        players.length > 0 && connected &&
          <PlayerList players={ players } />
      }
      {
        !gameStarted && connected &&
          <button
            type="button"
            onClick={ startGame }
            { ...(players.length < 3 ? { 'disabled': true } : {}) }
          >
            Start Game
          </button>
      }
      {
        gameStarted && connected && startTimer > 0 &&
          <>
            <p>Game starts in: { startTimer } seconds</p>
            <Radio
              text="Word, Blank"
              onChange={ handleRadioChange }
              value="word_first"
            />

            <Radio
              text="Blank, Word"
              onChange={ handleRadioChange }
              value="blank_first"
            />
          </>
      }






    </main>
  );
}

// className={ button }


























// 454