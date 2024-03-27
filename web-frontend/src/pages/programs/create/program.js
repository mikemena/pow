import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { WorkoutContainerProvider } from '../../../contexts/workoutContainerContext';
import WorkoutContainer from '../../../components/WorkoutContainer/WorkoutContainer';
import ProgramForm from '../../../components/Program/ProgramForm';
import NavBar from '../../../components/Nav/Nav';
import ExerciseList from '../../../components/ExerciseList/ExerciseList';
import './program.css';

const CreateProgram = () => {
  const [program, setProgram] = useState({
    programName: '',
    mainGoal: '',
    programDuration: '',
    durationUnit: '',
    daysPerWeek: '',
    workouts: []
  });

  const [workouts, setWorkouts] = useState([
    { id: 1, name: 'Workout 1', exercises: [] }
  ]);
  const [showExerciseList, setShowExerciseList] = useState(false);
  const [activeWorkout, setActiveWorkout] = useState(null);

  const navigate = useNavigate();

  const handleAddExercise = workoutId => {
    setShowExerciseList(true);
    setActiveWorkout(workoutId);
  };

  const handleAddWorkout = () => {
    const newWorkoutId =
      workouts.length > 0 ? workouts[workouts.length - 1].id + 1 : 1;
    const newWorkout = {
      id: newWorkoutId,
      name: `Workout ${newWorkoutId}`,
      exercises: []
    };
    setWorkouts([...workouts, newWorkout]);
  };

  const handleRemoveWorkout = workoutId => {
    //remove workout
    const updatedWorkouts = workouts.filter(
      workout => workout.id !== workoutId
    );

    //renumber the remaining workouts
    // const renumberedWorkouts = updatedWorkouts.map((workout, index) => ({
    //   ...workout,
    //   id: index + 1,
    //   name: `Workout ${index + 1}`
    // }));
    setWorkouts(updatedWorkouts);
  };

  const handleWorkoutTitle = (workoutId, newTitle) => {
    setWorkouts(prevWorkouts =>
      prevWorkouts.map(workout => {
        if (workout.id === workoutId) {
          return { ...workout, name: newTitle };
        }
        return workout;
      })
    );
  };

  const handleSelectExercise = selectedExercise => {
    console.log('Adding exercise:', selectedExercise);
    setWorkouts(
      workouts.map(workout => {
        if (workout.id === activeWorkout) {
          const isExerciseSelected = workout.exercises.find(
            e => e.exercise_id === selectedExercise.exercise_id
          );
          if (isExerciseSelected) {
            // Exercise is already selected, so remove it
            return {
              ...workout,
              exercises: workout.exercises.filter(
                e => e.exercise_id !== selectedExercise.exercise_id
              )
            };
          } else {
            // Exercise is not selected, so add it
            return {
              ...workout,
              exercises: [...workout.exercises, selectedExercise]
            };
          }
        }
        return workout;
      })
    );
  };

  const handleRemoveExercise = (workoutId, exerciseId) => {
    console.log(`Removing exercise ${exerciseId} from workout ${workoutId}`);

    const updatedWorkouts = workouts.map(workout => {
      if (workout.id === workoutId) {
        const updatedExercises = workout.exercises.filter(
          ex => ex.exercise_id !== exerciseId
        );
        console.log(
          `Updated exercises for workout ${workoutId}:`,
          updatedExercises
        );
        return { ...workout, exercises: updatedExercises };
      }
      return workout;
    });

    console.log('Updated workouts:', updatedWorkouts);
    setWorkouts(updatedWorkouts);
  };

  const handleSaveProgram = async NewProgram => {
    const programData = {
      user_id: 2, // Assuming this is static or retrieved from somewhere else
      name: program.programName,
      program_duration: program.programDuration,
      days_per_week: program.daysPerWeek,
      duration_unit: program.durationUnit,
      main_goal: program.mainGoal,
      workouts: workouts.map(workout => ({
        name: workout.name,
        order: workout.id, // Assuming `id` can serve as `order`
        exercises: workout.exercises.map(exercise => ({
          catalog_exercise_id: exercise.catalog_exercise_id,
          order: exercise.order, // Make sure this exists or determine how to set it
          sets: exercise.sets || [] // Assuming `sets` exist in `exercise`, if not, you'll need to adjust
        }))
      }))
    };

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

      // After saving, redirect back to the WorkoutPage
      navigate('/programs');
    } catch (error) {
      console.error('Failed to save the program:', error);
      // Here, you could set an error state and display it to the user if you wish
    }
  };

  return (
    <div className='create-prog-page'>
      <NavBar isEditing='true' />
      <div className='create-prog-page__container'>
        <div className='create-prog-page__left-container'>
          <div className='create-prog-page__header'>
            <h1 className='create-prog-page__title'>Create New Program</h1>
          </div>

          <ProgramForm
            program={program}
            onSubmit={handleSaveProgram}
            handleAddWorkout={handleAddWorkout}
            isEditing={true}
          />

          <WorkoutContainerProvider>
            {workouts.map(workout => (
              <WorkoutContainer
                key={workout.id}
                workout={workout}
                isActive={activeWorkout === workout.id}
                exercises={workout.exercises}
                handleRemoveWorkout={handleRemoveWorkout}
                handleAddExercise={() => handleAddExercise(workout.id)}
                handleRemoveExercise={handleRemoveExercise}
                handleWorkoutTitle={handleWorkoutTitle}
              />
            ))}
          </WorkoutContainerProvider>
        </div>
        <div className='create-prog-page__right-container'>
          <h1 className='create-prog-page__exercise-container-title'>
            {activeWorkout
              ? `Adding exercises for ${
                  workouts.find(workout => workout.id === activeWorkout)?.name
                }`
              : ''}
          </h1>
          {showExerciseList && (
            <ExerciseList
              activeWorkout={activeWorkout}
              selectedExercises={
                workouts.find(workout => workout.id === activeWorkout)
                  ?.exercises || []
              }
              onSelectExercise={handleSelectExercise}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateProgram;
