const initialState = {
    users: [],
};
  
function reducer(state, { type, payload: { users } }) {

    switch (type) {

        case 'updateUsers':
            return {
                ...state,
                users
            };

        default:
            throw new Error('Reducer action type not recognized');
    }

}

export { initialState, reducer };