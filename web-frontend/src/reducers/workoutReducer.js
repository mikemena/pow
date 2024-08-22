import { v4 as uuidv4 } from 'uuid';
import { actionTypes } from '../actions/actionTypes';
import { initialState } from './initialState';
import exerciseUtils from '../utils/exercise.js';
import { standardizeWorkout } from '../utils/standardizeWorkout';

function workoutReducer(state = initialState, action) {
  switch (action.type) {
    // Workout Reducers

    case actionTypes.SET_ACTIVE_WORKOUT: {
      const workoutId = action.payload;

      console.log('Workout ID to activate:', workoutId);
      console.log('State before activating workout:', state.program.workouts);

      return {
        ...state,
        activeWorkout: workoutId,
        workouts: {
          ...state.workouts,
          [workoutId]: {
            ...state.workouts[workoutId],
            active: true
          }
        }
      };
    }

    case actionTypes.ADD_WORKOUT: {
      const newWorkout = standardizeWorkout(action.payload);
      if (!newWorkout) {
        console.error('Failed to standardize workout:', action.payload);
        return state;
      }
      return {
        ...state,
        workouts: {
          ...state.workouts,
          [newWorkout.id]: newWorkout
        }
      };
    }

    case actionTypes.UPDATE_WORKOUT: {
      const updatedWorkout = action.payload;

      return {
        ...state,
        workouts: {
          ...state.workouts,
          [updatedWorkout.id]: updatedWorkout
        }
      };
    }

    case actionTypes.DELETE_WORKOUT: {
      const workoutId = action.payload;
      const { [workoutId]: _, ...remainingWorkouts } = state.workouts;

      return {
        ...state,
        workouts: remainingWorkouts
      };
    }

    // Exercise Reducers

    case actionTypes.ADD_EXERCISE: {
      const { workoutId, exercises } = action.payload;

      const updatedWorkout = {
        ...state.workouts[workoutId],
        exercises: [
          ...state.workouts[workoutId].exercises,
          ...exercises.map(ex => ({
            ...exerciseUtils.standardizeExercise(ex),
            id: ex.id || null,
            tempId: ex.tempId || uuidv4() // Generate tempId for new exercises if not present
          }))
        ]
      };

      return {
        ...state,
        workouts: {
          ...state.workouts,
          [workoutId]: updatedWorkout
        }
      };
    }

    case actionTypes.TOGGLE_EXERCISE_SELECTION: {
      const { workoutId, exerciseIdForToggle, exerciseData } = action.payload;

      const existingExerciseIndex = state.workouts[
        workoutId
      ].exercises.findIndex(
        ex => ex.id === exerciseIdForToggle || ex.tempId === exerciseIdForToggle
      );

      let updatedExercises;
      if (existingExerciseIndex === -1) {
        updatedExercises = [
          ...state.workouts[workoutId].exercises,
          {
            id: exerciseIdForToggle || uuidv4(),
            tempId: exerciseIdForToggle ? null : uuidv4(),
            ...exerciseData,
            sets: [
              {
                id: uuidv4(),
                weight: 10,
                reps: 10,
                order: 1
              }
            ]
          }
        ];
      } else {
        updatedExercises = state.workouts[workoutId].exercises.filter(
          (_, index) => index !== existingExerciseIndex
        );
      }

      return {
        ...state,
        workouts: {
          ...state.workouts,
          [workoutId]: {
            ...state.workouts[workoutId],
            exercises: updatedExercises
          }
        }
      };
    }

    case actionTypes.REMOVE_EXERCISE: {
      const { workoutId, exerciseId } = action.payload;

      const updatedExercises = state.workouts[workoutId].exercises.filter(
        ex =>
          ex.id !== exerciseId &&
          ex.tempId !== exerciseId &&
          ex.catalog_exercise_id !== exerciseId
      );

      return {
        ...state,
        workouts: {
          ...state.workouts,
          [workoutId]: {
            ...state.workouts[workoutId],
            exercises: updatedExercises
          }
        }
      };
    }

    // Set Reducers

    case actionTypes.ADD_SET: {
      const { workoutId, exerciseId, newSet } = action.payload;

      const updatedExercises = state.workouts[workoutId].exercises.map(
        exercise =>
          exercise.id === exerciseId || exercise.tempId === exerciseId
            ? {
                ...exercise,
                sets: [...exercise.sets, { ...newSet, id: uuidv4() }]
              }
            : exercise
      );

      return {
        ...state,
        workouts: {
          ...state.workouts,
          [workoutId]: {
            ...state.workouts[workoutId],
            exercises: updatedExercises
          }
        }
      };
    }

    case actionTypes.UPDATE_SET: {
      const { workoutId, exerciseId, updatedSet } = action.payload;

      const updatedExercises = state.workouts[workoutId].exercises.map(
        exercise =>
          exercise.id === exerciseId || exercise.tempId === exerciseId
            ? {
                ...exercise,
                sets: exercise.sets.map(set =>
                  set.id === updatedSet.id || set.tempId === updatedSet.tempId
                    ? { ...set, ...updatedSet }
                    : set
                )
              }
            : exercise
      );

      return {
        ...state,
        workouts: {
          ...state.workouts,
          [workoutId]: {
            ...state.workouts[workoutId],
            exercises: updatedExercises
          }
        }
      };
    }

    case actionTypes.REMOVE_SET: {
      const { workoutId, exerciseId, setId } = action.payload;

      const updatedExercises = state.workouts[workoutId].exercises.map(
        exercise =>
          exercise.id === exerciseId || exercise.tempId === exerciseId
            ? {
                ...exercise,
                sets: exercise.sets.filter(
                  set => set.id !== setId && set.tempId !== setId
                )
              }
            : exercise
      );

      return {
        ...state,
        workouts: {
          ...state.workouts,
          [workoutId]: {
            ...state.workouts[workoutId],
            exercises: updatedExercises
          }
        }
      };
    }

    default:
      return state;
  }
}

export { workoutReducer };
