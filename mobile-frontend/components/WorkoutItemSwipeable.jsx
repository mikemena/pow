import { Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../src/styles/globalStyles';

const WorkoutItemSwipeable = ({ onDelete, children }) => {
  // Create an animated value for border radius
  const animatedBorderRadius = new Animated.Value(10);

  const renderRightActions = () => {
    return (
      <TouchableOpacity style={styles.deleteAction} onPress={onDelete}>
        <Ionicons name='trash-outline' size={24} color={colors.eggShell} />
        <Text style={styles.deleteActionText}>Delete</Text>
      </TouchableOpacity>
    );
  };

  // Handle swipe progress
  const onSwipeableWillOpen = () => {
    Animated.timing(animatedBorderRadius, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false
    }).start();
  };

  const onSwipeableWillClose = () => {
    Animated.timing(animatedBorderRadius, {
      toValue: 10,
      duration: 200,
      useNativeDriver: false
    }).start();
  };

  return (
    <Swipeable
      renderRightActions={renderRightActions}
      onSwipeableWillOpen={onSwipeableWillOpen}
      onSwipeableWillClose={onSwipeableWillClose}
      overshootRight={false}
    >
      <Animated.View
        style={[
          styles.contentContainer,
          {
            borderTopRightRadius: animatedBorderRadius,
            borderBottomRightRadius: animatedBorderRadius,
            // Keep these static
            borderTopLeftRadius: 10,
            borderBottomLeftRadius: 10
          }
        ]}
      >
        {children}
      </Animated.View>
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    overflow: 'hidden'
  },
  deleteAction: {
    backgroundColor: colors.red,
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '100%',
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10
  },
  deleteActionText: {
    color: colors.eggShell,
    fontSize: 12,
    marginTop: 4
  }
});

export default WorkoutItemSwipeable;
