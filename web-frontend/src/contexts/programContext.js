import { createContext, useReducer, useCallback } from 'react';
import programReducer, { initialState } from '../reducers/programReducer';
import { v4 as uuidv4 } from 'uuid';

export const ProgramContext = createContext();

export const ProgramProvider = ({ children }) => {
  const [state, dispatch] = useReducer(programReducer, initialState);

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

    // console.log('Saving program from front end:', programData);

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

  // For updating basic program information like name, duration, etc.

  const handleUpdateProgramDetails = details => {
    dispatch({
      type: actionTypes.UPDATE_PROGRAM_DETAILS,
      payload: details
    });
  };

  const handleAddWorkout = workout => {
    dispatch({
      type: actionTypes.ADD_WORKOUT,
      payload: workout
    });
  };

  const handleUpdateWorkout = workout => {
    dispatch({
      type: actionTypes.UPDATE_WORKOUT,
      payload: workout
    });
  };

  const handleDeleteWorkout = workoutId => {
    dispatch({
      type: actionTypes.DELETE_WORKOUT,
      payload: workoutId
    });
  };

  // Function to go to the next workout

  const goToNextWorkout = () => {
    const currentIndex = program.workouts.findIndex(
      workout => workout.id === activeWorkout.id
    );
    const nextIndex = (currentIndex + 1) % program.workouts.length;
    setActiveWorkout(program.workouts[nextIndex]);
    console.log(
      'Active workout ID after next:',
      program.workouts[nextIndex].id
    );
  };

  // Function to go to the previous workout

  const goToPreviousWorkout = () => {
    const currentIndex = program.workouts.findIndex(
      workout => workout.id === activeWorkout.id
    );
    const previousIndex =
      (currentIndex - 1 + program.workouts.length) % program.workouts.length;
    setActiveWorkout(program.workouts[previousIndex]);
    console.log(
      'Active workout ID after previous:',
      program.workouts[previousIndex].id
    );
  };

  // Function to add a new exercise to a workout
  const addNewExercise = (currentExercises, exercise) => {
    const newExercise = {
      ...exercise,
      id: uuidv4(), // Unique ID for key purposes
      exerciseCatalogId: exercise.id,
      isNew: true,
      sets: [
        {
          id: uuidv4(),
          reps: '',
          weight: '',
          order: currentExercises.length + 1,
          isNew: true
        }
      ]
    };
    console.log('Added new exercise:', newExercise);
    return newExercise;
  };

  // Function to add exercises to a specific workout
  const addExercise = useCallback(
    (workoutId, exercises) => {
      console.log(
        `Attempting to add exercises to workout ${workoutId}:`,
        exercises
      );
      setProgram(prev => {
        const newWorkouts = prev.workouts.map(workout => {
          if (workout.id === workoutId) {
            console.log(`Found workout with ID ${workoutId}`);
            const currentExercises = Array.isArray(workout.exercises)
              ? workout.exercises
              : [];
            console.log(
              `Current exercises before adding new ones:`,
              currentExercises
            );
            const newExercises = Array.isArray(exercises)
              ? exercises
              : [exercises];
            newExercises.forEach(exercise => {
              if (
                !currentExercises.some(
                  ex => ex.exerciseCatalogId === exercise.id
                )
              ) {
                const newExercise = createNewExercise(
                  exercise,
                  currentExercises.length
                );
                currentExercises.push(newExercise);
                console.log(`Added new exercise:`, newExercise);
              } else {
                console.log(
                  `Exercise with ID ${exercise.id} already exists in the workout`
                );
              }
            });
            return { ...workout, exercises: currentExercises };
          }
          return workout;
        });
        console.log(
          `Updated workouts array after attempting to add exercises:`,
          newWorkouts
        );
        return { ...prev, workouts: newWorkouts };
      });
    },
    [setProgram]
  );

  // Function to update an exercise

  const updateExercise = (workoutId, updatedExercise) => {
    setProgram(prevProgram => ({
      ...prevProgram,
      workouts: prevProgram.workouts.map(workout => {
        if (workout.id === workoutId) {
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
    // console.log(
    //   `Deleting exercise. Workout ID: ${workoutId}, Exercise ID: ${exerciseId}`
    // );

    setProgram(prev => ({
      ...prev,
      workouts: prev.workouts.map(workout => {
        // console.log(
        //   `Before deletion, number of exercises: ${workout.exercises.length}`
        // );

        if (workout.id === workoutId) {
          return {
            ...workout,
            exercises: workout.exercises.filter(
              exercise => exercise.id !== exerciseId
            )
          };
        }

        return workout;
      })
    }));
  }, []);

  // Function to add sets to a specific exercise

  const addSet = useCallback((workoutId, exerciseId, newSet) => {
    const tempId = uuidv4();

    setProgram(prev => ({
      ...prev,
      workouts: prev.workouts.map(workout => {
        // Find the correct workout by its id
        if (workout.id === workoutId) {
          return {
            ...workout,
            exercises: workout.exercises.map(exercise => {
              // Find the correct exercise by its catalog ID within the workout
              if (exercise.id === exerciseId) {
                // Add the new set with the temporary ID to the exercise's sets array
                const currentSets = Array.isArray(exercise.sets)
                  ? exercise.sets
                  : [];

                // Add the new set with the temporary ID to the exercise's sets array
                const nextOrder =
                  currentSets.length > 0
                    ? Math.max(...currentSets.map(set => set.order)) + 1
                    : 1;

                // Add the new set with the temporary ID to the exercise's sets array
                const updatedSet = {
                  ...newSet,
                  id: tempId,
                  order: nextOrder,
                  isNew: true
                };

                return { ...exercise, sets: [...currentSets, updatedSet] };
              }
              return exercise;
            })
          };
        }
        return workout;
      })
    }));
  }, []);

  // useEffect(() => {
  //   // console.log('Program state updated:', program);
  // }, [program]); // This effect will run whenever the 'program' state changes

  // Function to update a set

  const updateSet = (workoutId, exerciseId, updatedSet) => {
    setProgram(prevProgram => ({
      ...prevProgram,
      workouts: prevProgram.workouts.map(workout => {
        // Find the matching workout
        if (workout.id === workoutId) {
          return {
            ...workout,
            exercises: workout.exercises.map(exercise => {
              // Find the matching exercise
              if (exercise.id === exerciseId) {
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
        if (workout.id === workoutId) {
          return {
            ...workout,
            exercises: workout.exercises.map(exercise => {
              // Find the matching exercise
              if (exercise.id === exerciseId) {
                // Filter out the set to be deleted and renumber the remaining sets
                const filteredAndRenumberedSets = exercise.sets
                  .filter(set => set.id !== setId)
                  .map((set, index) => ({ ...set, order: index + 1 })); // Assuming 'order' needs to be updated

                return {
                  ...exercise,
                  sets: filteredAndRenumberedSets
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
        activeWorkout,
        updateActiveWorkout,
        deleteWorkout,
        goToNextWorkout,
        goToPreviousWorkout,
        addExercise,
        addNewExercise,
        updateExercise,
        createNewExercise,
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
