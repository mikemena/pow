import { createContext, useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

export const ProgramContext = createContext();

export const ProgramProvider = ({ children }) => {
  const [activeWorkout, setActiveWorkout] = useState(null);
  const [program, setProgram] = useState({
    user_id: 2, // This should be set to the logged in user's ID
    name: 'Program 1',
    program_duration: 0,
    duration_unit: '',
    days_per_week: 0,
    main_goal: '',
    workouts: [
      { id: uuidv4(), name: 'Workout 1', exercises: [], active: false }
    ]
  });

  console.log('Provider Rendered, Active Workout:', activeWorkout);
  // console.log('Program state:', program);

  // Initialize the active workout to the first workout in the program

  const updateActiveWorkout = useCallback(workout => {
    console.log('Updating active workout:', workout);
    setActiveWorkout(workout);
  }, []);

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

  // Functions to update the state of top-level properties of the program object

  const updateProgramDetails = useCallback(details => {
    setProgram(prev => ({ ...prev, ...details }));
  }, []);

  // Function to add a workout to the program

  const addWorkout = useCallback(
    workout => {
      // console.log('addWorkout function called', workout);
      // console.log('Current workouts before add:', program.workouts);
      const tempId = uuidv4();

      // Find the highest index used in existing workout names
      const maxIndex = program.workouts.reduce((max, currWorkout) => {
        const match = currWorkout.name.match(/Workout (\d+)/); // Assuming the format "Workout 1", "Workout 2", etc.
        const index = match ? parseInt(match[1], 10) : 0;
        return Math.max(max, index);
      }, 0);

      const workoutTitle = `Workout ${maxIndex + 1}`;

      const newWorkout = {
        ...workout,
        id: tempId,
        name: workout.name || workoutTitle
      };
      setProgram(prev => {
        const updatedWorkouts = [...prev.workouts, newWorkout];
        // console.log('Updated workouts after add:', updatedWorkouts);
        return { ...prev, workouts: updatedWorkouts };
      });

      // console.log('New activeWorkoutId set:', newWorkout.id);
      // console.log('Updated workouts after add:', program.workouts);
      // console.log('Setting activeWorkoutId to:', tempId);
      setActiveWorkout(newWorkout);
      // console.log('activeWorkoutId after set:', tempId);
    },
    [setProgram, setActiveWorkout, program.workouts]
  );

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

  const deleteWorkout = useCallback(
    workoutId => {
      setProgram(prev => {
        const workoutIndex = prev.workouts.findIndex(
          workout => workout.id === workoutId
        );

        // Ensure we have more than one workout to prevent deleting the last one.
        if (prev.workouts.length <= 1) return prev; // Optionally handle the error as needed.

        const updatedWorkouts = prev.workouts.filter(
          workout => workout.id !== workoutId
        );

        // Determine the new active workout
        let newActiveWorkout = null;
        if (prev.activeWorkout && prev.activeWorkout.id === workoutId) {
          // If the active workout is the one being deleted, need to find a new active workout
          if (workoutIndex === prev.workouts.length - 1) {
            // If it was the last workout, set the previous one as active
            newActiveWorkout = updatedWorkouts[workoutIndex - 1];
          } else {
            // Otherwise, set the next workout as active (or previous if it was the last)
            newActiveWorkout = updatedWorkouts[Math.max(0, workoutIndex)];
          }
        } else {
          // If the active workout is not the one being deleted, keep it as is
          newActiveWorkout = prev.activeWorkout;
        }

        // Update the active workout in the context
        setActiveWorkout(newActiveWorkout);

        // Return the updated program with the workout removed
        return { ...prev, workouts: updatedWorkouts };
      });
    },
    [setActiveWorkout]
  );

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

  // Function to add exercises to a specific workout

  const addExercise = useCallback((workoutId, exercises) => {
    setProgram(prev => {
      const newWorkouts = prev.workouts.map(workout => {
        if (workout.id === workoutId) {
          const currentExercises = Array.isArray(workout.exercises)
            ? workout.exercises
            : [];
          console.log('Existing exercises for this workout:', currentExercises);
          const newExercises = Array.isArray(exercises)
            ? exercises
            : [exercises]; // Ensure it's always an array
          newExercises.forEach(exercise => {
            const tempId = uuidv4();
            const newExercise = {
              ...exercise,
              id: tempId,
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
            currentExercises.push(newExercise);
            console.log('Added new exercise:', newExercise);
          });
          console.log('Updated exercises for this workout:', currentExercises);
          return { ...workout, exercises: currentExercises };
        }
        return workout;
      });
      console.log('New workouts array:', newWorkouts);
      return { ...prev, workouts: newWorkouts };
    });
  }, []);

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
