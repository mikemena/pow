import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import DayContainer from '../../../components/DayContainer/DayContainer';

import useFetchData from '../../../hooks/useFetchData';

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

  const [days, setDays] = useState([
    { id: 1, name: 'Monday' },
    { id: 2, name: 'Tuesday' },
    { id: 3, name: 'Wednesday' },
    { id: 4, name: 'Thursday' },
    { id: 5, name: 'Friday' },
    { id: 6, name: 'Saturday' },
    { id: 7, name: 'Sunday' }
  ]);

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

  const handleSearch = value => {
    setSearchTerm(value);
  };

  const handleMuscleChange = value => {
    setSelectedMuscle(value);
  };

  const handleEquipmentChange = value => {
    setSelectedEquipment(value);
  };

  const handleDayChange = selectedDay => {
    setDays(prevWorkout => ({ ...prevWorkout, day: selectedDay }));
  };

  const handleDayTypeChange = selectedDayType => {
    setProgram(prevWorkout => ({ ...prevWorkout, dayType: selectedDayType }));
  };

  const handleProgramGoalChange = selectedProgramGoal => {
    setProgram(prevWorkout => ({
      ...prevWorkout,
      programGoal: selectedProgramGoal
    }));
  };

  const handleDaysPerWeekChange = selectedDaysPerWeek => {
    setProgram(prevWorkout => ({
      ...prevWorkout,
      daysPerWeek: selectedDaysPerWeek
    }));
  };

  const handleDurationChange = selectedDuration => {
    setProgram(prevWorkout => ({
      ...prevWorkout,
      programDuration: selectedDuration
    }));
  };

  const addDay = () => {
    const newDayId = days.length > 0 ? days[days.length - 1].id + 1 : 1; // Ensure unique ID
    const newDay = {
      id: newDayId,
      name: `Day ${newDayId}` // Customize the naming as needed
    };
    setDays([...days, newDay]);
  };

  const removeDay = dayId => {
    setDays(days.filter(day => day.id !== dayId));
  };

  const handleSaveProgram = async event => {
    event.preventDefault();

    const programData = {
      user_id: 2, // hardcoded for now, but should be the logged in user's ID
      name: program.programName,
      program_duration: program.programDuration,
      days_per_week: program.daysPerWeek,
      day_type: program.dayType,
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

  const dayTypes = ['Day of Week', 'Numerical'];
  const durations = ['Days', 'Weeks', 'Months'];
  const goals = ['Strength', 'Endurance', 'Hypertrophy', 'Weight Loss'];

  return (
    <div className='page-layout'>
      <h1 className='page-title'>Create New Program</h1>
      <form onSubmit={handleSaveProgram}>
        <div>
          <div className='input-container'>
            <input
              type='text'
              className='full-width-input'
              placeholder='Enter Program Name'
              value={program.name}
              onChange={e =>
                setProgram(prevWorkout => ({
                  ...prevWorkout,
                  programName: e.target.value
                }))
              }
            />
          </div>

          <div className='program-detail-container'>
            <div className='program-detail'>
              <select
                id='day-type'
                onChange={e => handleDayTypeChange(e.target.value)}
                placeholder='Select Day Type'
              >
                <option value=''>Select Day Type</option>
                {dayTypes.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div className='program-detail'>
              <div className='input-container'>
                <input
                  type='text'
                  className='full-width-input'
                  placeholder='Enter Duration Amount'
                  value={program.duration_amount}
                  onChange={e =>
                    setProgram(prevWorkout => ({
                      ...prevWorkout,
                      duration_amount: e.target.value
                    }))
                  }
                />
              </div>
              <select
                id='durations'
                onChange={e => handleDurationChange(e.target.value)}
                placeholder='Select Duration'
              >
                <option value=''>Select Duration</option>
                {durations.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className='input-container'>
              <input
                type='text'
                id='days-per-week'
                placeholder='Enter Days Per Week'
                value={program.daysPerWeek}
                onChange={e => handleDaysPerWeekChange(e.target.value)}
              />
            </div>

            <div className='program-detail'>
              <select
                id='program_goal'
                onChange={e => handleProgramGoalChange(e.target.value)}
              >
                <option value=''>Select Program Goal</option>
                {goals.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <button onClick={addDay}>Add Day</button>

        {days.map(day => (
          <div key={day.id}>
            <DayContainer day={day.name} />
            <button onClick={() => removeDay(day.id)}>Remove {day.name}</button>
          </div>
        ))}

        <div className='button-container'>
          <button id='save-program-button' onClick={handleSaveProgram}>
            Save
          </button>
          <button id='cancel-program-button' onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProgram;
