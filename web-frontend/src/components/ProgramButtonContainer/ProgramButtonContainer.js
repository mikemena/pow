import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoIosArrowDown } from 'react-icons/io';
import { ProgramContext } from '../../contexts/programContext';
import Button from '../Inputs/Button';

import { useTheme } from '../../contexts/themeContext';

const ProgramButtonContainer = ({ isEditing }) => {
  const navigate = useNavigate();

  // Access program data and functions from ProgramContext
  const { program, addWorkout } = useContext(ProgramContext);

  const handleCancel = () => {
    // Redirect to the create workout page
    navigate('/');
  };

  const handleAddWorkout = event => {
    event.preventDefault();
    addWorkout(program.workouts);
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
