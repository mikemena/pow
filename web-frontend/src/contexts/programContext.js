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

  //Save program to the database
  const saveProgram = async NewProgram => {
    const programData = {
      user_id: 2, // Assuming this is static or retrieved from somewhere else
      name: program.programName,
      program_duration: program.programDuration,
      days_per_week: program.daysPerWeek,
      duration_unit: program.durationUnit,
      main_goal: program.mainGoal,
      workouts: program.workouts.map(workout => ({
        name: workout.name,
        order: workout.id, // Assuming `id` can serve as `order`
        exercises: workout.exercises.map(exercise => ({
          catalog_exercise_id: exercise.catalog_exercise_id,
          order: exercise.order, // Make sure this exists or determine how to set it
          sets: exercise.sets || [] // Assuming `sets` exist in `exercise`, if not, you'll need to adjust
        }))
      }))
    };

    console.log('Saving program from front end:', programData);

    try {
      const response = await fetch('http://localhost:9025/api/programs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(programData)
      });

      if (!response.ok) {
        throw new Error('Something went wrong with saving the program');
      }

      // Assuming the backend responds with the created template, you could use it here if needed
      // const savedTemplate = await response.json();
    } catch (error) {
      console.error('Failed to save the program:', error);
      // Here, you could set an error state and display it to the user if you wish
    }
  };

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
        saveProgram,
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
