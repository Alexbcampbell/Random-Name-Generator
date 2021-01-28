const raffleReducer = (state = {}, action) => {
  switch (action.type) {
    case 'SET_RAFFLE_ENTRY':
      return action.payload;
    default:
      return state;
  }
};

// user will be on the redux state at:
// state.user
export default raffleReducer;
