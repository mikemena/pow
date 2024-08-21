const standardizePrograms = (fetchedPrograms, selectedProgramId = null) => {
  const standardizedState = {
    program: {},
    workouts: {},
    activeWorkout: null,
    selectedProgram: null
  };

  fetchedPrograms.forEach(program => {
    const programId = program.id; // Assuming program.id is either an integer or UUID

    // Standardize program data (single program object)
    standardizedState.program = {
      user_id: program.user_id || null,
      id: programId,
      name: program.name || '',
      program_duration: program.program_duration || 0,
      duration_unit: program.duration_unit || 'Days',
      days_per_week: program.days_per_week || 0,
      main_goal: program.main_goal || ''
    };

    // Set the selected program ID if applicable
    if (program.id === selectedProgramId) {
      standardizedState.selectedProgram = programId;
    }

    // Standardize workouts, grouping them under a single key
    (program.workouts || []).forEach(workout => {
      const workoutId = workout.id; // Assuming workout.id is either an integer or UUID
      standardizedState.workouts[workoutId] = {
        id: workoutId,
        name: workout.name || '',
        exercises: (workout.exercises || []).map(exercise => ({
          id: exercise.id, // Assuming exercise.id is either an integer or UUID
          catalog_exercise_id: exercise.catalog_exercise_id || null,
          equipment: exercise.equipment || '',
          muscle: exercise.muscle || '',
          name: exercise.name || '',
          order: exercise.order || 0,
          sets: (exercise.sets || []).map(set => ({
            id: set.id, // Assuming set.id is either an integer or UUID
            order: set.order || 0,
            reps: set.reps || 0,
            weight: set.weight || 0,
            unit: set.unit || 'lbs'
          }))
        }))
      };
    });

    // Optionally set the first workout as active if no active workout is set
    if (!standardizedState.activeWorkout) {
      standardizedState.activeWorkout = Object.keys(
        standardizedState.workouts
      )[0];
    }
  });

  return standardizedState;
};

export default standardizePrograms;
