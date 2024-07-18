import { actionTypes } from '../actions/actionTypes';
import { v4 as uuidv4 } from 'uuid';

function exerciseReducer(state = {}, action) {
  switch (action.type) {
    case actionTypes.ADD_EXERCISE: {
      const { workoutId, exercises = [] } = action.payload;
      const currentExercises = state[workoutId] || [];
      const exerciseIds = currentExercises.map(ex => ex.id);

      const newExercises = exercises
        .filter(ex => !exerciseIds.includes(ex.id))
        .map((exercise, index) => ({
          ...exercise,
          order: currentExercises.length + index + 1,
          id: uuidv4(),
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
    }

    case actionTypes.DELETE_EXERCISE: {
      if (!action.payload) {
        console.error('Invalid payload for DELETE_EXERCISE', action.payload);
        return state;
      }
      const { workoutId, exerciseId } = action.payload;

      // Filter out the deleted exercise and reorder the remaining exercises
      const updatedExercises = state[workoutId]
        .filter(ex => ex.id !== exerciseId)
        .map((exercise, index) => ({
          ...exercise,
          order: index + 1
        }));

      return {
        ...state,
        [workoutId]: updatedExercises
      };
    }

    default:
      return state;
  }
}

export { exerciseReducer };
