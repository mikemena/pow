import { actionTypes } from '../actions/actionTypes';
import { v4 as uuidv4 } from 'uuid';

function exerciseReducer(state = {}, action) {
  switch (action.type) {
    case actionTypes.ADD_EXERCISE: {
      const { workoutId, exercises } = action.payload;
      const currentExercises = state[workoutId] || [];
      const exerciseIds = currentExercises.map(ex => ex.id);

      const newExercises = exercises
        .filter(ex => !exerciseIds.includes(ex.id))
        .map(exercise => ({
          ...exercise,
          id: uuidv4(), // Ensure a unique id for each exercise instance
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
      const { workoutId, exerciseId } = action.payload;
      return {
        ...state,
        [workoutId]: state[workoutId].filter(ex => ex.id !== exerciseId)
      };
    }

    default:
      return state;
  }
}

export { exerciseReducer };
