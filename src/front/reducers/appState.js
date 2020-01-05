const initialState = {
    players: [],
};
  
function reducer(state, { type, payload: { players } }) {

    switch (type) {

        case 'updateUsers':
            return {
                ...state,
                players
            };

        default:
            throw new Error('Reducer action type not recognized');
    }

}

export { initialState, reducer };