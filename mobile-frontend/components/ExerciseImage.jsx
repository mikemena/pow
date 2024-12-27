import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, ActivityIndicator, Image, StyleSheet } from 'react-native';
import { useTheme } from '../src/hooks/useTheme';
import { getThemedStyles } from '../src/utils/themeUtils';
import {
  IMAGE_CACHE,
  cacheImage,
  getCachedImage
} from '../src/utils/imageCache';

const ExerciseImage = ({ exercise }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [imageUrl, setImageUrl] = useState(() => {
    const cachedUrl = getCachedImage(exercise.id);
    console.log(
      `[ExerciseImage] Initial load for ${exercise.id}: ${
        cachedUrl ? 'using cached' : 'using original'
      }`
    );
    return cachedUrl || exercise.imageUrl;
  });
  const { state: themeState } = useTheme();
  const themedStyles = getThemedStyles(
    themeState.theme,
    themeState.accentColor
  );
  const isMounted = useRef(true);

  const refreshImageUrl = async () => {
    try {
      const response = await fetch(
        `http://localhost:9025/api/exercise-catalog/${exercise.id}/image`
      );
      const data = await response.json();

      if (data.imageUrl && isMounted.current) {
        cacheImage(exercise.id, data.imageUrl);
        setImageUrl(data.imageUrl);
        return data.imageUrl;
      }
      return null;
    } catch (error) {
      console.error('URL refresh error:', error);
      return null;
    }
  };

  useEffect(() => {
    const cachedUrl = IMAGE_CACHE.get(exercise.id);
    if (cachedUrl) {
      console.log(`[ExerciseImage] Using cached image for ${exercise.id}`);
      setImageUrl(cachedUrl);
      setIsLoading(false);
    } else if (exercise.imageUrl) {
      console.log(
        `[ExerciseImage] No cache, loading from URL for ${exercise.id}`
      );
      // ... rest of your existing code
    }
  }, [exercise]);

  // useEffect(() => {
  //   isMounted.current = true;

  //   const cachedUrl = IMAGE_CACHE.get(exercise.id);
  //   if (cachedUrl) {
  //     setImageUrl(cachedUrl);
  //     setIsLoading(false);
  //   } else {
  //     const url = exercise.imageUrl;
  //     if (url) {
  //       IMAGE_CACHE.set(exercise.id, url);
  //       setImageUrl(url);
  //     } else if (exercise.file_path) {
  //       refreshImageUrl();
  //     }
  //   }

  //   return () => {
  //     isMounted.current = false;
  //   };
  // }, [exercise]);

  const handleImageError = useCallback(async () => {
    console.log(
      `[ExerciseImage] Image load error for ${exercise.id}, attempting refresh`
    );
    if (!isMounted.current) return;

    try {
      const newUrl = await refreshImageUrl();

      if (newUrl && isMounted.current) {
        setImageUrl(newUrl);
        setIsLoading(true);
        setImageError(false);
        return;
      }
    } catch (error) {
      console.error('Refresh attempt failed:', error);
    }

    if (isMounted.current) {
      setImageError(true);
      setIsLoading(false);
    }
  }, [exercise, imageUrl]);

  const handleLoadStart = () => {
    if (isMounted.current) {
      setIsLoading(true);
      setImageError(false);
    }
  };

  const handleLoadSuccess = () => {
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
      ) : imageUrl ? (
        <Image
          source={{
            uri: imageUrl,
            cache: 'default'
          }}
          style={styles.exerciseImage}
          onLoadStart={handleLoadStart}
          onLoad={handleLoadSuccess}
          onError={handleImageError}
          resizeMode='cover'
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
    backgroundColor: '#2A2A2A',
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
