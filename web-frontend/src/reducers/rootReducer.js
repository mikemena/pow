import { programReducer } from './programReducer';
import { workoutReducer } from './workoutReducer';
import { exerciseReducer } from './exerciseReducer';
import { setReducer } from './setReducer.js';
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
  programs: programReducer,
  workouts: workoutReducer,
  exercises: exerciseReducer,
  sets: setReducer,
  activeWorkout: activeWorkoutReducer
});

const mainReducer = (state, action) => {
  if (action.type === actionTypes.CLEAR_STATE) {
    return initialState; // Reset state to initial state
  }
  return rootReducer(state, action);
};

export default mainReducer;
