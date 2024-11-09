import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Animated,
  PanResponder,
  Dimensions
} from 'react-native';

const { width } = Dimensions.get('window');
const SWIPE_THRESHOLD = -width * 0.3;

const Set = ({ index, set, isLast, onSetChange, onDelete, themedStyles }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const pan = useRef(new Animated.ValueXY()).current;
  const deleteAnim = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > 10;
      },
      onPanResponderMove: (_, gestureState) => {
        Animated.event([null, { dx: pan.x }], { useNativeDriver: false })(
          _,
          gestureState
        );
        if (gestureState.dx < -width * 0.3) {
          deleteAnim.setValue(
            Math.min(1, (-gestureState.dx - width * 0.3) / (width * 0.2))
          );
        } else {
          deleteAnim.setValue(0);
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
              toValue: 0,
              duration: 200,
              useNativeDriver: false
            })
          ]).start(() => {
            setIsDeleting(true);
            setTimeout(() => onDelete(set.id), 100);
          });
        } else {
          Animated.spring(pan.x, {
            toValue: 0,
            useNativeDriver: false
          }).start();
          Animated.timing(deleteAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: false
          }).start();
        }
      }
    })
  ).current;

  const deleteContainerTranslateX = pan.x.interpolate({
    inputRange: [-width, 0],
    outputRange: [-width * 0.4, 0],
    extrapolate: 'clamp'
  });

  const deleteTextOpacity = pan.x.interpolate({
    inputRange: [-width * 0.6, -width * 0.3, 0],
    outputRange: [0, 1, 0],
    extrapolate: 'clamp'
  });

  if (isDeleting) {
    return null;
  }

  return (
    <View style={styles.setRowWrapper}>
      <Animated.View
        style={[
          styles.deleteTextContainer,
          {
            transform: [{ translateX: deleteContainerTranslateX }],
            opacity: deleteTextOpacity
          }
        ]}
      >
        <Text style={styles.deleteText}>Delete</Text>
      </Animated.View>
      <Animated.View
        {...panResponder.panHandlers}
        style={[
          styles.setRow,
          { backgroundColor: themedStyles.secondaryBackgroundColor },
          { transform: [{ translateX: pan.x }] },
          isLast && styles.lastSetRow
        ]}
      >
        <Text style={[styles.setNumber, { color: themedStyles.textColor }]}>
          {index + 1}
        </Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: themedStyles.primaryBackgroundColor,
              color: themedStyles.textColor
            }
          ]}
          value={set.weight?.toString()}
          onChangeText={value => onSetChange(index, 'weight', value)}
          keyboardType='numeric'
        />
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: themedStyles.primaryBackgroundColor,
              color: themedStyles.textColor
            }
          ]}
          value={set.reps?.toString()}
          onChangeText={value => onSetChange(index, 'reps', value)}
          keyboardType='numeric'
        />
      </Animated.View>
    </View>
  );
};

// Update the existing styles with new ones for the slide-to-delete functionality
const styles = StyleSheet.create({
  setRowWrapper: {
    position: 'relative',
    overflow: 'hidden'
  },
  setRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    height: 45
    // zIndex: 1,
    // borderRadius: 10
  },
  lastSetRow: {
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10
  },
  deleteTextContainer: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: width * 0.5,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 15,
    backgroundColor: '#FF3B30',
    zIndex: 0
  },
  deleteText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold'
  },
  setNumber: {
    width: 40,
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'Lexend'
  },
  input: {
    flex: 1,
    height: 35,
    marginHorizontal: 8,
    borderRadius: 10,
    textAlign: 'center',
    fontFamily: 'Lexend'
  }
});

export default Set;
