const standardizePrograms = (fetchedPrograms, selectedProgramId = null) => {
  const standardizedState = {
    programs: {},
    workouts: {},
    activeWorkout: null
  };

  fetchedPrograms.forEach(program => {
    const programId = program.id; // Assuming program.id is either an integer or UUID

    // Standardize program data (each program object)
    standardizedState.programs[programId] = {
      user_id: program.user_id || null,
      id: programId,
      name: program.name || '',
      program_duration: program.program_duration || 0,
      duration_unit: program.duration_unit || 'Days',
      days_per_week: program.days_per_week || 0,
      main_goal: program.main_goal || ''
    };

    // Standardize workouts, grouping them by programId
    (program.workouts || []).forEach(workout => {
      const workoutId = workout.id;
      standardizedState.workouts[workoutId] = {
        id: workoutId,
        programId: programId,
        name: workout.name || '',
        exercises: (workout.exercises || []).map(exercise => ({
          id: exercise.id,
          catalog_exercise_id: exercise.catalog_exercise_id || null,
          equipment: exercise.equipment || '',
          muscle: exercise.muscle || '',
          name: exercise.name || '',
          order: exercise.order || 0,
          sets: (exercise.sets || []).map(set => ({
            id: set.id,
            order: set.order || 0,
            reps: set.reps || 0,
            weight: set.weight || 0,
            unit: set.unit || 'lbs'
          }))
        }))
      };
    });
  });

  return standardizedState;
};

export default standardizePrograms;
