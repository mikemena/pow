import { actionTypes } from '../actions/actionTypes';
import { programInitialState } from '../reducers/initialState';

function programReducer(state, action) {
  switch (action.type) {
    case actionTypes.SET_SELECTED_PROGRAM:
      console.log('Setting selected program:', action.payload);
      return {
        ...state,
        program: action.payload.program,
        workout: {
          ...state.workout,
          workouts: action.payload.workout.workouts,
          activeWorkout: action.payload.workout.activeWorkout
        }
      };

    case actionTypes.ADD_PROGRAM:
      return {
        ...state,
        program: action.payload
      };

    case actionTypes.UPDATE_PROGRAM:
      return {
        ...state,
        program: {
          ...state.program,
          ...action.payload
        }
      };
    case actionTypes.UPDATE_PROGRAM_SUCCESS:
      return {
        ...state,
        ...action.payload
      };

    case actionTypes.DELETE_PROGRAM:
      return programInitialState.program;

    default:
      return state;
  }
}

export { programReducer };
