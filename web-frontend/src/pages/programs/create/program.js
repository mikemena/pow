import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { GOAL_TYPES, DURATION_TYPES } from '../../../utils/constants';
import DayContainer from '../../../components/DayContainer/DayContainer';
import useFetchData from '../../../hooks/useFetchData';
import Dropdown from '../../../components/Inputs/Dropdown';
import TextInput from '../../../components/Inputs/TextInput';
import Button from '../../../components/Inputs/Button';

import './program.css';

const CreateProgram = () => {
  const [program, setProgram] = useState({
    programName: '',
    programDuration: '',
    daysPerWeek: '',
    dayType: '',
    programGoal: '',
    workouts: [],
    selectedExercises: []
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState('');
  const [selectedEquipment, setSelectedEquipment] = useState('');
  const [days, setDays] = useState([]);
  const [selectDuration, setDuration] = useState('');
  const [selectGoal, setGoal] = useState('');
  const [programName, setProgramName] = useState('');

  const navigate = useNavigate();

  const {
    data: exercises,
    isLoading,
    error
  } = useFetchData('http://localhost:9025/api/exercise-catalog');

  const filteredExercises = useMemo(() => {
    return exercises.filter(exercise => {
      const matchesMuscle =
        !selectedMuscle ||
        selectedMuscle === 'All' ||
        exercise.muscle === selectedMuscle;
      const matchesEquipment =
        !selectedEquipment ||
        selectedEquipment === 'All' ||
        exercise.equipment === selectedEquipment;
      const matchesSearchTerm =
        !searchTerm ||
        exercise.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesMuscle && matchesEquipment && matchesSearchTerm;
    });
  }, [searchTerm, selectedMuscle, selectedEquipment, exercises]);

  const handleDaysPerWeekChange = selectedDaysPerWeek => {
    setProgram(prevWorkout => ({
      ...prevWorkout,
      daysPerWeek: selectedDaysPerWeek
    }));
  };

  const handleDurationChange = e => {
    setDuration(e.target.value);
  };

  const handleGoalChange = e => {
    setGoal(e.target.value);
  };

  const handleProgramNameChange = e => {
    setProgramName(e.target.value);
  };

  const addDay = () => {
    const newDayId = days.length > 0 ? days[days.length - 1].id + 1 : 1; // Ensure unique ID
    const newDay = {
      id: newDayId,
      name: `Day ${newDayId}` // Customize the naming as needed
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

  const handleSaveProgram = async event => {
    event.preventDefault();

    const programData = {
      user_id: 2, // hardcoded for now, but should be the logged in user's ID
      name: program.programName,
      program_duration: program.programDuration,
      days_per_week: program.daysPerWeek,
      duration_unit: program.durationUnit,
      main_goal: program.mainGoal,
      workouts: program.workouts.map(workout => ({
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

  const handleCancel = () => {
    // Redirect to the create workout page
    navigate('/workouts');
  };

  if (isLoading) return <div>loading...</div>;
  if (error) return <div>Error loading exercises: {error}</div>;

  return (
    <div className='page-layout'>
      <h1 className='page-title'>Create New Program</h1>
      <form onSubmit={handleSaveProgram}>
        <div>
          <div className='input-container'>
            <TextInput
              type='text'
              placeholder='Enter Program Name'
              value={program.name}
              onChange={handleProgramNameChange}
            />
          </div>
          <div className='program-detail'>
            <Dropdown
              id='goal'
              value={selectGoal}
              onChange={handleGoalChange}
              options={GOAL_TYPES}
              placeholder='Select Goal'
            />
          </div>
          <div className='program-detail-container'>
            <div className='program-detail'>
              <div className='input-container' id='duration-container'>
                <TextInput
                  id='duration-amount'
                  type='text'
                  placeholder='Enter Duration Amount'
                  value={program.duration}
                  onChange={handleDurationChange}
                />
                <Dropdown
                  id='duration-unit'
                  value={selectDuration}
                  onChange={handleDurationChange}
                  options={DURATION_TYPES}
                  placeholder='Select Duration Unit'
                />
              </div>
            </div>

            <div className='input-container'>
              <TextInput
                type='text'
                id='days-per-week'
                placeholder='Enter Days Per Week'
                value={program.daysPerWeek}
                onChange={handleDaysPerWeekChange}
              />
            </div>
          </div>
        </div>
        <Button
          id='save-program-button'
          onClick={addDay}
          type='button'
          bgColor='#EAEAEA'
        >
          Add Day
        </Button>

        {days.map(day => (
          <DayContainer key={day.id} day={day} onRemove={handleRemoveDay} />
        ))}

        <div className='button-container'>
          <Button
            id='save-program-button'
            onClick={handleSaveProgram}
            type='submit'
          >
            Save
          </Button>
          <Button
            id='cancel-program-button'
            onClick={handleCancel}
            type='button'
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateProgram;
