import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProgramContext } from '../../../contexts/programContext';
import { WorkoutContainerProvider } from '../../../contexts/workoutContainerContext';
import WorkoutContainer from '../../../components/WorkoutContainer/WorkoutContainer';
import ProgramForm from '../../../components/Program/ProgramForm';
import ProgramButtonContainer from '../../../components/ProgramButtonContainer/ProgramButtonContainer';
import NavBar from '../../../components/Nav/Nav';
import ExerciseList from '../../../components/ExerciseList/ExerciseList';
import Toggle from '../../../components/Inputs/Toggle';

import './program.css';

const CreateProgram = () => {
  // Use ProgramContext to manage the state of the program
  const { program, saveProgram } = useContext(ProgramContext);

  const [showExerciseList, setShowExerciseList] = useState(false);
  const [activeWorkout, setActiveWorkout] = useState(null);

  const navigate = useNavigate();

  const handleShowExercise = workoutId => {
    if (workoutId === activeWorkout && showExerciseList) {
      setShowExerciseList(false);
      setActiveWorkout(null); // Optionally reset the active workout
    } else {
      // Show the exercise list for the clicked workout.
      setShowExerciseList(true);
      setActiveWorkout(workoutId);
    }
  };

  // Save function uses context's save logic
  const handleSaveProgram = async () => {
    try {
      await saveProgram();
      navigate('/programs');
    } catch (error) {
      console.error('Failed to save the program:', error);
    }
  };

  return (
    <div>
      {' '}
      <NavBar isEditing='true' />
      <div className='create-prog-page'>
        <div className='toggle-container'>
          <Toggle />
        </div>
        <div className='create-prog-page__container'>
          <div className='create-prog-page__left-container'>
            <div className='create-prog-page__header'>
              <h1 className='create-prog-page__title'>Create New Program</h1>
            </div>
            <ProgramForm program={program} isEditing={true} />
            <WorkoutContainerProvider>
              {program.workouts.map(workout => (
                <WorkoutContainer
                  key={workout.id}
                  workout={workout}
                  isActive={activeWorkout === workout.id}
                  showExercises={handleShowExercise}
                  showExerciseList={showExerciseList}
                />
              ))}
            </WorkoutContainerProvider>
          </div>
          <div className='create-prog-page__right-container'>
            <h1 className='create-prog-page__exercise-container-title'>
              {activeWorkout
                ? `Adding exercises for ${
                    program.workouts.find(
                      workout => workout.id === activeWorkout
                    )?.name
                  }`
                : ''}
            </h1>
            {showExerciseList && (
              <ExerciseList
                activeWorkout={activeWorkout}
                selectedExercises={
                  program.workouts.find(workout => workout.id === activeWorkout)
                    ?.exercises || []
                }
              />
            )}
          </div>
          <ProgramButtonContainer />
        </div>
      </div>
    </div>
  );
};

export default CreateProgram;
