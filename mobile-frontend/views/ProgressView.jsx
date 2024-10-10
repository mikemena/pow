import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Animated,
  PanResponder,
  Dimensions
} from 'react-native';

const { width } = Dimensions.get('window');
const SWIPE_THRESHOLD = -width * 0.3;

const WorkoutItem = ({ title, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const pan = useRef(new Animated.ValueXY()).current;
  const deleteAnim = useRef(new Animated.Value(0)).current;

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gestureState) => {
      if (gestureState.dx < 0) {
        pan.x.setValue(gestureState.dx);
      }
    },
    onPanResponderRelease: (_, gestureState) => {
      if (gestureState.dx < SWIPE_THRESHOLD) {
        Animated.parallel([
          Animated.timing(pan.x, {
            toValue: -width,
            duration: 200,
            useNativeDriver: false
          }),
          Animated.timing(deleteAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: false
          })
        ]).start(() => {
          setIsDeleting(true);
          setTimeout(onDelete, 500);
        });
      } else {
        Animated.spring(pan.x, {
          toValue: 0,
          useNativeDriver: false
        }).start();
      }
    }
  });

  const itemStyle = {
    transform: [{ translateX: pan.x }]
  };

  const deleteTextOpacity = pan.x.interpolate({
    inputRange: [-width * 0.3, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp'
  });

  if (isDeleting) {
    return null;
  }

  return (
    <View style={styles.itemContainer}>
      <Animated.View
        style={[styles.deleteTextContainer, { opacity: deleteTextOpacity }]}
      >
        <Text style={styles.deleteText}>DELETE</Text>
      </Animated.View>
      <Animated.View
        {...panResponder.panHandlers}
        style={[styles.item, itemStyle]}
      >
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>
          NO EXERCISES - <Text style={styles.addText}>ADD</Text>
        </Text>
      </Animated.View>
    </View>
  );
};

const ProgramsPage = () => {
  const [workouts, setWorkouts] = useState([
    'Workout 1',
    'Workout 2',
    'Workout 3',
    'Workout 4',
    'Workout 5'
  ]);

  const handleDelete = index => {
    setWorkouts(workouts.filter((_, i) => i !== index));
  };

  return (
    <ScrollView style={styles.container}>
      <SafeAreaView>
        {workouts.map((workout, index) => (
          <WorkoutItem
            key={index}
            title={workout}
            onDelete={() => handleDelete(index)}
          />
        ))}
      </SafeAreaView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E'
  },
  itemContainer: {
    position: 'relative',
    marginBottom: 1
  },
  item: {
    padding: 20,
    backgroundColor: '#2C2C2C',
    zIndex: 1
  },
  title: {
    color: '#A2E368',
    fontSize: 18,
    fontWeight: 'bold'
  },
  subtitle: {
    color: '#FFFFFF',
    fontSize: 14
  },
  addText: {
    color: '#A2E368'
  },
  deleteTextContainer: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    paddingRight: 20
  },
  deleteText: {
    color: '#E74C3C',
    fontWeight: 'bold',
    fontSize: 16
  }
});

export default ProgramsPage;
