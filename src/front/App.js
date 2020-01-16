import React, { useState, useEffect, useReducer } from 'react';
import { initialState, reducer } from './reducers/appState';
import Form from './components/Form';
import Name from './components/Name';
import Start from './components/Start';
import Timer from './components/Timer';
import Scoreboard from './components/Scoreboard';
import { div, h1, hide, show, span } from './styles/index.css';

const server = 'ws://localhost:8000';
const ws = new WebSocket(server + '/ws');

export default function App() {
  console.log('app');

  const [hasJoined, setHasJoined] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [connected, setConnected] = useState(false);
  const [showStartTimer, setShowStartTimer] = useState(false);
  const [timer, setTimer] = useState(null);
  const [showStartButton, setShowStartButton] = useState(true);
  const [gameHasBegun, setGameHasBegun] = useState(false);
  const [dupeName, setDupeName] = useState(false);
  const [playerColor, setPlayerColor] = useState(null);
  const [
    {
      players,
    },
    dispatch
  ] = useReducer(reducer, initialState);


  


// useEffect(() => {
//   console.log('useee: ', 'ppp');
//   if () {
//     setTimeout(() => {
      
      
//     }, 3000);

//     setTimeout(() => {
      
      
//       ws.send(JSON.stringify({
//         message: 'serve'
//       }));
//     }, 4000);

//   }
// }, []);


  // useEffect(() => {
  //   console.log('useeff: ', timer);
  //   if (timer == 0) {

  //   }
  // }, [timer]);

  
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
        if (data.message.startsWith('color')) {
          const color = data.message.split(': ')[1];
          setPlayerColor(color);

        } else if(data.message.startsWith('name')) {
          const name = data.message.split(': ')[1];
          setPlayerName(name);
          setHasJoined(true);

        } else if (data.message.startsWith('dup')) {
          setDupeName(true);
        } else if (data.message.startsWith('game')) {
          setGameHasBegun(true);
          setShowStartTimer(true);
        }
      } else if (data.time) {
        setShowStartTimer(true);
        setShowStartButton(false);
        setTimer(data.time - 1);
      } else {
        
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




  function send(name) {
    if (!hasJoined) {

      
      ws.send(JSON.stringify({
        playerName: name,
        message: "connect"
      }));


    } else {
      // answers
    }
  }









  function startGame() {
    console.log('start');
    setShowStartButton(false);
    ws.send(JSON.stringify({
      message: "start"
    }));
  }



  return (
    <main>
      <Name
        playerName={ playerName }
      />



      <h1 style={{backgroundColor: playerColor}} className={ h1 }>BLANK SLATE</h1>


      {
        players.length > 0 && connected &&
          <Scoreboard
            players={ players }
          />
      }
      {
        hasJoined &&
          <div className={ div }>
            {
              showStartButton && connected && hasJoined &&
                <Start
                  onClick={ startGame }
                  players={ players }
                  gameHasBegun={ gameHasBegun }
                />
            }
            {
              showStartTimer && connected && timer > 0 &&
                <Timer
                  timer={ timer }
                />
            }
          </div>
      }
      {
        connected &&
          <Form
            dupeName={ dupeName }
            playerName={ playerName }
            hasJoined={ hasJoined }
            onEnter={ name => send(name) }
            send={ send }
          />
      }

      {
        !connected &&
        <p style={{'textAlign': 'center'}}>Server not available. Please try again.</p>
      }



    </main>
  );
}

// className={ button }



// Image by <a href="https://pixabay.com/users/stux-12364/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=1072366">Thanks for your Like • donations welcome</a> from <a href="https://pixabay.com/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=1072366">Pixabay</a>



// 454