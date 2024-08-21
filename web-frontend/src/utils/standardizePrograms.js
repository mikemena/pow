import { v4 as uuidv4 } from 'uuid';

const standardizePrograms = (fetchedPrograms, selectedProgramId = null) => {
  return fetchedPrograms.map(program => ({
    program: {
      id: program.id || null,
      tempId: uuidv4(),
      user_id: program.user_id || null,
      name: program.name || '',
      program_duration: program.program_duration || 0,
      duration_unit: program.duration_unit || 'Days',
      days_per_week: program.days_per_week || 0,
      main_goal: program.main_goal || '',
      selected: program.id === selectedProgramId,
      workouts: (program.workouts || []).map(workout => ({
        id: workout.id || null,
        tempId: uuidv4(),
        name: workout.name || '',
        active: false,
        exercises: (workout.exercises || []).map(exercise => ({
          id: exercise.id || null,
          tempId: uuidv4(),
          catalog_exercise_id: exercise.catalog_exercise_id || null,
          equipment: exercise.equipment || '',
          muscle: exercise.muscle || '',
          name: exercise.name || '',
          active: false,
          order: exercise.order || 0,
          sets: (exercise.sets || []).map(set => ({
            id: set.id || null,
            tempId: uuidv4(),
            order: set.order || 0,
            reps: set.reps || 0,
            weight: set.weight || 0,
            unit: set.unit || 'lbs',
            active: false
          }))
        }))
      }))
    }
  }));
};

export default standardizePrograms;
