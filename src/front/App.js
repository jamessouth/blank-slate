import React, { useState, useEffect, useReducer } from 'react';
import { initialState, reducer } from './reducers/appState';
import Form from './components/Form';
import Name from './components/Name';
import Start from './components/Start';
import Timer from './components/Timer';
import Word from './components/Word';
import Scoreboard from './components/Scoreboard';
import { div, flipL, flipR, h1, score, winner } from './styles/index.css';

const server = 'ws://localhost:8000';
const ws = new WebSocket(server + '/ws');

export default function App() {
  console.log('app');

  const [hasJoined, setHasJoined] = useState(false);
  const [showScores, setShowScores] = useState(true);
  // const [playerName, setPlayerName] = useState('');
  const [connected, setConnected] = useState(false);
  const [showStartTimer, setShowStartTimer] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [timer, setTimer] = useState(null);
  const [showSVGTimer, setShowSVGTimer] = useState(true);
  const [winners, setWinners] = useState('');
  const [showWords, setShowWords] = useState(false);
  const [showStartButton, setShowStartButton] = useState(true);
  const [gameHasBegun, setGameHasBegun] = useState(false);
  const [dupeName, setDupeName] = useState(false);
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
    console.log('connect to server...', Date.now());

    ws.addEventListener('open', function (e) {
      setConnected(true);
      console.log(e, Date.now());
    }, false);



    ws.addEventListener('message', function (e) {
      const data = JSON.parse(e.data);
      console.log('msg: ', e, data);

      switch (true) {
        case !!data.players:
          dispatch({ type: 'players', payload: data });
          setDupeName(false);
          break;
        case !!data.player:
          dispatch({ type: 'player', payload: data.player });
          // setPlayerName(data.player.name);
          setPlayerColor(data.player.color);
          setHasJoined(true);
          break;
        case !!data.word:
          setAnswered(false);
          setShowSVGTimer(true);
          dispatch({ type: 'word', payload: data });
          setShowWords(true);
          break;
        case !!data.time:
          setShowStartTimer(true);
          setShowStartButton(false);
          setTimer(data.time - 1);
          break;
        case !!data.message:
          if (data.message == 'duplicate') {

            setDupeName(true);
  
          } else if (data.message == 'in progress') {
            setGameHasBegun(true);
            setShowStartTimer(true);
          }

          break;
        case !! data.winners:
          dispatch({ type: 'winners', payload: data });
          setWinners(data.winners)
          dispatch({ type: 'word', payload: { word: '' } });
          break
        default:
          console.log('no case found: ', data);
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





  


  

  
function swipe() {
  console.log('hello: ', 'ghghgh');
  setShowScores(!showScores)
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



      <h1 style={{backgroundColor: playerColor}} className={ h1 }>{ h1Text }</h1>


      {
        players.length > 0 && connected &&
          <div style={{ height: `calc(95px + (28px * ${players.length}))` }} className={ score }>
            <button
              type="button"
              onClick={ swipe }
              className={ showScores ? flipR : flipL }
            >
            </button>
            <Scoreboard
              players={ players }
              showScores={ showScores }
              shown="translateX(0%)"
              hidden="translateX(-100%)"
              score={ true }
            />
            <Scoreboard
              players={ players }
              showScores={ !showScores }
              shown="translateX(0%)"
              hidden="translateX(100%)"
              score={ false }
              word={ oldWord }
            />
          </div>
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
          </div>
      }
      {
        connected && !winners &&
          <Form
            dupeName={ dupeName }
            playerName={ playerName }
            answered={ answered }
            hasJoined={ hasJoined }
            onEnter={ val => send(val) }
            send={ send }
            playing={ !!newWord }
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