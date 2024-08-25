import { v4 as uuidv4 } from 'uuid';
import { actionTypes } from '../actions/actionTypes';
import { standardizeWorkout } from '../utils/standardizeWorkout';

function workoutReducer(state = { workouts: [], activeWorkout: null }, action) {
  switch (action.type) {
    case actionTypes.SET_ACTIVE_WORKOUT:
      return {
        ...state,
        activeWorkout: action.payload
      };

    case actionTypes.ADD_WORKOUT: {
      const newWorkout = standardizeWorkout(action.payload);
      if (!newWorkout) {
        console.error('Failed to standardize workout:', action.payload);
        return state;
      }

      return {
        ...state,
        workouts: [...state.workouts, newWorkout]
      };
    }
    case 'UPDATE_NEW_WORKOUT':
      return {
        ...state,
        workouts: state.workouts.map(w =>
          w.id === action.payload.id ? action.payload : w
        )
      };
    case 'UPDATE_SELECTED_WORKOUT':
      return {
        ...state,
        selectedWorkouts: state.selectedWorkouts.map(w =>
          w.id === action.payload.id ? action.payload : w
        )
      };

    case actionTypes.UPDATE_WORKOUT: {
      const updatedWorkout = action.payload;
      console.log('UPDATE_WORKOUT action received. Payload:', updatedWorkout);
      const newState = {
        ...state,
        workouts: state.workouts.map(workout =>
          workout.id === updatedWorkout.id ? updatedWorkout : workout
        )
      };
      console.log('New state after UPDATE_WORKOUT:', newState);
      return newState;
    }

    case actionTypes.DELETE_WORKOUT: {
      const workoutId = action.payload;
      return {
        ...state,
        workouts: state.workouts.filter(workout => workout.id !== workoutId),
        activeWorkout:
          state.activeWorkout === workoutId ? null : state.activeWorkout
      };
    }

    case actionTypes.ADD_EXERCISE: {
      const { workoutId, exercises } = action.payload;
      return {
        ...state,
        workouts: state.workouts.map(workout => {
          if (workout.id === workoutId) {
            return {
              ...workout,
              exercises: [
                ...workout.exercises,
                ...exercises.map(ex => ({
                  ...ex,
                  id: ex.id || uuidv4()
                }))
              ]
            };
          }
          return workout;
        })
      };
    }

    case actionTypes.REMOVE_EXERCISE: {
      const { workoutId, exerciseId } = action.payload;
      return {
        ...state,
        workouts: state.workouts.map(workout => {
          if (workout.id === workoutId) {
            return {
              ...workout,
              exercises: workout.exercises.filter(
                ex =>
                  ex.id !== exerciseId && ex.catalog_exercise_id !== exerciseId
              )
            };
          }
          return workout;
        })
      };
    }

    case actionTypes.ADD_SET: {
      const { workoutId, exerciseId, newSet } = action.payload;
      return {
        ...state,
        workouts: state.workouts.map(workout => {
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
      };
    }

    case actionTypes.UPDATE_SET: {
      const { workoutId, exerciseId, updatedSet } = action.payload;
      return {
        ...state,
        workouts: state.workouts.map(workout => {
          if (workout.id === workoutId) {
            return {
              ...workout,
              exercises: workout.exercises.map(exercise => {
                if (exercise.id === exerciseId) {
                  return {
                    ...exercise,
                    sets: exercise.sets.map(set =>
                      set.id === updatedSet.id ? { ...set, ...updatedSet } : set
                    )
                  };
                }
                return exercise;
              })
            };
          }
          return workout;
        })
      };
    }

    case actionTypes.REMOVE_SET: {
      const { workoutId, exerciseId, setId } = action.payload;
      return {
        ...state,
        workouts: state.workouts.map(workout => {
          if (workout.id === workoutId) {
            return {
              ...workout,
              exercises: workout.exercises.map(exercise => {
                if (exercise.id === exerciseId) {
                  return {
                    ...exercise,
                    sets: exercise.sets.filter(set => set.id !== setId)
                  };
                }
                return exercise;
              })
            };
          }
          return workout;
        })
      };
    }

    default:
      return state;
  }
}

export { workoutReducer };
