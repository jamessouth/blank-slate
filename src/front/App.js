import React from 'react';
import Form from './components/Form';
import KeepAlive from './components/KeepAlive';
import Name from './components/Name';
import Scoreboard from './components/Scoreboard';
import Start from './components/Start';
import Timer from './components/Timer';
import Word from './components/Word';
import { div, h1, winner } from './styles/index.css';
import useAppState from './hooks/useAppState';

export default function App() {
  const {
    answered,
    connected,
    dupeName,
    gameHasBegun,
    h1Text,
    hasJoined,
    invalidInput,
    message,
    newWord,
    oldWord,
    pingServer,
    playerColor,
    playerName,
    players,
    send,
    setShowStartButton,
    setSubmitSignal,
    showReset,
    showStartButton,
    showStartTimer,
    showSVGTimer,
    showWords,
    submitSignal,
    timer,
    winners
  } = useAppState();

  return (
    <main>
      {
        pingServer && connected &&
          <KeepAlive
            pingWS={ () => message('keepAlive') }
          />
      }
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
                  onClick={ () => {
                    message('start');
                    setShowStartButton(false);
                  } }
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
                  onAnimationEnd={ () => setSubmitSignal(true) }
                  playerColor={ playerColor }
                  showSVGTimer={ showSVGTimer }
                  word={ newWord }
                />
            }
            {
              winners && <p aria-live="assertive" role="alert" className={ winner }>{ winners } { winners.includes(' and ') ? 'Win!!' : 'Wins!!'}</p>
            }
            {
              showReset &&
                <button
                  type="button"
                  onClick={ () => message('reset') }
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
            submitSignal={ submitSignal }
          />
      }
      {
        !connected &&
        <p>Server not available. Please try again.</p>
      }
      <footer><a rel="noopener noreferrer" target="_blank" href="https://github.com/jamessouth/clean-tablet">GitHub repo (opens in new tab)</a></footer>
    </main>
  );
}
