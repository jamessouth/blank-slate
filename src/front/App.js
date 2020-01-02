import React, { useState, useEffect, useReducer } from 'react';




export default function App() {
  const server = 'ws://localhost:8000';

  const [hasJoined, setHasJoined] = useState(false);
  const [answer, setAnswer] = useState('');

  
  useEffect(() => {
    console.log('connect to server...', Date.now());

    const ws = new WebSocket(server + '/ws');


    ws.addEventListener('message', function (e) {
      console.log(e, Date.now());
    }, false);

    ws.addEventListener('error', function (e) {
      console.log(e, Date.now());
    }, false);


    return function cleanup() {
      console.log(Date.now())
      ws.close();
    };

  }, []);



  


  



  

  return (
    <main>
      <h1>Blank Slate</h1>


      <input value={ answer } onChange={ e => setAnswer(e.target.value) } type="text" placeholder={ hasJoined ? "Answer" : "Name" }/>

      <button
        type="button"
        onClick={() => postQuery(queryText)}
        >
        submit
      </button>


    </main>
  );
}

// className={ button }

