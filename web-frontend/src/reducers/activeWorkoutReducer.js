import { actionTypes } from '../actions/actionTypes';

function activeWorkoutReducer(state = null, action) {
  switch (action.type) {
    case actionTypes.SET_ACTIVE_WORKOUT:
      return action.payload;

    default:
      return state;
  }
}

export { activeWorkoutReducer };
