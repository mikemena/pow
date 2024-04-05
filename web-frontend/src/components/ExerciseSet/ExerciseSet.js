import React, { useContext } from 'react';
import { ProgramContext } from '../../contexts/programContext';
import { MdDelete } from 'react-icons/md';
import './ExerciseSet.css';

const ExerciseSet = ({ setDetails, onUpdate, workoutId, exerciseId }) => {
  const { deleteSet } = useContext(ProgramContext);

  const handleDeleteSet = (workoutId, exerciseId, setId) => {
    // console.log(
    //   `Deleting set: ${setId} from exercise: ${exerciseId} in workout: ${workoutId}`
    // );

    deleteSet(workoutId, exerciseId, setId);
  };

  // console.log('ExerciseSet props:', {
  //   setDetails,
  //   workoutId,
  //   exerciseId
  // });

  return (
    <div className='exercise-set__container'>
      <div className='exercise-set__row'>
        <input
          type='number'
          className='exercise-set__weight'
          value={setDetails.weight}
          onChange={e => onUpdate({ ...setDetails, weight: e.target.value })}
          placeholder='lbs'
        />
        <input
          type='number'
          className='exercise-set__reps'
          value={setDetails.reps}
          onChange={e => onUpdate({ ...setDetails, reps: e.target.value })}
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
