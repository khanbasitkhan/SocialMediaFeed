// import React, { useEffect, useState } from 'react';
// import { View, ActivityIndicator } from 'react-native';
// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useDispatch } from 'react-redux';
// import AuthNavigator from '../navigation/AuthNavigator';
// import AppNavigator from '../navigation/AppNavigator';
// import { setUser } from '../store/slices/authSlice';
// import { theme } from '../config/theme';
// import Splash from '../features/auth/SplashScreen'

// const Stack = createNativeStackNavigator();

// const RootNavigator = () => {
//   const [isLoading, setIsLoading] = useState(true);
//   const [initialRoute, setInitialRoute] = useState('Splash');
//   const dispatch = useDispatch();

//   useEffect(() => {
//     const checkLoginStatus = async () => {
//       try {
//         const savedUser = await AsyncStorage.getItem('userToken');
//         if (savedUser) {
//           const userData = JSON.parse(savedUser);
//           dispatch(setUser(userData));
//           setInitialRoute('App');
//         }
//       } catch (error) {
//         console.log('Error checking login status:', error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     checkLoginStatus();
//   }, [dispatch]);

//   if (isLoading) {
//     return (
//       <View
//         style={
//           {
//             flex: 1,
//             justifyContent: 'center',
//             alignItems: 'center',
//             backgroundColor: theme.colors.background,
//         }
//       }
//       >
//         <ActivityIndicator size="large" color={theme.colors.primary} />
//       </View>
//     );
//   }

//   return (
//     <NavigationContainer>
//       <Stack.Navigator
//         screenOptions={{ headerShown: false }}
//         initialRouteName={initialRoute}
//       >

//         <Stack.Screen name="Splash" component={Splash} />
//         <Stack.Screen name="Auth" component={AuthNavigator} />
//         <Stack.Screen name="App" component={AppNavigator} />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// };

// export default RootNavigator;




import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import AuthNavigator from '../navigation/AuthNavigator';
import AppNavigator from '../navigation/AppNavigator';
import { setUser } from '../store/slices/authSlice';
import SplashScreen from '../features/auth/SplashScreen'; // Import updated

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [initialRoute, setInitialRoute] = useState('Auth');
  const dispatch = useDispatch();

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const savedUser = await AsyncStorage.getItem('userToken');
        if (savedUser) {
          const userData = JSON.parse(savedUser);
          dispatch(setUser(userData));
          setInitialRoute('App'); // Agar login hai to Seedha App
        } else {
          setInitialRoute('Auth'); // Warna Auth (Login/Signup)
        }
      } catch (error) {
        console.log('Error checking login status:', error);
      } finally {
        // Splash animation ko thora time dene ke liye timeout
        setTimeout(() => {
          setIsLoading(false);
        }, 2500);
      }
    };

    checkLoginStatus();
  }, [dispatch]);

  // Jab tak status check ho raha hai, Animated Splash Screen dikhao
  if (isLoading) {
    return <SplashScreen navigation={null} isInitialLoading={true} />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName={initialRoute}
      >
        <Stack.Screen name="Auth" component={AuthNavigator} />
        <Stack.Screen name="App" component={AppNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;