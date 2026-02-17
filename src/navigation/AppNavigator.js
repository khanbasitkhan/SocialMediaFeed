// import React from 'react';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import FeedScreen from '../features/feed/FeedScreen';
// import CreatePost from '../features/feed/CreatePostScreen'
// import ProfileScreen from '../features/profile/ProfileScreen';
// import { theme } from '../config/theme';

// const Tab = createBottomTabNavigator();

// const AppNavigator = () => {
//   return (
//     <Tab.Navigator
//       screenOptions={{
//         headerStyle: { backgroundColor: theme.colors.background },
//         headerTintColor: theme.colors.primary,
//         tabBarActiveTintColor: theme.colors.primary,
//         tabBarInactiveTintColor: theme.colors.subtext,
//       }}
//     >
//       <Tab.Screen name="Feed" component={FeedScreen} />
//       <Tab.Screen name="CreatePost" component={CreatePost} />
//       <Tab.Screen name="Profile" component={ProfileScreen} />
//     </Tab.Navigator>
//   );
// };

// export default AppNavigator;



import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/AntDesign'; 
import FeedScreen from '../features/feed/FeedScreen';
import CreatePost from '../features/feed/CreatePostScreen';
import ProfileScreen from '../features/profile/ProfileScreen';
import { theme } from '../config/theme';

const Tab = createBottomTabNavigator();


const getTabBarIcon = (route, color, size) => {
  let iconName;

  if (route.name === 'Feed') {
    iconName = 'home';
  } else if (route.name === 'CreatePost') {
    iconName = 'pluscircleo';
  } else if (route.name === 'Profile') {
    iconName = 'user';
  }

  return <Icon name={iconName} size={size} color={color} />;
};

const AppNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false, 
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.subtext,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopWidth: 1,
          borderTopColor: theme.colors.border,
          height: 60,
          paddingBottom: 8,
        },
        
        tabBarIcon: ({ color, size }) => getTabBarIcon(route, color, size),
      })}
    >
      <Tab.Screen 
        name="Feed" 
        component={FeedScreen} 
        options={{ tabBarLabel: 'Home' }} 
      />
      <Tab.Screen 
        name="CreatePost" 
        component={CreatePost} 
        options={{ 
            tabBarLabel: 'Post',
            tabBarStyle: { display: 'none' } 
        }} 
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{ tabBarLabel: 'Profile' }} 
      />
    </Tab.Navigator>
  );
};

export default AppNavigator;




