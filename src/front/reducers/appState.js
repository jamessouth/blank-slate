const initialState = {
    users: [],
};
  
function reducer(state, { type, payload: { user } }) {

    switch (type) {

        case 'updateUsers':
            return {
                ...state,
                users: [...state.users, user]
            };

        default:
            throw new Error('Reducer action type not recognized');
    }

}

export { initialState, reducer };