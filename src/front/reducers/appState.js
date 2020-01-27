const initialState = {
    newWord: '',
    oldWord: '',
    players: [],
};
  
function reducer(state, { type, payload: { players, word } }) {

    switch (type) {

        case 'players':
            return {
                ...state,
                players
            };

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