import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  PanResponder,
  Dimensions,
  Alert
} from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { Ionicons } from '@expo/vector-icons';

const CombinedWorkoutItem = () => {
  const [workouts, setWorkouts] = useState([
    { id: 1, title: 'Workout 1', type: 'panResponder' },
    { id: 2, title: 'Workout 2', type: 'panResponder' },
    { id: 3, title: 'Workout 3', type: 'panResponder' },
    { id: 4, title: 'Workout 4', type: 'swipeable' },
    { id: 5, title: 'Workout 5', type: 'swipeable' },
    { id: 6, title: 'Workout 6', type: 'swipeable' }
  ]);

  const handleDelete = id => {
    setWorkouts(workouts.filter(workout => workout.id !== id));
  };

  // First approach: Custom PanResponder
  const WorkoutItemPanResponder = ({ title, onDelete }) => {
    const [isDeleting, setIsDeleting] = useState(false);
    const pan = useRef(new Animated.ValueXY()).current;
    const deleteAnim = useRef(new Animated.Value(0)).current;
    const { width } = Dimensions.get('window');
    const SWIPE_THRESHOLD = -width * 0.3;

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

    if (isDeleting) return null;

    return (
      <View style={styles.itemContainer}>
        <Animated.View
          style={[
            styles.deleteTextContainer,
            {
              opacity: pan.x.interpolate({
                inputRange: [-width * 0.3, 0],
                outputRange: [1, 0],
                extrapolate: 'clamp'
              })
            }
          ]}
        >
          <Text style={styles.deleteText}>DELETE</Text>
        </Animated.View>
        <Animated.View
          {...panResponder.panHandlers}
          style={[styles.item, { transform: [{ translateX: pan.x }] }]}
        >
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>
            NO EXERCISES - <Text style={styles.addText}>ADD</Text>
          </Text>
        </Animated.View>
      </View>
    );
  };

  // Second approach: Using react-native-gesture-handler/Swipeable
  const WorkoutItemSwipeable = ({ title, onDelete }) => {
    const renderRightActions = () => {
      return (
        <TouchableOpacity style={styles.deleteAction} onPress={onDelete}>
          <Ionicons name='trash-outline' size={24} color='#FFFFFF' />
          <Text style={styles.deleteActionText}>Delete</Text>
        </TouchableOpacity>
      );
    };

    return (
      <Swipeable renderRightActions={renderRightActions}>
        <View style={styles.item}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>
            NO EXERCISES - <Text style={styles.addText}>ADD</Text>
          </Text>
        </View>
      </Swipeable>
    );
  };

  const renderWorkoutItem = workout => {
    return workout.type === 'panResponder' ? (
      <WorkoutItemPanResponder
        key={workout.id}
        title={workout.title}
        onDelete={() => handleDelete(workout.id)}
      />
    ) : (
      <WorkoutItemSwipeable
        key={workout.id}
        title={workout.title}
        onDelete={() => handleDelete(workout.id)}
      />
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>PanResponder Approach:</Text>
      {workouts.filter(w => w.type === 'panResponder').map(renderWorkoutItem)}

      <Text style={styles.sectionTitle}>Swipeable Approach:</Text>
      {workouts.filter(w => w.type === 'swipeable').map(renderWorkoutItem)}
    </View>
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
  },
  deleteAction: {
    backgroundColor: '#E74C3C',
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    height: '100%'
  },
  deleteActionText: {
    color: '#FFFFFF',
    fontSize: 14,
    marginTop: 5
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    padding: 10,
    backgroundColor: '#1E1E1E'
  }
});

export default CombinedWorkoutItem;
