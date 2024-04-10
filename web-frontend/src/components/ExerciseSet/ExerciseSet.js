import React, { useContext } from 'react';
import { ProgramContext } from '../../contexts/programContext';
import { useTheme } from '../../contexts/themeContext';
import { MdDelete } from 'react-icons/md';
import './ExerciseSet.css';

const ExerciseSet = ({ setDetails, workoutId, exerciseId }) => {
  const { updateSet, deleteSet } = useContext(ProgramContext);

  const handleChange = updatedValue => {
    updateSet(workoutId, exerciseId, { ...setDetails, ...updatedValue });
  };

  const handleDeleteSet = (workoutId, exerciseId, setId) => {
    deleteSet(workoutId, exerciseId, setId);
  };

  const { theme } = useTheme();

  return (
    <div className='exercise-set__container'>
      <div className='exercise-set__row'>
        <p className={`exercise-set__order ${theme}`}>{setDetails.order}</p>
        <input
          type='number'
          className={`exercise-set__weight ${theme}`}
          value={setDetails.weight}
          onChange={e => handleChange({ weight: e.target.value })}
        />
        <input
          type='number'
          className={`exercise-set__reps ${theme}`}
          value={setDetails.reps}
          onChange={e => handleChange({ reps: e.target.value })}
        />

        <button
          onClick={() => handleDeleteSet(workoutId, exerciseId, setDetails.id)}
          className='exercise-set__remove-set-btn'
        >
          <MdDelete size={25} />
        </button>
      </div>
    </div>
  );
};

export default ExerciseSet;
