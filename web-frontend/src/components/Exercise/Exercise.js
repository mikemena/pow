import './Exercise.css';

export default function Exercise({ id, name, muscle, equipment, image }) {
  return (
    <div key={id} className='exercise'>
      <img src={image} alt={name} className='exercise-image' />
      <p className='exercise-detail'>
        {name} ({equipment})
      </p>
      <p className='exercise-muscle'>{muscle} </p>
    </div>
  );
}
