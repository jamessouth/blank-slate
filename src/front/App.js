import React, { useState, useEffect, useReducer } from 'react';
import { initialState, reducer } from './reducers/appState';
import Form from './components/Form';
import Name from './components/Name';
import Start from './components/Start';
import Timer from './components/Timer';
import Word from './components/Word';
import Scoreboard from './components/Scoreboard';
import { div, h1, winner } from './styles/index.css';

const server = 'ws://localhost:8000';
const ws = new WebSocket(server + '/ws');

export default function App() {
  console.log('app');

  const [hasJoined, setHasJoined] = useState(false);
  const [connected, setConnected] = useState(false);
  const [showStartTimer, setShowStartTimer] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [timer, setTimer] = useState(null);
  const [showSVGTimer, setShowSVGTimer] = useState(true);
  const [showReset, setShowReset] = useState(false);
  const [winners, setWinners] = useState('');
  const [showWords, setShowWords] = useState(false);
  const [showStartButton, setShowStartButton] = useState(true);
  const [gameHasBegun, setGameHasBegun] = useState(false);
  const [dupeName, setDupeName] = useState(false);
  const [invalidInput, setInvalidInput] = useState(false);
  const [playerColor, setPlayerColor] = useState(null);
  const [
    {
      h1Text,
      newWord,
      oldWord,
      playerName,
      players,
    },
    dispatch
  ] = useReducer(reducer, initialState);

  useEffect(() => {
    console.log('useeee: ', 'timeout');
    if (invalidInput) {

      setTimeout(() => {
        console.log('useeee: ', 'timeout5555555555555');
        setInvalidInput(false);
      }, 3750);
    }
  }, [invalidInput]);

  
  useEffect(() => {
    console.log('connect to server...', Date.now());

    ws.addEventListener('open', function (e) {
      setConnected(true);
      console.log(e, Date.now());
    }, false);


    


    





    



    ws.addEventListener('message', function (e) {
      const {
        message,
        player,
        players,
        time,
        winners,
        word
      } = JSON.parse(e.data);
      console.log('msg: ', e.data);

      switch (true) {
        case !!message:
          switch (message) {
            case 'duplicate':
              setDupeName(true);
              break;
            case 'invalid':
              setInvalidInput(true);
              break;
            case 'progress':
              setGameHasBegun(true);
              setShowStartTimer(true);
              break;
            case 'reset':
              window.location.reload();
              break;
            default:
              console.log('no case for this message found: ', message);
          }
          break;
        case !!player:
          const { color, name } = player;
          setPlayerColor(color);
          dispatch({ type: 'player', name });
          setHasJoined(true);
          break;
        case !!players:
          dispatch({ type: 'players', players });
          setDupeName(false);
          break;
        case !!time:
          setShowStartTimer(true);
          setShowStartButton(false);
          setTimer(time - 1);
          break;
        case !!winners:
          dispatch({ type: 'winners', winners });
          setWinners(winners)
          dispatch({ type: 'word', word: '' });
          setTimeout(() => {
            setShowReset(true);
          }, 5000);
          break
        case !!word:
          setAnswered(false);
          setShowSVGTimer(true);
          dispatch({ type: 'word', word });
          setShowWords(true);
          setShowStartTimer(false);
          break;
        default:
          console.log('no case found: ', e.data);
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
      ws.send(JSON.stringify({
        name: text,
      }));
    } else {
      setAnswered(true);
      setShowSVGTimer(false);
      ws.send(JSON.stringify({
        answer: text,
      }));
    }
  }


  



  function startGame() {
    console.log('start');
    setShowStartButton(false);
    ws.send(JSON.stringify({
      message: "start"
    }));
  }
  function resetGame() {
    ws.send(JSON.stringify({
      message: "reset"
    }));
  }


  return (
    <main>
      <Name
        playerName={ playerName }
      />



      <h1 style={{backgroundColor: playerColor}} className={ h1 }>{ h1Text }</h1>


      {
        players.length > 0 && connected &&
          


          <Scoreboard
            players={ players }
            word={ oldWord }
          />
          
      }
      {
        hasJoined && connected &&
          <div className={ div }>
            {
              showStartButton && hasJoined &&
                <Start
                  onClick={ startGame }
                  players={ players }
                  gameHasBegun={ gameHasBegun }
                />
            }
            {
              showStartTimer && timer > 0 &&
                <Timer
                  timer={ timer }
                />
            }
            {
              showWords && hasJoined && !winners &&
                <Word
                  onAnimationEnd={ () => send('') }
                  playerColor={ playerColor }
                  showSVGTimer={ showSVGTimer }
                  word={ newWord }
                />
            }
            {
              winners && <p className={ winner }>{ winners } { winners.includes(' and ') ? 'Win!!' : 'Wins!!'}</p>
            }
            {
              showReset &&
                <button
                  type="button"
                  onClick={ resetGame }
                >
                  Play Again
                </button>
            }
          </div>
      }
      {
        connected && !winners &&
          <Form
            answered={ answered }
            dupeName={ dupeName }
            hasJoined={ hasJoined }
            invalidInput={ invalidInput }
            onEnter={ val => send(val) }
            playerName={ playerName }
            playing={ !!newWord }
            send={ send }
          />
      }

      {
        !connected &&
        <p>Server not available. Please try again.</p>
      }



    </main>
  );
}

// className={ button }



// Image by <a href="https://pixabay.com/users/stux-12364/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=1072366">Thanks for your Like • donations welcome</a> from <a href="https://pixabay.com/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=1072366">Pixabay</a>



// Image by <a href="https://pixabay.com/users/b0red-4473488/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=3170418">b0red</a> from <a href="https://pixabay.com/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=3170418">Pixabay</a>



// 454