import { actionTypes } from '../actions/actionTypes';
import { v4 as uuidv4 } from 'uuid';

function exerciseReducer(state = {}, action) {
  switch (action.type) {
    case actionTypes.ADD_EXERCISE:
      const { workoutId, exercises } = action.payload;
      const currentExercises = state[workoutId] || [];
      const exerciseIds = currentExercises.map(ex => ex.id);

      // Filter out exercises that already exist in the workout
      const newExercises = exercises
        .filter(ex => !exerciseIds.includes(ex.id))
        .map((exercise, index) => ({
          ...exercise,
          order: currentExercises.length + index + 1,
          catalog_exercise_id: exercise.id,
          sets: [
            {
              id: uuidv4(),
              order: 1,
              weight: 10,
              reps: 10
            }
          ]
        }));
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
