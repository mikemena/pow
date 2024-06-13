import { actionTypes } from '../actions/actionTypes';

function activeWorkoutReducer(state = null, action) {
  // console.log('Action Type:', action.type);
  // console.log('State Before:', state);

  switch (action.type) {
    case actionTypes.SET_ACTIVE_WORKOUT:
      return action.payload;

    default:
      return state;
  }
}

export { activeWorkoutReducer };
