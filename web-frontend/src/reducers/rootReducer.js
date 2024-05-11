import { programReducer } from './programReducer';
import { exerciseReducer } from './exerciseReducer';
import { setReducer } from './setReducer.js';

const combineReducers = reducers => {
  return (state = {}, action) => {
    const nextState = {};
    let hasChanged = false;

    Object.keys(reducers).forEach(key => {
      const reducer = reducers[key];
      const previousStateForKey = state[key];
      const nextStateForKey = reducer(previousStateForKey, action);
      nextState[key] = nextStateForKey;
      hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
    });

    return hasChanged ? nextState : state;
  };
};

const rootReducer = combineReducers({
  program: programReducer,
  exercises: exerciseReducer,
  sets: setReducer
});

export default rootReducer;
