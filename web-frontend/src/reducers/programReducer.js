import { actionTypes } from '../actions/actionTypes';
import { currentProgram } from './initialState';
import { v4 as uuidv4 } from 'uuid';

function programReducer(state = currentProgram, action) {
  switch (action.type) {
    case actionTypes.INITIALIZE_NEW_PROGRAM_STATE:
    case actionTypes.INITIALIZE_EDIT_PROGRAM_STATE:
      return {
        ...state,
        program: action.payload.program,
        workout: {
          workouts: action.payload.workouts,
          activeWorkout: action.payload.activeWorkout
        }
      };

    case actionTypes.UPDATE_PROGRAM_FIELD:
      return {
        ...state,
        program: {
          ...state.program,
          ...action.payload
        }
      };

    case actionTypes.UPDATE_PROGRAM_DATABASE: // For full database updates
      return {
        ...state,
        program: {
          ...state.program,
          ...action.payload.program // Merge full program updates from database response
        },
        workout: {
          workouts: action.payload.workouts, // Update workouts from database response
          activeWorkout: action.payload.activeWorkout
        }
      };
    case actionTypes.CLEAR_PROGRAM:
      return {
        ...currentProgram
      };

    // Workout-related actions

    case actionTypes.SET_ACTIVE_WORKOUT: {
      console.log(
        'SET_ACTIVE_WORKOUT in reducer - Setting active workout:',
        action.payload
      );

      const { activeWorkout } = action.payload;
      return {
        ...state,
        workout: {
          ...state.workout,
          activeWorkout: activeWorkout
        }
      };
    }

    case actionTypes.ADD_WORKOUT: {
      const newWorkout = action.payload;
      if (!newWorkout) {
        console.error('Failed to standardize workout:', action.payload);
        return state;
      }

      return {
        ...state,
        workout: {
          ...state.workout,
          workouts: [...state.workout.workouts, newWorkout]
        }
      };
    }

    case actionTypes.UPDATE_WORKOUT_FIELD:
      return {
        ...state,
        workout: {
          ...state.workout,
          ...action.payload
        }
      };

    case actionTypes.UPDATE_WORKOUT: {
      const updatedWorkout = action.payload;

      return {
        ...state,
        workout: {
          ...state.workout,
          workouts: state.workout.workouts.map(workout =>
            workout.id === updatedWorkout.id ? updatedWorkout : workout
          )
        }
      };
    }

    case actionTypes.DELETE_WORKOUT: {
      const { workoutId } = action.payload;
      return {
        ...state,
        workout: {
          ...state.workout,
          workouts: state.workout.workouts.filter(
            workout => workout.id !== workoutId
          ),
          activeWorkout:
            state.workout.activeWorkout === workoutId
              ? null
              : state.workout.activeWorkout
        }
      };
    }

    case actionTypes.ADD_EXERCISE: {
      const { workoutId, exercises } = action.payload;
      console.log('Reducer - ADD_EXERCISE payload:', action.payload);

      // Ensure the active workout ID is available and matches the workoutId
      if (state.workout.activeWorkout !== workoutId) {
        console.error('Workout ID does not match the active workout.');
        return state;
      }

      // Check if exercises is defined and an array
      if (!Array.isArray(exercises)) {
        console.error('Exercises payload is not an array or is undefined.');
        return state;
      }

      const updatedWorkouts = state.workout.workouts.map(workout => {
        if (workout.id === workoutId) {
          // Create a Set of existing catalog_exercise_ids to prevent duplicates
          const existingExerciseIds = new Set(
            workout.exercises.map(ex => ex.catalog_exercise_id)
          );

          // Filter out exercises that already exist in the workout
          const newExercises = exercises.filter(
            ex => !existingExerciseIds.has(ex.catalog_exercise_id)
          );

          // Combine the existing exercises with the new ones

          return {
            ...workout,
            exercises: [
              ...workout.exercises,
              ...newExercises.map(ex => ({
                ...ex,
                catalog_exercise_id: ex.catalog_exercise_id,
                id: ex.id || uuidv4(),
                order: workout.exercises.length + 1,
                sets: []
              }))
            ]
          };
        }
        return workout;
      });

      return {
        ...state,
        workout: {
          ...state.workout,
          workouts: updatedWorkouts
        }
      };
    }

    case actionTypes.REMOVE_EXERCISE: {
      const { workoutId, exerciseId } = action.payload;

      // Ensure the active workout ID is available and matches the workoutId
      if (state.workout.activeWorkout !== workoutId) {
        console.error('Workout ID does not match the active workout.');
        return state;
      }

      return {
        ...state,
        workout: {
          ...state.workout,
          // Update the workouts array to remove the exercise
          workouts: state.workout.workouts.map(workout => {
            if (workout.id === workoutId) {
              return {
                ...workout,
                exercises: workout.exercises
                  ? workout.exercises.filter(
                      ex =>
                        ex.id !== exerciseId &&
                        ex.catalog_exercise_id !== exerciseId
                    )
                  : []
              };
            }
            return workout;
          })
        }
      };
    }

    case actionTypes.ADD_SET: {
      const { workoutId, exerciseId, newSet } = action.payload;
      return {
        ...state,
        workout: {
          ...state.workout,
          workouts: state.workout.workouts.map(workout => {
            if (workout.id === workoutId) {
              return {
                ...workout,
                exercises: workout.exercises.map(exercise => {
                  if (exercise.id === exerciseId) {
                    return {
                      ...exercise,
                      sets: [...exercise.sets, { ...newSet, id: uuidv4() }]
                    };
                  }
                  return exercise;
                })
              };
            }
            return workout;
          })
        }
      };
    }

    case actionTypes.UPDATE_SET: {
      const { workoutId, exerciseId, updatedSet } = action.payload;
      return {
        ...state,
        workout: {
          ...state.workout,
          workouts: state.workout.workouts.map(workout => {
            if (workout.id === workoutId) {
              return {
                ...workout,
                exercises: workout.exercises.map(exercise => {
                  if (exercise.id === exerciseId) {
                    return {
                      ...exercise,
                      sets: exercise.sets.map(set =>
                        set.id === updatedSet.id
                          ? { ...set, ...updatedSet }
                          : set
                      )
                    };
                  }
                  return exercise;
                })
              };
            }
            return workout;
          })
        }
      };
    }

    case actionTypes.REMOVE_SET: {
      const { workoutId, exerciseId, setId } = action.payload;

      const updatedWorkouts = state.workout.workouts.map(workout => {
        if (workout.id === workoutId) {
          return {
            ...workout,
            exercises: workout.exercises.map(exercise => {
              if (exercise.catalog_exercise_id === exerciseId) {
                const updatedSets = exercise.sets.filter(
                  set => set.id !== setId
                );

                return {
                  ...exercise,
                  sets: updatedSets
                };
              }
              return exercise;
            })
          };
        }
        return workout;
      });

      return {
        ...state,
        workout: {
          ...state.workout,
          workouts: updatedWorkouts
        }
      };
    }

    default:
      return state;
  }
}

export { programReducer };
