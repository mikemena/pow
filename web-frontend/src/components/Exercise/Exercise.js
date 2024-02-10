import './Exercise.css';

export default function Exercise({ id, name, muscle, equipment, image }) {
  return (
    <div key={id} className='exercise'>
      <img src={image} alt={name} className='exercise-image' />
      <div className='exercise-details'>
        <p className='exercise-title'>
          {name} ({equipment})
        </p>
        <p className='exercise-muscle'>{muscle} </p>
      </div>
    </div>
  );
}
