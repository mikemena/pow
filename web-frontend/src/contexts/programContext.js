import { createContext, useReducer } from 'react';
import { actionTypes } from '../actions/actionTypes';
import rootReducer from '../reducers/rootReducer';
import { initialState } from '../reducers/initialState';
import { standardizeWorkout } from '../utils/standardizeWorkout';
import exerciseUtils from '../utils/exercise.js';
import { v4 as uuidv4 } from 'uuid';

export const ProgramContext = createContext();

export const ProgramProvider = ({ children }) => {
  const [state, dispatch] = useReducer(rootReducer, initialState);

  const setSelectedProgram = program => {
    dispatch({
      type: actionTypes.SET_SELECTED_PROGRAM,
      payload: program
    });
  };

  const setActiveWorkout = workoutId => {
    if (!workoutId) {
      console.error('Attempted to set active workout without a valid ID');
      return; // Optionally return to avoid dispatching undefined ID
    }
    dispatch({
      type: actionTypes.SET_ACTIVE_WORKOUT,
      payload: workoutId
    });
  };

  const saveProgram = async () => {
    const programId = Object.keys(state.programs)[0];
    const newProgram = {
      ...state.programs[programId],
      workouts: Object.values(state.workouts).map(workout => ({
        ...workout,
        exercises: workout.exercises.map(exercise => ({
          catalog_exercise_id: exercise.catalog_exercise_id,
          order: exercise.order || 1,
          sets: exercise.sets.map((set, index) => ({
            ...set,
            order: index + 1
          }))
        })),
        order: workout.order || 1
      }))
    };

    console.log('Saving program with payload:', newProgram);

    dispatch({ type: actionTypes.SAVE_PROGRAM_START });
    try {
      validateProgramData(newProgram); // Validate data before sending
      const response = await fetch('http://localhost:9025/api/programs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProgram)
      });

      if (!response.ok) {
        const errorText = await response.text(); // Get the response text
        console.error('Error saving program:', errorText); // Log the error text
        throw new Error('Network response was not ok');
      }
      const savedProgram = await response.json();
      dispatch({
        type: actionTypes.SAVE_PROGRAM_SUCCESS,
        payload: savedProgram
      });
    } catch (error) {
      console.error('Failed to save program:', error);
      dispatch({
        type: actionTypes.SAVE_PROGRAM_FAILURE,
        payload: error.message
      });
    }
  };

  const updateProgram = async programId => {
    const updatedProgram = {
      ...state.programs[programId],
      workouts: Object.values(state.workouts)
        .map(workout => {
          if (!workout || !workout.id) {
            return null; // Exclude workouts without an id
          }

          const isTemporaryId =
            typeof workout.id === 'string' && workout.id.includes('-');

          if (isTemporaryId) {
            // You might want to handle temporary IDs differently
            // For example, you could generate a new temporary integer ID
            workout.id = Math.floor(Math.random() * -1000000); // Negative to distinguish from DB IDs
          } else if (typeof workout.id !== 'number') {
            workout.id = parseInt(workout.id, 10);
            if (isNaN(workout.id)) {
              return null;
            }
          }

          const updatedExercises = (state.exercises[workout.id] || [])
            .map(exercise => {
              if (!exercise || !exercise.id) {
                return null; // Exclude exercises without an id
              }

              const isExerciseTemporaryId =
                typeof exercise.id === 'string' && exercise.id.includes('-');

              if (isExerciseTemporaryId) {
                exercise.id = Math.floor(Math.random() * -1000000); // Temporary negative ID
              } else if (typeof exercise.id !== 'number') {
                exercise.id = parseInt(exercise.id, 10);
                if (isNaN(exercise.id)) {
                  return null;
                }
              }

              return {
                ...exercise,
                sets: state.sets[exercise.id] || [],
                id: exercise.id
              };
            })
            .filter(exercise => exercise !== null);

          return {
            ...workout,
            exercises: updatedExercises,
            id: workout.id,
            programId: programId
          };
        })
        .filter(workout => workout !== null), // Remove null workouts
      id: programId
    };

    dispatch({ type: actionTypes.SAVE_PROGRAM_START });
    try {
      validateProgramData(updatedProgram); // Validate data before sending
      const response = await fetch(
        `http://localhost:9025/api/programs/${programId}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedProgram)
        }
      );

      if (!response.ok) {
        const errorText = await response.text(); // Get the response text
        console.error('Error updating program:', errorText); // Log the error text
        throw new Error('Network response was not ok');
      }
      const savedProgram = await response.json();

      dispatch({
        type: actionTypes.UPDATE_PROGRAM_SUCCESS,
        payload: savedProgram
      });
    } catch (error) {
      console.error('Failed to update program:', error);
      dispatch({
        type: actionTypes.SAVE_PROGRAM_FAILURE,
        payload: error.message
      });
    }
  };

  const validateProgramData = programData => {
    if (!programData.workouts || !Array.isArray(programData.workouts)) {
      throw new Error('Workouts should be an array.');
    }
    programData.workouts.forEach(workout => {
      if (!workout.exercises || !Array.isArray(workout.exercises)) {
        throw new Error('Exercises should be an array.');
      }
      workout.exercises.forEach(exercise => {
        if (!exercise.sets || !Array.isArray(exercise.sets)) {
          throw new Error('Sets should be an array.');
        }
      });
    });
  };

  const addProgram = details => {
    dispatch({
      type: actionTypes.ADD_PROGRAM,
      payload: details
    });
  };

  const deleteProgram = async programId => {
    try {
      const response = await fetch(
        `http://localhost:9025/api/programs/${programId}`,
        {
          method: 'DELETE'
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error deleting program:', errorText);
        throw new Error('Failed to delete program');
      }

      dispatch({
        type: actionTypes.DELETE_PROGRAM,
        payload: { programId }
      });
    } catch (error) {
      console.error('Failed to delete program:', error);
    }
  };

  const addWorkout = programId => {
    const newWorkout = {
      id: uuidv4(),
      name: 'New Workout',
      programId: programId,
      exercises: [],
      order: Object.keys(state.workouts).length + 1
    };
    console.log('Add Standardized Workout:', newWorkout);
    dispatch({ type: actionTypes.ADD_WORKOUT, payload: newWorkout });
  };

  const updateWorkout = workout => {
    const standardizedWorkout = standardizeWorkout(workout);
    if (!standardizedWorkout) {
      console.error('Invalid workout object:', workout);
      return;
    }
    console.log('Edit Standardized Workout:', standardizedWorkout);
    dispatch({
      type: actionTypes.UPDATE_WORKOUT,
      payload: standardizedWorkout
    });
  };

  const deleteWorkout = workoutId => {
    dispatch({
      type: actionTypes.DELETE_WORKOUT,
      payload: workoutId
    });
  };

  const addExercise = (workoutId, exercises) => {
    const standardizedExercises = exercises.map(ex => ({
      ...ex,
      tempId: ex.tempId || uuidv4(),
      catalog_exercise_id: ex.catalog_exercise_id || ex.id,
      sets: ex.sets || []
    }));

    dispatch({
      type: actionTypes.ADD_EXERCISE,
      payload: { workoutId, exercises: standardizedExercises }
    });
  };

  const updateExercise = (workoutId, exercise) => {
    dispatch({
      type: actionTypes.UPDATE_EXERCISE,
      payload: { workoutId, exercise }
    });
  };

  const deleteExercise = (workoutId, exerciseId) => {
    dispatch({
      type: actionTypes.DELETE_EXERCISE,
      payload: { workoutId, exerciseId }
    });
  };

  const addSet = (workoutId, exerciseId, weight = 10, reps = 10) => {
    const workout = state.workouts[workoutId];

    if (!workout) {
      console.error('Workout not found:', workoutId);
      return;
    }

    const exercise = workout.exercises.find(
      ex => ex.tempId === exerciseId || ex.id === exerciseId
    );
    if (!exercise) {
      console.error(
        'Exercise not found:',
        exerciseId,
        'in workout:',
        workoutId
      );
      return;
    }
    const exrcId = exerciseUtils.getExerciseId(exercise);

    dispatch({
      type: actionTypes.ADD_SET,
      payload: { workoutId, exerciseId: exrcId, weight, reps }
    });
  };

  const updateSet = (workoutId, exerciseId, updatedSet) => {
    dispatch({
      type: actionTypes.UPDATE_SET,
      payload: { workoutId, exerciseId, updatedSet }
    });
  };

  const deleteSet = (workoutId, exerciseId, setId) => {
    const workout = state.workouts[workoutId];
    if (!workout) {
      console.error('Workout not found:', workoutId);
      return;
    }

    const exercise = workout.exercises.find(
      ex => exerciseUtils.getExerciseId(ex) === exerciseId
    );
    if (!exercise) {
      console.error(
        'Exercise not found:',
        exerciseId,
        'in workout:',
        workoutId
      );
      return;
    }

    const updatedSets = exercise.sets.filter(set => set.id !== setId);
    if (updatedSets.length === exercise.sets.length) {
      console.error('Set not found:', setId, 'in exercise:', exerciseId);
      return;
    }

    const updatedExercises = workout.exercises.map(ex =>
      exerciseUtils.getExerciseId(ex) === exerciseId
        ? { ...ex, sets: updatedSets }
        : ex
    );

    dispatch({
      type: actionTypes.UPDATE_WORKOUT,
      payload: {
        ...workout,
        exercises: updatedExercises
      }
    });
  };

  const clearState = () => {
    dispatch({ type: actionTypes.CLEAR_STATE });
  };

  return (
    <ProgramContext.Provider
      value={{
        state,
        dispatch,
        activeWorkout: state.activeWorkout,
        setSelectedProgram,
        addProgram,
        updateProgram,
        deleteProgram,
        addWorkout,
        updateWorkout,
        deleteWorkout,
        setActiveWorkout,
        addExercise,
        updateExercise,
        deleteExercise,
        addSet,
        updateSet,
        deleteSet,
        saveProgram,
        clearState
      }}
    >
      {children}
    </ProgramContext.Provider>
  );
};
