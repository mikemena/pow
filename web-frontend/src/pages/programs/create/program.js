import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DayContainerProvider } from '../../../contexts/dayContainerContext';
import DayContainer from '../../../components/DayContainer/DayContainer';
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

  const [days, setDays] = useState([{ id: 1, name: 'Day 1' }]);
  const [showExerciseList, setShowExerciseList] = useState(false);
  const [activeDay, setActiveDay] = useState(null);

  const navigate = useNavigate();

  const handleAddExercise = dayId => {
    setShowExerciseList(true);
    setActiveDay(dayId);
  };

  const handleAddDay = () => {
    const newDayId = days.length > 0 ? days[days.length - 1].id + 1 : 1;
    const newDay = {
      id: newDayId,
      name: `Day ${newDayId}`
    };
    setDays([...days, newDay]);
  };

  const handleRemoveDay = dayId => {
    //remove days
    const updatedDays = days.filter(day => day.id !== dayId);

    //renumber the remaining days
    const renumberedDays = updatedDays.map((day, index) => ({
      ...day,
      id: index + 1,
      name: `Day ${index + 1}`
    }));
    setDays(renumberedDays);
  };

  const handleSaveProgram = async NewProgram => {
    const programData = {
      user_id: 2,
      name: NewProgram.programName,
      program_duration: NewProgram.programDuration,
      days_per_week: NewProgram.daysPerWeek,
      duration_unit: NewProgram.durationUnit,
      main_goal: NewProgram.mainGoal,
      workouts: NewProgram.workouts.map(workout => ({
        name: workout.name,
        order: workout.order,
        exercises: workout.exercises.map(exercise => ({
          catalog_exercise_id: exercise.catalog_exercise_id,
          order: exercise.order,
          sets: exercise.sets.map(set => ({
            reps: set.reps,
            weight: set.weight,
            order: set.order
          }))
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
            handleAddDay={handleAddDay}
            isEditing={true}
          />

          <DayContainerProvider>
            {days.map(day => (
              <DayContainer
                key={day.id}
                day={day}
                isActive={activeDay === day.id}
                handleRemoveDay={handleRemoveDay}
                handleAddExercise={() => handleAddExercise(day.id)}
              />
            ))}
          </DayContainerProvider>
        </div>
        <div className='create-prog-page__right-container'>
          <h1 className='create-prog-page__exercise-container-title'>
            {activeDay
              ? `Adding exercises for ${
                  days.find(day => day.id === activeDay)?.name
                }`
              : 'Select a day to add exercises'}
          </h1>
          {showExerciseList && <ExerciseList />}
        </div>
      </div>
    </div>
  );
};

export default CreateProgram;
