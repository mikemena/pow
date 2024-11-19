import { View, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../src/styles/globalStyles';
import { useTheme } from '../src/hooks/useTheme';
import { getThemedStyles } from '../src/utils/themeUtils';

const SwipeableItemDeletion = ({
  onDelete,
  children,
  isLast,
  swipeableType
}) => {
  // Create an animated value for border radius
  const animatedBorderRadius = new Animated.Value(
    isLast && swipeableType === 'set' ? 10 : 0
  );

  const { state: themeState } = useTheme();
  const themedStyles = getThemedStyles(
    themeState.theme,
    themeState.accentColor
  );

  const renderRightActions = progress => {
    // Animated interpolation for the gradient opacity
    const opacity = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1]
    });

    return (
      <Animated.View style={[styles.deleteActionContainer, { opacity }]}>
        <TouchableOpacity onPress={onDelete} style={{ flex: 1 }}>
          <View style={styles.deleteAction}>
            <View style={styles.deleteActionContent}>
              <Ionicons
                name='trash-outline'
                size={24}
                color={colors.eggShell}
              />
            </View>
            {/* Overlay the gradient on top */}
            <LinearGradient
              colors={[themedStyles.secondaryBackgroundColor, colors.red]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[StyleSheet.absoluteFill, styles.gradient]}
            />
          </View>
        </TouchableOpacity>
      </Animated.View>
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
      toValue: isLast && swipeableType === 'set' ? 10 : 0,
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
          { borderBottomRightRadius: animatedBorderRadius }
        ]}
      >
        {children}
      </Animated.View>
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    overflow: 'hidden'
  },
  deleteActionContainer: {
    width: 80,
    height: '100%'
  },
  deleteAction: {
    flex: 1,
    backgroundColor: colors.red,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    overflow: 'hidden'
  },
  deleteActionContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1
  },
  gradient: {
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    opacity: 1
  },
  deleteActionText: {
    color: colors.eggShell,
    fontSize: 12,
    marginTop: 4
  }
});

export default SwipeableItemDeletion;
