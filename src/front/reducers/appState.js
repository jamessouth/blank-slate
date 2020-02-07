const initialState = {
  h1Text: 'BLANK SLATE',
  newWord: '',
  oldWord: '',
  playerName: '',
  players: [],
};
  
function reducer(state, { type, name, players, winners, word }) {
  switch (type) {
  case 'player':
    return {
      ...state,
      playerName: name
    };
  case 'players':
    return {
      ...state,
      players
    };
  case 'winners': {
    const win = winners.includes(state.playerName) ? 'YOU WON!!' : 'YOU LOST!!';
    return {
      ...state,
      h1Text: win
    };
  }
  case 'word':
    return {
      ...state,
      oldWord: state.newWord,
      newWord: word
    };
  default:
    throw new Error('Reducer action type not recognized');
  }
}

export { initialState, reducer };