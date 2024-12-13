import { actionTypes } from '../actions/actionTypes';
import { currentProgram } from './initialState';
import * as Crypto from 'expo-crypto';

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

    case actionTypes.SET_MODE:
      return {
        ...state,
        mode: action.payload
      };

    case actionTypes.SET_PROGRAMS:
      return {
        ...state,
        programs: action.payload
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

    case actionTypes.DELETE_PROGRAM: {
      // Your existing success case
      return {
        ...state,
        programs: state.programs.filter(
          program => program.id !== action.payload.programId
        ),
        error: null // Clear any previous errors
      };
    }

    case actionTypes.DELETE_PROGRAM_FAILURE: {
      // New failure case
      return {
        ...state,
        error: {
          type: 'delete', // Helps identify where the error occurred
          message: action.payload, // The error message from the catch block
          timestamp: new Date().toISOString() // Useful for debugging
        },
        // Optionally maintain a loading state
        isLoading: false
      };
    }

    // Workout-related actions

    case actionTypes.SET_ACTIVE_WORKOUT: {
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

      const updatedState = {
        ...state,
        workout: {
          ...state.workout,
          workouts: [...state.workout.workouts, newWorkout]
        }
      };

      return updatedState;
    }

    case actionTypes.UPDATE_WORKOUT_FIELD:
      return {
        ...state,
        workout: {
          ...state.workout,
          workouts: state.workout.workouts.map(w =>
            w.id === action.payload.workoutId
              ? { ...w, [action.payload.field]: action.payload.value }
              : w
          )
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

      // 1. Update workout.workouts array
      const updatedWorkouts = state.workout.workouts.map(workout => {
        if (workout.id === workoutId) {
          return {
            ...workout,
            exercises: [...(workout.exercises || []), ...exercises]
          };
        }
        return workout;
      });

      // 2. Update program.workouts array
      const updatedProgram = {
        ...state.program,
        workouts: state.program.workouts.map(workout => {
          if (workout.id === workoutId) {
            return {
              ...workout,
              exercises: [...(workout.exercises || []), ...exercises]
            };
          }
          return workout;
        })
      };

      // 3. Update the program in programs array
      const updatedPrograms = state.programs.map(program => {
        if (program.id === state.program.id) {
          return {
            ...program,
            workouts: program.workouts.map(workout => {
              if (workout.id === workoutId) {
                return {
                  ...workout,
                  exercises: [...(workout.exercises || []), ...exercises]
                };
              }
              return workout;
            })
          };
        }
        return program;
      });

      return {
        ...state,
        program: updatedProgram,
        workout: {
          ...state.workout,
          workouts: updatedWorkouts
        },
        programs: updatedPrograms
      };
    }

    case actionTypes.UPDATE_EXERCISE:
      return {
        ...state,
        workout: {
          ...state.workout,
          workouts: state.workout.workouts.map(workout => {
            if (workout.id === action.payload.workoutId) {
              return {
                ...workout,
                exercises: action.payload.updatedExercises
              };
            }
            return workout;
          })
        }
      };

    case actionTypes.REMOVE_EXERCISE: {
      const { workoutId, exerciseId } = action.payload;

      // Ensure the active workout ID is available and matches the workoutId
      if (state.workout.activeWorkout !== workoutId) {
        console.error('Workout ID does not match the active workout.');
        return state;
      }
      const updatedWorkouts = state.workout.workouts.map(workout => {
        if (workout.id === workoutId) {
          // Filter out the exercise to be deleted
          const updatedExercises = workout.exercises.filter(
            exercise => exercise.id !== exerciseId
          );

          // Reorder the remaining exercises
          const reorderedExercises = updatedExercises.map(
            (exercise, index) => ({
              ...exercise,
              order: index + 1 // Adjust the order
            })
          );

          return { ...workout, exercises: reorderedExercises };
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
                    // Calculate the new order based on the current number of sets
                    const newOrder = exercise.sets.length + 1;
                    return {
                      ...exercise,
                      sets: [
                        ...exercise.sets,
                        { ...newSet, id: Crypto.randomUUID(), order: newOrder }
                      ]
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
