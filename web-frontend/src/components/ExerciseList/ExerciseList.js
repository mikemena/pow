import Exercise from '../../components/Exercise/Exercise';
import Stack from '@mui/material/Stack';
import useFetchData from '../../hooks/useFetchData';
import CircularProgress from '@mui/material/CircularProgress';

const ExercisesList = ({ onSelect, selectedMuscle, selectedEquipment }) => {
  const {
    data: exercises,
    isLoading,
    error
  } = useFetchData('http://localhost:9025/api/exercise-catalog');

  const filteredExercises = exercises.filter(exercise => {
    return (
      (!selectedMuscle || exercise.muscle === selectedMuscle) &&
      (!selectedEquipment || exercise.equipment === selectedEquipment)
    );
  });

  // Loading indicator or error message for exercises
  if (isLoading) return <CircularProgress />;
  if (error) return <div>Error loading exercises: {error}</div>;

  return (
    <div className='page-layout'>
      <Stack direction='column' spacing={2}>
        {filteredExercises.map(exercise => (
          <Exercise
            key={exercise.exercise_id}
            name={exercise.name}
            muscle={exercise.muscle}
            equipment={exercise.equipment}
            image={`http://localhost:9025/${exercise.file_path}`}
            onSelect={onSelect}
          />
        ))}
      </Stack>
    </div>
  );
};

export default ExercisesList;
