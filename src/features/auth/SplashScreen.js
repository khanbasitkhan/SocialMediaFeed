import React, { useEffect, useRef } from 'react';
import { 
  View, 
  Image, 
  StyleSheet, 
  StatusBar, 
  Dimensions, 
  Animated 
} from 'react-native';
import { theme } from '../../config/theme';
import { initDatabase } from '../../services/dbServices';

const { width } = Dimensions.get('window');

const SplashScreen = ({ navigation }) => {
  
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

    const timer = setTimeout(() => {
      navigation.replace('Signup');
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigation, fadeAnim, scaleAnim]);

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
          { 
            opacity: fadeAnim, 
            transform: [{ scale: scaleAnim }] 
          }
        ]}
      >
        <Image
          source={require('../../assets/images/Social Media Feed App.png')}
          style={styles.logo}
          resizeMode="contain"
        />
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