import { createContext, useState, useCallback } from 'react';

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

  const addWorkout = useCallback(workout => {
    setProgram(prev => ({
      ...prev,
      workouts: [...prev.workouts, workout]
    }));
  }, []);

  const updateWorkout = updatedWorkout => {
    setProgram(prevProgram => ({
      ...prevProgram,
      workouts: prevProgram.workouts.map(workout =>
        workout.id === updatedWorkout.id ? updatedWorkout : workout
      )
    }));
  };

  const deleteWorkout = useCallback(workoutId => {
    setProgram(prev => ({
      ...prev,
      workouts: prev.workouts.filter(workout => workout.order !== workoutId)
    }));
  }, []);

  // Function to add exercise to a specific workout
  const addExercise = useCallback((workoutId, exercise) => {
    setProgram(prev => {
      const newWorkouts = prev.workouts.map(w => {
        if (w.order === workoutId) {
          return { ...w, exercises: [...w.exercises, exercise] };
        }
        return w;
      });
      return { ...prev, workouts: newWorkouts };
    });
  }, []);

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
  const addSet = useCallback((exerciseId, set) => {
    setProgram(prev => {
      const newSets = prev.workouts.map(s => {
        if (s.order === exerciseId) {
          return { ...s, sets: [...s.sets, set] };
        }
        return s;
      });
      return { ...prev, sets: newSets };
    });
  }, []);

  // ... more state update functions for exercises and sets

  return (
    <ProgramContext.Provider
      value={{
        program,
        updateProgramDetails,
        updateWorkout,
        addWorkout,
        deleteWorkout,
        addExercise,
        updateExercise,
        deleteExercise,
        addSet
        // ... other update functions
      }}
    >
      {children}
    </ProgramContext.Provider>
  );
};
