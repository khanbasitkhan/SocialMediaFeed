import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import AuthNavigator from '../navigation/AuthNavigator';
import AppNavigator from '../navigation/AppNavigator';
import { setUser } from '../store/slices/authSlice';
import SplashScreen from '../features/auth/SplashScreen'; 

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { isLoggedIn } = useSelector(state => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const savedUser = await AsyncStorage.getItem('userToken');
        if (savedUser) {
          const userData = JSON.parse(savedUser);
          dispatch(setUser(userData));
        }
      } catch (error) {
        console.log('Error checking login status:', error);
      } finally {
        setTimeout(() => {
          setIsLoading(false);
        }, 2500);
      }
    };

    checkLoginStatus();
  }, [dispatch]);

  if (isLoading) {
    return <SplashScreen navigation={null} isInitialLoading={true} />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isLoggedIn ? (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        ) : (
          <Stack.Screen name="App" component={AppNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;