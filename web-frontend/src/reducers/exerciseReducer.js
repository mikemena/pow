import { actionTypes } from '../actions/actionTypes';

function exerciseReducer(state = {}, action) {
  switch (action.type) {
    case actionTypes.ADD_EXERCISE:
      const { workoutId, exercises } = action.payload;
      const currentExercises = state[workoutId] || [];
      const exerciseIds = currentExercises.map(ex => ex.id);

      // Filter out exercises that already exist in the workout
      const newExercises = exercises.filter(ex => !exerciseIds.includes(ex.id));

      return {
        ...state,
        [workoutId]: [...currentExercises, ...newExercises]
      };

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
