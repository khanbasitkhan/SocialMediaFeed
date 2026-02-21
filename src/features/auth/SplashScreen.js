import React, { useEffect, useRef } from 'react';
import {
  View,
  Image,
  StyleSheet,
  StatusBar,
  Dimensions,
  Animated,
  Text,
} from 'react-native';
import { theme } from '../../config/theme';
import { initDatabase } from '../../services/dbServices';

const { width } = Dimensions.get('window');

const SplashScreen = ({ navigation, isInitialLoading }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    initDatabase();

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();

    if (navigation && !isInitialLoading) {
      const timer = setTimeout(() => {
        navigation.replace("Login");
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [navigation, fadeAnim, scaleAnim, isInitialLoading]);

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <View style={[styles.circle, styles.topCircle]} />
      <View style={[styles.circle, styles.bottomCircle]} />

      <Animated.View
        style={[
          styles.logoContainer,
          { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
        ]}
      >
        <Image
          source={require('../../assets/images/Social Media Feed App.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.appTitle}>Social Media Feed</Text>
      </Animated.View>

      <Animated.Text style={[styles.tagline, { opacity: fadeAnim }]}>
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
    width: width * 0.8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: width * 0.5,
    height: width * 0.5,
    marginBottom: 10,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.text,
    letterSpacing: 1,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  circle: { position: 'absolute', width: 250, height: 250, borderRadius: 125 },
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
