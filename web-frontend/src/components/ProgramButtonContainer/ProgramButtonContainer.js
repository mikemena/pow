import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProgramContext } from '../../contexts/programContext';
import Button from '../Inputs/Button';

const ProgramButtonContainer = () => {
  const navigate = useNavigate();

  // Access program data and functions from ProgramContext
  const { addWorkout } = useContext(ProgramContext);

  const handleCancel = () => {
    // Redirect to the create workout page
    navigate('/');
  };

  const handleAddWorkout = event => {
    console.log('handleAddWorkout called');
    event.preventDefault();
    addWorkout({});
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
