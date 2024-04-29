import { v4 as uuidv4 } from 'uuid';
import { initialState } from './programReducer';

function exerciseReducer(state = initialState, action) {
  switch (action.type) {
    case 'ADD_EXERCISE':
      return {
        ...state,
        program: {
          ...state.program,
          workouts: state.program.workouts.map(workout => {
            if (workout.id === action.payload.workoutId) {
              const currentExercises = workout.exercises ?? [];
              const newExercises = action.payload.exercises.reduce(
                (acc, exercise) => {
                  if (
                    !currentExercises.some(
                      ex => ex.exerciseCatalogId === exercise.exerciseCatalogId
                    )
                  ) {
                    const newExercise = {
                      ...exercise,
                      id: uuidv4(),
                      isNew: true
                    };
                    acc.push(newExercise);
                  }
                  return acc;
                },
                []
              );

              return {
                ...workout,
                exercises: [...currentExercises, ...newExercises]
              };
            }
            return workout;
          })
        }
      };

    case 'UPDATE_EXERCISE':
      return {
        ...state,
        program: {
          ...state.program,
          workouts: state.program.workouts.map(workout => {
            if (workout.id === action.payload.workoutId) {
              // Map through exercises to update the specific one
              const updatedExercises = workout.exercises.map(exercise => {
                if (
                  exercise.catalog_exercise_id ===
                  action.payload.updatedExercise.catalog_exercise_id
                ) {
                  return {
                    ...exercise,
                    ...action.payload.updatedExercise
                  };
                }
                return exercise;
              });
              return {
                ...workout,
                exercises: updatedExercises
              };
            }
            return workout;
          })
        }
      };
    case 'DELETE_EXERCISE':
      return {
        ...state,
        program: {
          ...state.program,
          workouts: state.program.workouts.map(workout => {
            if (workout.id === action.payload.workoutId) {
              // Filter out the exercise that needs to be deleted
              const filteredExercises = workout.exercises.filter(
                exercise => exercise.id !== action.payload.exerciseId
              );
              return {
                ...workout,
                exercises: filteredExercises
              };
            }
            return workout;
          })
        }
      };

    default:
      return state;
  }
}

export { exerciseReducer, initialState };
