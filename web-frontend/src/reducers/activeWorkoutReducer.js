import { actionTypes } from '../actions/actionTypes';

function activeWorkoutReducer(state, action) {
  switch (action.type) {
    case actionTypes.SET_ACTIVE_WORKOUT:
      return action.payload;
    default:
      return state;
  }
}

export { activeWorkoutReducer };
