import React, { useContext } from 'react';
import { ProgramContext } from '../../contexts/programContext';
import { useTheme } from '../../contexts/themeContext';
import { RiDeleteBack2Fill } from 'react-icons/ri';
import './ExerciseSet.css';

const ExerciseSet = ({ setDetails, workoutId, exerciseId }) => {
  const { updateSet, deleteSet } = useContext(ProgramContext);
  const { theme } = useTheme();

  const handleChange = updatedValue => {
    console.log('Updating set:', updatedValue);
    updateSet(workoutId, exerciseId, { ...setDetails, ...updatedValue });
  };

  const handleDeleteSet = (workoutId, exerciseId, setId) => {
    console.log('Deleting set with id:', setId);
    deleteSet(workoutId, exerciseId, setId);
  };

  return (
    <div className='exercise-set__container'>
      <div className='exercise-set__order-column'>
        <div className='exercise-set__set-data'>
          <p className={`exercise-set__order ${theme}`}>{setDetails.order}</p>
        </div>
      </div>

      <div className='exercise-set__weight-column'>
        <div className='exercise-set__set-data'>
          <input
            type='number'
            className={`exercise-set__weight ${theme}`}
            value={setDetails.weight}
            onChange={e => handleChange({ weight: e.target.value })}
          />
        </div>
      </div>

      <div className='exercise-set__reps-column'>
        <div className='exercise-set__set-data'>
          <input
            type='number'
            className={`exercise-set__reps ${theme}`}
            value={setDetails.reps}
            onChange={e => handleChange({ reps: e.target.value })}
          />
        </div>
      </div>

      <button
        onClick={() => handleDeleteSet(workoutId, exerciseId, setDetails.id)}
        className='exercise-set__remove-set-btn'
      >
        <RiDeleteBack2Fill size={25} />
      </button>
    </div>
  );
};

export default ExerciseSet;
