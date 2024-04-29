import { programReducer } from './programReducer';
import { workoutReducer } from './workoutReducer';
import { exerciseReducer } from './exerciseReducer';
import { setReducer } from './setReducer.js';

const combineReducers = reducers => {
  return (state, action) => {
    return Object.keys(reducers).reduce((nextState, key) => {
      nextState[key] = reducers[key](state[key], action);
      return nextState;
    }, {});
  };
};

const rootReducer = combineReducers({
  program: programReducer,
  workouts: workoutReducer,
  exercises: exerciseReducer,
  sets: setReducer
});

export default rootReducer;
