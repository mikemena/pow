import { MdDelete, MdAddBox } from 'react-icons/md';
import './ExerciseSet.css';

const ExerciseSet = ({ setDetails, onUpdate, onRemove, onAdd }) => {
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

        <button onClick={onRemove} className='exercise-set__remove-set-btn'>
          <MdDelete size={20} />
        </button>
      </div>
      <button onClick={onAdd} className='exercise-set__add-set-btn'>
        <div className='exercise-set__button-wrapper'>
          <MdAddBox size={20} />
        </div>
      </button>
    </div>
  );
};

export default ExerciseSet;
