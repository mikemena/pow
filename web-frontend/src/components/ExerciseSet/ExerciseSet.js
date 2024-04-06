import React, { useContext } from 'react';
import { ProgramContext } from '../../contexts/programContext';
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

  return (
    <div className='exercise-set__container'>
      <div className='exercise-set__row'>
        <p className='exercise-set__order'>{setDetails.order}</p>
        <input
          type='number'
          className='exercise-set__weight'
          value={setDetails.weight}
          onChange={e => handleChange({ weight: e.target.value })}
          placeholder='lbs'
        />
        <input
          type='number'
          className='exercise-set__reps'
          value={setDetails.reps}
          onChange={e => handleChange({ reps: e.target.value })}
          placeholder='Reps'
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
