import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { ProgramContext } from '../../contexts/programContext';
import Button from '../Inputs/Button';

const ProgramButtonContainer = () => {
  const navigate = useNavigate();

  // Access program data and functions from ProgramContext
  const { program, addWorkout } = useContext(ProgramContext);

  const handleCancel = () => {
    // Redirect to the create workout page
    navigate('/');
  };

  const handleAddWorkout = event => {
    event.preventDefault();

    // Create a new workout object with desired default values
    const newWorkout = {
      name: `Workout ${program.workouts.length + 1}`,
      exercises: [] // Starting with an empty exercises array
      // Add any other properties you need for a new workout
    };
    console.log('newWorkout from handler func', newWorkout);

    // Call addWorkout with the new workout object, not the array of workouts
    addWorkout(newWorkout);
  };

  return (
    <div className='prog-container__btn-container'>
      <Button type='button' onClick={handleAddWorkout}>
        Add Workout
      </Button>
      <Button type='submit'>Save</Button>
      <Button type='button' onClick={handleCancel}>
        Cancel
      </Button>
    </div>
  );
};

export default ProgramButtonContainer;
