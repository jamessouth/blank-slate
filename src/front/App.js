import React, { useState, useEffect, useReducer } from 'react';
import { initialState, reducer } from './reducers/appState';
import Form from './components/Form';
import Name from './components/Name';
import Scoreboard from './components/Scoreboard';
import { btn, h1, hide, p, show } from './styles/index.css';

const server = 'ws://localhost:8000';
const ws = new WebSocket(server + '/ws');

export default function App() {
  console.log('app');


  

  
  const [hasJoined, setHasJoined] = useState(false);
  
  const [playerName, setPlayerName] = useState('');
  const [connected, setConnected] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [startTimer, setStartTimer] = useState(null);
  const [gameType, setGameType] = useState(null);
  const [gameTypeSignal, setGameTypeSignal] = useState(true);
  const [dupeName, setDupeName] = useState(false);
  const [playerColor, setPlayerColor] = useState(null);
  const [
    {
      players,
    },
    dispatch
  ] = useReducer(reducer, initialState);



useEffect(() => {
  console.log('useee: ', 'ppp');
  if (gameType) {
    setTimeout(() => {
      setGameTypeSignal(false);
    }, 3000);

    setTimeout(() => {
      setGameType(null);
      ws.send(JSON.stringify({
        message: 'serve'
      }));
    }, 4000);

  }
}, [gameType]);


  // useEffect(() => {
  //   console.log('useeff: ', startTimer);
  //   if (startTimer == 0) {

  //   }
  // }, [startTimer]);

  
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
        setDupeName(false);
      } else if (data.message) {
        if (data.message.startsWith('remove')) {

          setGameStarted(true);
        } else if (data.message.startsWith('color')) {
          const color = data.message.split(': ')[1];
          setPlayerColor(color);

        } else if(data.message.startsWith('name')) {
          const name = data.message.split(': ')[1];
          setPlayerName(name);
          setHasJoined(true);

        } else if (data.message.startsWith('game')) {
          const type = data.message.split(': ')[1];
          if (type == 'mixed') {
            setGameType('A mix of blank-first and word-first');
          } else if (type == 'blank_first') {
            setGameType('Blank-first cards only');
          } else {
            setGameType('Word-first cards only');
          }
        } else if (data.message.startsWith('dup')) {
          setDupeName(true);
        }
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



  function send(name, vote) {
    if (!hasJoined) {

      
      ws.send(JSON.stringify({
        playerName: name,
        message: "connect"
      }));

      ws.send(JSON.stringify({
        message: `vote: ${vote}`
      }));
      // setInputText('');
    } else {
      // answers
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
      {
        connected && playerName.length > 0 &&
        <Name
          playerName={ playerName }
        />
      }


      <h1 style={{backgroundColor: playerColor}} className={ h1 }>BLANK SLATE</h1>


      {
        players.length > 0 && connected &&
          <Scoreboard players={ players } />
      }
        
      {
        !gameStarted && connected && hasJoined &&
          <>
            {
              players.length < 3 &&
                  <p className={ p }>Waiting for at least { 3 - players.length } more { 3 - players.length == 1 ? 'player' : 'players' }...</p>
            }
            <button
              className={ btn }
              type="button"
              onClick={ startGame }
              { ...(players.length < 3 ? { 'disabled': true } : {}) }
            >
              Start Game
            </button>
          </>
      }

      {
        connected &&
          <Form
            dupeName={ dupeName }
            playerName={ playerName }
            hasJoined={ hasJoined }
            onEnter={ (name, vote) => send(name, vote) }
            send={ send }
          />
      }

      {
        !connected &&
        <p style={{'textAlign': 'center'}}>Server not available. Please try again.</p>
      }

      {
        gameStarted && connected && startTimer > 0 &&
          <>
            <p>Game starts in: { startTimer } seconds</p>

          </>
      }
      {
        gameStarted && connected && gameType &&
          <p className={ gameTypeSignal ? show : hide }>Game type: { gameType }</p>
      }

    </main>
  );
}

// className={ button }



// Image by <a href="https://pixabay.com/users/stux-12364/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=1072366">Thanks for your Like • donations welcome</a> from <a href="https://pixabay.com/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=1072366">Pixabay</a>



// 454