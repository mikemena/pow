import { createContext, useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

export const ProgramContext = createContext();

export const ProgramProvider = ({ children }) => {
  const [program, setProgram] = useState({
    user_id: 2, // This should be set to the logged in user's ID
    name: '',
    program_duration: 0,
    duration_unit: '',
    days_per_week: 0,
    main_goal: '',
    workouts: []
  });

  // Functions to update the state of top-level properties of the program object

  const updateProgramDetails = useCallback(details => {
    setProgram(prev => ({ ...prev, ...details }));
  }, []);

  // Function to add a workout to the program

  const addWorkout = useCallback(workout => {
    const tempId = uuidv4();
    const newWorkout = { ...workout, id: tempId };
    setProgram(prev => ({
      ...prev,
      workouts: [...prev.workouts, newWorkout]
    }));
  }, []);

  // Function to update a workout

  const updateWorkout = updatedWorkout => {
    setProgram(prevProgram => ({
      ...prevProgram,
      workouts: prevProgram.workouts.map(workout =>
        workout.id === updatedWorkout.id ? updatedWorkout : workout
      )
    }));
  };

  // Function to delete a workout

  const deleteWorkout = useCallback(workoutId => {
    setProgram(prev => ({
      ...prev,
      workouts: prev.workouts.filter(workout => workout.id !== workoutId)
    }));
  }, []);

  // Function to add exercise to a specific workout

  const addExercise = useCallback((workoutId, exercise) => {
    const tempId = uuidv4();

    setProgram(prev => {
      const newWorkouts = prev.workouts.map(workout => {
        if (workout.order === workoutId) {
          // Add the tempId to the new exercise object
          const newExercise = { ...exercise, id: tempId, isNew: true };

          // Determine the next order value for the new exercise
          const nextOrder =
            workout.exercises.length > 0
              ? Math.max(...workout.exercises.map(ex => ex.order)) + 1
              : 1;

          return {
            ...workout,
            exercises: [
              ...workout.exercises,
              { ...newExercise, order: nextOrder }
            ]
          };
        }
        return workout;
      });
      return { ...prev, workouts: newWorkouts };
    });
  }, []);

  // Function to update an exercise

  const updateExercise = (workoutId, updatedExercise) => {
    setProgram(prevProgram => ({
      ...prevProgram,
      workouts: prevProgram.workouts.map(workout => {
        if (workout.order === workoutId) {
          // Found the workout that contains the exercise, now update the exercise
          return {
            ...workout,
            exercises: workout.exercises.map(exercise =>
              exercise.catalog_exercise_id ===
              updatedExercise.catalog_exercise_id
                ? { ...exercise, ...updatedExercise }
                : exercise
            )
          };
        }
        return workout;
      })
    }));
  };

  // Function to delete exercise from  a specific workout

  const deleteExercise = useCallback((workoutId, exerciseId) => {
    setProgram(prev => ({
      ...prev,
      workouts: prev.workouts.map(workout => {
        if (workout.order === workoutId) {
          return {
            ...workout,
            exercises: workout.exercises.filter(
              exercise => exercise.catalog_exercise_id !== exerciseId
            )
          };
        }
        return workout;
      })
    }));
  }, []);

  // Function to add sets to a specific exercise

  const addSet = useCallback((workoutOrder, exerciseCatalogId, newSet) => {
    const tempId = uuidv4();

    setProgram(prev => ({
      ...prev,
      workouts: prev.workouts.map(workout => {
        // Find the correct workout by its order
        if (workout.order === workoutOrder) {
          return {
            ...workout,
            exercises: workout.exercises.map(exercise => {
              // Find the correct exercise by its catalog ID within the workout
              if (exercise.catalog_exercise_id === exerciseCatalogId) {
                // Add the new set with the temporary ID to the exercise's sets array
                const updatedSet = { ...newSet, id: tempId, isNew: true };
                return { ...exercise, sets: [...exercise.sets, updatedSet] };
              }
              return exercise;
            })
          };
        }
        return workout;
      })
    }));
  }, []);

  // Function to update a set

  const updateSet = (workoutId, exerciseId, updatedSet) => {
    setProgram(prevProgram => ({
      ...prevProgram,
      workouts: prevProgram.workouts.map(workout => {
        // Find the matching workout
        if (workout.order === workoutId) {
          return {
            ...workout,
            exercises: workout.exercises.map(exercise => {
              // Find the matching exercise
              if (exercise.catalog_exercise_id === exerciseId) {
                return {
                  ...exercise,
                  sets: exercise.sets.map(set => {
                    // Find the matching set to update
                    if (set.order === updatedSet.order) {
                      return { ...set, ...updatedSet };
                    }
                    return set;
                  })
                };
              }
              return exercise;
            })
          };
        }
        return workout;
      })
    }));
  };

  // Function to delete a set
  const deleteSet = (workoutId, exerciseId, setId) => {
    setProgram(prevProgram => ({
      ...prevProgram,
      workouts: prevProgram.workouts.map(workout => {
        // Find the matching workout
        if (workout.order === workoutId) {
          return {
            ...workout,
            exercises: workout.exercises.map(exercise => {
              // Find the matching exercise
              if (exercise.catalog_exercise_id === exerciseId) {
                return {
                  ...exercise,
                  sets: exercise.sets.filter(set => set.order !== setId)
                };
              }
              return exercise;
            })
          };
        }
        return workout;
      })
    }));
  };

  return (
    <ProgramContext.Provider
      value={{
        program,
        updateProgramDetails,
        addWorkout,
        updateWorkout,
        deleteWorkout,
        addExercise,
        updateExercise,
        deleteExercise,
        addSet,
        updateSet,
        deleteSet
      }}
    >
      {children}
    </ProgramContext.Provider>
  );
};
