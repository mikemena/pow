import { programReducer } from './programReducer';
import { workoutReducer } from './workoutReducer';
import { activeWorkoutReducer } from './activeWorkoutReducer.js';
import { initialState } from './initialState';
import { actionTypes } from '../actions/actionTypes';

const combineReducers = reducers => {
  return (state = {}, action) => {
    let hasChanged = false;
    const nextState = Object.keys(reducers).reduce((acc, key) => {
      const reducer = reducers[key];
      const previousStateForKey = state[key];
      const nextStateForKey = reducer(previousStateForKey, action);
      hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
      return { ...acc, [key]: nextStateForKey };
    }, {});
    return hasChanged ? nextState : state;
  };
};

const rootReducer = combineReducers({
  program: programReducer
});

const mainReducer = (state, action) => {
  if (action.type === actionTypes.CLEAR_STATE) {
    return initialState;
  }

  if (action.type === actionTypes.TOGGLE_EXERCISE_SELECTION) {
    const activeWorkoutId = state.activeWorkout;
    if (!activeWorkoutId) {
      console.error('No active workout when trying to toggle exercise');
      return state;
    }

    return {
      ...state,
      workouts: {
        ...state.workouts,
        [activeWorkoutId]: workoutReducer(
          state.workouts[activeWorkoutId],
          action
        )
      }
    };
  }

  return rootReducer(state, action);
};

export default mainReducer;
