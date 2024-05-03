import { v4 as uuidv4 } from 'uuid';

const initialState = {
  program: {
    workouts: []
  },
  activeWorkout: null
};

function workoutReducer(state = initialState, action) {
  switch (action.type) {
    //For adding a new workout to the program.
    case 'ADD_WORKOUT':
      console.log('ADD_WORKOUT called from workoutReducer.js');
      // Find the highest index used in existing workout names
      const maxIndex = state.program.workouts.reduce((max, workout) => {
        console.log('maxIndex called from workoutReducer.js', maxIndex);
        const match = workout.name.match(/Workout (\d+)/); // Assuming the format "Workout 1", "Workout 2", etc.
        const index = match ? parseInt(match[1], 10) : 0;
        return Math.max(max, index);
      }, 0);

      // Create a new workout with an incremented title index or use the provided name
      const workoutTitle = action.payload.name || `Workout ${maxIndex + 1}`;

      const newWorkout = {
        id: uuidv4(), // Ensure a unique ID for the workout
        name: workoutTitle,
        exercises: [],
        active: false // Assume new workouts are initially not active unless specified
      };

      return {
        ...state,
        program: {
          ...state.program,
          workouts: [...state.program.workouts, newWorkout]
        },
        activeWorkout: newWorkout // Optionally set the new workout as active immediately
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

export { workoutReducer };
