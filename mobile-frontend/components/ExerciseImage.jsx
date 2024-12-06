import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, ActivityIndicator, Image, StyleSheet } from 'react-native';
import { useTheme } from '../src/hooks/useTheme';
import { getThemedStyles } from '../src/utils/themeUtils';

const ExerciseImage = ({ exercise }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const { state: themeState } = useTheme();
  const themedStyles = getThemedStyles(
    themeState.theme,
    themeState.accentColor
  );
  const isMounted = useRef(true);
  const retryCount = useRef(0);
  const MAX_RETRIES = 2;

  useEffect(() => {
    // Reset states when exercise changes
    setIsLoading(true);
    setImageError(false);
    retryCount.current = 0;

    console.log('Exercise Image Props:', {
      id: exercise.id,
      name: exercise.name,
      fileUrl: exercise.file_url,
      fullExercise: exercise
    });

    return () => {
      isMounted.current = false;
    };
  }, [exercise]);

  const handleImageError = useCallback(async () => {
    console.error('Image loading error for exercise:', {
      id: exercise.id,
      name: exercise.name,
      fileUrl: exercise.file_url,
      retryCount: retryCount.current
    });

    try {
      // Try to fetch the image URL directly
      const response = await fetch(exercise.file_url);
      const contentType = response.headers.get('content-type');

      console.log('Direct fetch response:', {
        status: response.status,
        contentType,
        headers: Object.fromEntries(response.headers.entries()),
        url: response.url
      });

      // Check if it's actually an image
      if (!contentType?.startsWith('image/')) {
        console.error('Invalid content type:', contentType);
      }
    } catch (error) {
      console.error('Direct fetch error:', error);
    }

    if (!isMounted.current || retryCount.current >= MAX_RETRIES) {
      console.log('Max retries reached or component unmounted');
      setImageError(true);
      setIsLoading(false);
      return;
    }

    retryCount.current += 1;
    console.log(`Retry attempt ${retryCount.current} of ${MAX_RETRIES}`);
    setIsLoading(true);
  }, [exercise]);

  const handleLoadStart = () => {
    console.log('Image load starting:', exercise.name);
    if (isMounted.current) {
      setIsLoading(true);
      setImageError(false);
    }
  };

  const handleLoadSuccess = () => {
    console.log('Image loaded successfully:', exercise.name);
    if (isMounted.current) {
      setIsLoading(false);
      setImageError(false);
    }
  };

  return (
    <View style={styles.imageContainer}>
      {isLoading && !imageError && (
        <ActivityIndicator
          style={styles.loadingIndicator}
          color={themedStyles.accentColor}
          size='small'
        />
      )}
      {imageError ? (
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: themedStyles.textColor }]}>
            Unable to load image
          </Text>
        </View>
      ) : exercise.file_url ? (
        <Image
          source={{
            uri: exercise.file_url,
            cache: 'reload',
            headers: {
              'Cache-Control': 'no-cache',
              Pragma: 'no-cache',
              Accept: 'image/gif,image/jpeg,image/png,image/webp,*/*'
            }
          }}
          style={styles.exerciseImage}
          onLoadStart={handleLoadStart}
          onLoad={handleLoadSuccess}
          onError={handleImageError}
          resizeMode='cover'
          fadeDuration={0}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    width: 90,
    height: 90,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    backgroundColor: '#2A2A2A', // Dark background for loading state
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    overflow: 'hidden'
  },
  loadingIndicator: {
    position: 'absolute'
  },
  errorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%'
  },
  errorText: {
    fontSize: 12,
    textAlign: 'center',
    padding: 5
  },
  exerciseImage: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10
  }
});

export default ExerciseImage;
