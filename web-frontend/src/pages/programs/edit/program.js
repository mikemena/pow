import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ProgramContext } from '../../../contexts/programContext';
import { IoChevronBackOutline } from 'react-icons/io5';
import Button from '../../../components/Inputs/Button';
import Workout from '../../../components/Workout/Workout';
import ProgramForm from '../../../components/Program/ProgramForm';
import NavBar from '../../../components/Nav/Nav';
import Toggle from '../../../components/Inputs/Toggle';

import './program.css';

const EditProgram = () => {
  const { state, saveProgram, dispatch, setActiveWorkout, clearState } =
    useContext(ProgramContext);
  const { program_id } = useParams();
  const [program, setProgram] = useState(null);
  const [expandedWorkouts, setExpandedWorkouts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProgram = async () => {
      setLoading(true); // Assume setLoading is defined to handle UI loading state
      try {
        const response = await fetch(
          `http://localhost:9025/api/programs/${program_id}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        dispatch({ type: 'SET_PROGRAM', payload: data });

        data.workouts.forEach(workout => {
          dispatch({
            type: 'ADD_WORKOUT',
            payload: { programId: data.id, workout }
          });
          workout.exercises.forEach(exercise => {
            dispatch({
              type: 'ADD_EXERCISE',
              payload: { workoutId: workout.id, exercises: [exercise] }
            }); // Ensure payload matches expected structure
            exercise.sets.forEach(set => {
              dispatch({
                type: 'ADD_SET',
                payload: { exerciseId: exercise.id, set }
              });
            });
          });
        });
      } catch (err) {
        console.error('Error fetching program details:', err);
        setError(err.message); // Assume setError is defined to handle error state in UI
      } finally {
        setLoading(false);
      }
    };

    fetchProgram();
  }, [program_id, dispatch]); // Ensure dependencies are correctly managed

  const handleExpandWorkout = workoutId => {
    const isCurrentlyExpanded = expandedWorkouts[workoutId];

    setExpandedWorkouts(prevState => ({
      ...Object.keys(prevState).reduce((acc, key) => {
        acc[key] = false; // collapse all
        return acc;
      }, {}),
      [workoutId]: !isCurrentlyExpanded
    }));

    if (!isCurrentlyExpanded) {
      setActiveWorkout(workoutId);
    } else {
      setActiveWorkout(null);
    }
  };

  const handleToggleProgramForm = () => {
    setExpandedWorkouts(prevState => ({
      ...Object.keys(prevState).reduce((acc, key) => {
        acc[key] = false; // collapse all workouts
        return acc;
      }, {}),
      program: !prevState.program // toggle the program form
    }));
  };

  const handleCancel = () => {
    clearState();
    navigate('/');
  };

  const handleAddWorkout = event => {
    event.preventDefault();
    if (program) {
      dispatch({
        type: 'ADD_WORKOUT',
        payload: { programId: program.id }
      });
    }
  };

  const handleSaveProgram = async () => {
    try {
      await saveProgram(program);
      navigate('/programs');
    } catch (error) {
      console.error('Failed to save the program:', error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  console.log('Program:', program);

  // console.log('program.workouts:', program.workouts);

  return (
    <div>
      <NavBar isEditing='true' />
      <div className='create-prog-page'>
        <div className='create-prog-page__toggle-container'>
          <Toggle />
        </div>
        <div className='create-prog-page__container'>
          <div className='create-prog-page__left-container'>
            <ProgramForm
              program={state.programs[Object.keys(state.programs)[0]]}
              isEditing={true}
              isExpanded={expandedWorkouts['program']}
              onToggleExpand={handleToggleProgramForm}
            />
            {state.workouts && Object.keys(state.workouts).length > 0 ? (
              Object.values(state.workouts).map(workout => {
                if (!workout || !workout.id) {
                  console.error('Invalid workout object:', workout); // Log invalid workout object
                  return null;
                }
                return (
                  <Workout
                    key={workout.id}
                    isEditing={true}
                    workout={workout}
                    isExpanded={expandedWorkouts[workout.id] || false}
                    onToggleExpand={() => handleExpandWorkout(workout.id)}
                  />
                );
              })
            ) : (
              <div>No workouts available</div>
            )}
          </div>
        </div>
        <div className='create-prog-page__button-container'>
          <Button type='button' onClick={handleAddWorkout}>
            Add Workout
          </Button>
          <Button type='submit' onClick={handleSaveProgram}>
            Save
          </Button>
          <Button type='button' onClick={handleCancel}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditProgram;
