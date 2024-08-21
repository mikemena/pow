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
          workouts: state.workouts.map(workout => {
            const isActive =
              workout.id === workoutId || workout.tempId === workoutId;
            console.log(`Workout ${workoutId}: Setting active to ${isActive}`);
            return {
              ...workout,
              active: isActive
            };
          })
        }
      };
    }

    case actionTypes.ADD_WORKOUT:
      const newWorkout = standardizeWorkout(action.payload);
      if (!newWorkout) return state;
      if (!newWorkout) {
        console.error('Failed to standardize workout:', action.payload);
        return state;
      }
      return {
        ...state,
        program: {
          ...state.program,
          workouts: [...state.program.workouts, newWorkout]
        }
      };

    case actionTypes.UPDATE_WORKOUT:
      return {
        ...state,
        program: {
          ...state.program,
          workouts: state.program.workouts.map(workout =>
            workout.id === action.payload.id ||
            workout.tempId === action.payload.tempId
              ? action.payload
              : workout
          )
        }
      };

    case actionTypes.DELETE_WORKOUT: {
      if (!action.payload) {
        console.error('Invalid payload for DELETE_WORKOUT', action.payload);
        return state;
      }

      const { [action.payload]: deletedWorkout, ...remainingWorkouts } = state;
      const reorderedWorkouts = Object.values(remainingWorkouts)
        .sort((a, b) => a.order - b.order)
        .map((workout, index) => ({
          ...workout,
          order: index + 1
        }))
        .reduce((acc, workout) => {
          acc[workout.id] = workout;
          return acc;
        }, {});
      console.log('Reordered Workouts:', reorderedWorkouts);

      return {
        ...state,
        program: {
          ...state.program,
          workouts: state.program.workouts.filter(
            workout =>
              workout.id !== action.payload && workout.tempId !== action.payload
          )
        }
      };
    }

    // Exercise Reducers

    case actionTypes.ADD_EXERCISE:
      const { workoutId: workoutIdAddEx, exercises } = action.payload;

      // Find the workout that needs to be updated
      const workoutsForAddExercise = state.program.workouts.map(workout => {
        if (
          workout.id === workoutIdAddEx ||
          workout.tempId === workoutIdAddEx
        ) {
          // Create a Set of existing exercise IDs
          const existingExerciseIds = new Set(
            workout.exercises.map(ex => ex.id || ex.tempId)
          );

          // Filter out duplicates and add only new exercises
          const newExercises = exercises.filter(
            ex => !existingExerciseIds.has(ex.id || ex.tempId)
          );

          // Combine existing exercises with new ones
          const updatedExercisesAfterAdd = [
            ...workout.exercises,
            ...newExercises.map(ex => ({
              ...exerciseUtils.standardizeExercise(ex),
              id: ex.id || null,
              tempId: ex.tempId || uuidv4() // Generate tempId for new exercises if not present
            }))
          ];

          return {
            ...workout,
            exercises: updatedExercisesAfterAdd
          };
        }
        return workout;
      });

      return {
        ...state,
        program: {
          ...state.program,
          workouts: workoutsForAddExercise
        }
      };

    case actionTypes.TOGGLE_EXERCISE_SELECTION:
      const { workoutId, exerciseIdForToggle, exerciseData } = action.payload;

      // Find the workout that needs to be updated
      const workoutsForToggleExercise = state.program.workouts.map(workout => {
        if (workout.id === workoutId || workout.tempId === workoutId) {
          // Find if the exercise already exists
          const existingExerciseIndex = workout.exercises.findIndex(
            ex =>
              ex.id === exerciseIdForToggle || ex.tempId === exerciseIdForToggle
          );

          let updatedExercises;
          if (existingExerciseIndex === -1) {
            // Exercise doesn't exist, add it
            updatedExercises = [
              ...workout.exercises,
              {
                id: exerciseIdForToggle || uuidv4(), // Use provided id or generate tempId
                tempId: exerciseIdForToggle ? null : uuidv4(), // Set tempId if new
                name: exerciseData.name,
                muscle: exerciseData.muscle,
                equipment: exerciseData.equipment,
                order: workout.exercises.length + 1,
                selected: true,
                sets: [
                  {
                    id: uuidv4(),
                    weight: 10, // Default weight
                    reps: 10, // Default reps
                    order: 1
                  }
                ]
              }
            ];
          } else {
            // Exercise exists, toggle its selection by removing it
            updatedExercises = workout.exercises.filter(
              (ex, index) => index !== existingExerciseIndex
            );
          }

          return {
            ...workout,
            exercises: updatedExercises
          };
        }
        return workout;
      });

      return {
        ...state,
        program: {
          ...state.program,
          workouts: workoutsForToggleExercise
        }
      };

    case actionTypes.REMOVE_EXERCISE:
      const { workoutId: wId5, exerciseId: exId5 } = action.payload;

      // Find the workout that needs to be updated
      const workoutsForRemoveExercise = state.program.workouts.map(workout => {
        if (workout.id === wId5 || workout.tempId === wId5) {
          // Filter out the exercise to be removed
          const updatedExercises = workout.exercises.filter(
            exercise =>
              exercise.id !== exId5 &&
              exercise.tempId !== exId5 &&
              exercise.catalog_exercise_id !== exId5
          );

          return {
            ...workout,
            exercises: updatedExercises
          };
        }
        return workout;
      });

      return {
        ...state,
        program: {
          ...state.program,
          workouts: workoutsForRemoveExercise
        }
      };

    // Set Reducers

    case actionTypes.ADD_SET:
      const {
        workoutId: workoutIdAddSet,
        exerciseId: exerciseIdAddSet,
        newSet
      } = action.payload;

      // Find the workout that needs to be updated
      const workoutsForAddSet = state.program.workouts.map(workout => {
        if (
          workout.id === workoutIdAddSet ||
          workout.tempId === workoutIdAddSet
        ) {
          // Find the exercise within the workout that needs to be updated
          const updatedExercises = workout.exercises.map(exercise => {
            if (
              exercise.id === exerciseIdAddSet ||
              exercise.tempId === exerciseIdAddSet
            ) {
              // Add the new set to the exercise
              const updatedSets = [
                ...exercise.sets,
                { ...newSet, id: uuidv4() }
              ];

              return {
                ...exercise,
                sets: updatedSets
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
      });

      return {
        ...state,
        program: {
          ...state.program,
          workouts: workoutsForAddSet
        }
      };

    case actionTypes.UPDATE_SET:
      const { workoutId: wId2, exerciseId: exId, updatedSet } = action.payload;

      // Find the workout that needs to be updated
      const workoutsForUpdateSet = state.program.workouts.map(workout => {
        if (workout.id === wId2 || workout.tempId === wId2) {
          // Find the exercise within the workout that needs to be updated
          const updatedExercises = workout.exercises.map(exercise => {
            if (exercise.id === exId || exercise.tempId === exId) {
              // Update the specific set within the exercise
              const updatedSets = exercise.sets.map(set =>
                set.id === updatedSet.id || set.tempId === updatedSet.tempId
                  ? { ...set, ...updatedSet }
                  : set
              );

              return {
                ...exercise,
                sets: updatedSets
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
      });

      return {
        ...state,
        program: {
          ...state.program,
          workouts: workoutsForUpdateSet
        }
      };

    case actionTypes.REMOVE_SET:
      const {
        workoutId: workoutIdDeleteSet,
        exerciseId: exerciseIdDeleteSet,
        setId: setIdDeleteSet
      } = action.payload;

      // Find the workout that needs to be updated
      const workoutsForRemoveSet = state.program.workouts.map(workout => {
        if (
          workout.id === workoutIdDeleteSet ||
          workout.tempId === workoutIdDeleteSet
        ) {
          // Find the exercise within the workout that needs to be updated
          const updatedExercises = workout.exercises.map(exercise => {
            if (
              exercise.id === exerciseIdDeleteSet ||
              exercise.tempId === exerciseIdDeleteSet
            ) {
              // Remove the specific set from the exercise
              const updatedSets = exercise.sets.filter(
                set =>
                  set.id !== setIdDeleteSet && set.tempId !== setIdDeleteSet
              );

              return {
                ...exercise,
                sets: updatedSets
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
      });

      return {
        ...state,
        program: {
          ...state.program,
          workouts: workoutsForRemoveSet
        }
      };

    default:
      return state;
  }
}

export { workoutReducer };
