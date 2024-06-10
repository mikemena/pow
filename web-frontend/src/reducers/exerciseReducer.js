import { actionTypes } from '../actions/actionTypes';

function exerciseReducer(state = {}, action) {
  switch (action.type) {
    case actionTypes.ADD_EXERCISE:
      const { workoutId, exercises } = action.payload;

      console.log('State before ADD_EXERCISE:', state);
      console.log('Workout ID:', workoutId);
      console.log('Exercises to add:', exercises);

      if (!workoutId) {
        console.error('No workout ID provided');
        return state;
      }

      const updatedState = {
        ...state,
        [workoutId]: [...(state[workoutId] || []), ...exercises]
      };

      console.log('State after ADD_EXERCISE:', updatedState);
      return updatedState;

    case actionTypes.DELETE_EXERCISE:
      const { workoutId: wId, exerciseId } = action.payload;

      if (!wId || !state[wId]) {
        console.error('No active workout or workout does not exist:', wId);
        return state;
      }

      return {
        ...state,
        [wId]: state[wId].filter(ex => ex.id !== exerciseId)
      };

    default:
      return state;
  }
}

export { exerciseReducer };
