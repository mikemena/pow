import { v4 as uuidv4 } from 'uuid';
import { initialState } from './programReducer';

function exerciseReducer(state = initialState, action) {
  switch (action.type) {
    //For adding a new workout to the program.
    case 'ADD_EXERCISE':
      // Map through workouts to find the specific one to update
      return {
        ...state,
        program: {
          ...state.program,
          workouts: state.program.workouts.map(workout => {
            if (workout.id === action.payload.workoutId) {
              // Construct the new exercise with a unique ID and the correct order
              const newExercise = {
                ...action.payload.exercise,
                id: uuidv4(), // Generate a new ID for the exercise
                exerciseCatalogId: action.payload.exercise.id,
                isNew: true,
                sets: [
                  {
                    id: uuidv4(),
                    reps: '',
                    weight: '',
                    order: workout.exercises.length + 1, // Increment order based on the number of existing exercises
                    isNew: true
                  }
                ]
              };

              // Return the updated workout with the new exercise appended
              return {
                ...workout,
                exercises: [...workout.exercises, newExercise]
              };
            }
            return workout;
          })
        }
      };

    //Changes to a workout that might involve renaming or perhaps changing other properties.
    case 'UPDATE_WORKOUT':
      return {
        ...state,
        program: {
          ...state.program,
          workouts: state.program.workouts.map(workout =>
            workout.id === action.payload.id ? action.payload : workout
          )
        }
      };

    case 'DELETE_WORKOUT':
      const workoutIndex = state.program.workouts.findIndex(
        workout => workout.id === action.payload
      );

      // Prevent deleting if only one workout exists
      if (state.program.workouts.length <= 1) {
        return state; // Optionally handle the error as needed
      }

      const updatedWorkouts = state.program.workouts.filter(
        workout => workout.id !== action.payload
      );

      // Determine the new active workout if necessary
      let newActiveWorkout = null;
      if (state.activeWorkout && state.activeWorkout.id === action.payload) {
        if (workoutIndex === state.program.workouts.length - 1) {
          // If it was the last workout, set the previous one as active
          newActiveWorkout = updatedWorkouts[workoutIndex - 1];
        } else {
          // Otherwise, set the next workout as active (or previous if it was the last)
          newActiveWorkout = updatedWorkouts[Math.max(0, workoutIndex)];
        }
      } else {
        newActiveWorkout = state.activeWorkout;
      }

      return {
        ...state,
        program: {
          ...state.program,
          workouts: updatedWorkouts
        },
        activeWorkout: newActiveWorkout
      };

    default:
      return state;
  }
}

export { exerciseReducer, initialState };
