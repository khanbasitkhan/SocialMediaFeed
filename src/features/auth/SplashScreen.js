import React, { useEffect } from 'react';
import { View, Image, StyleSheet, StatusBar, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
} from 'react-native-reanimated';
import { theme } from '../../config/theme';
import { initDatabase } from '../../services/dbServices';

const { width } = Dimensions.get('window');

const SplashScreen = ({ navigation }) => {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.5);

  useEffect(() => {
    initDatabase();

    opacity.value = withTiming(1, { duration: 1000 });
    scale.value = withSpring(1);

    const timer = setTimeout(() => {
      navigation.replace('Signup');
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigation, opacity, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  const animatedTextStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />

      <View style={[styles.circle, styles.topCircle]} />
      <View style={[styles.circle, styles.bottomCircle]} />

      <Animated.View style={[styles.logoContainer, animatedStyle]}>
        <Image
          source={require('../../assets/images/Social Media Feed App.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </Animated.View>

      <Animated.Text style={[styles.tagline, animatedTextStyle]}>
        Connect • Share • Grow
      </Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    width: width * 0.6,
    height: width * 0.6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  circle: {
    position: 'absolute',
    width: 250,
    height: 250,
    borderRadius: 125,
  },
  topCircle: {
    top: -100,
    right: -50,
    backgroundColor: theme.colors.secondary + '20',
  },
  bottomCircle: {
    bottom: -80,
    left: -60,
    backgroundColor: theme.colors.primary + '20',
  },
  tagline: {
    position: 'absolute',
    bottom: 50,
    fontSize: 16,
    letterSpacing: 2,
    color: theme.colors.primary,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
});

export default SplashScreen;