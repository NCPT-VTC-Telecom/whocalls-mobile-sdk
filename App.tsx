import React from 'react';

import {name as appName} from './app.json';
import {AppRegistry} from 'react-native';

import Toast from 'react-native-toast-message';

import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import Welcome from './src/Welcome';
import TabNavigator from './src/navigations/TabNavigator';
import OptionsList from './src/screens/Settings/Options';
import Feedback from './src/screens/Feedbacks'; // Import the Feedback screen
import {SheetProvider} from 'react-native-actions-sheet';

function App(): React.JSX.Element {
  const Stack = createNativeStackNavigator();

  const screen = [
    {
      name: 'Home',
      component: TabNavigator,
      options: {title: 'Home', headerShown: false},
    },
    {
      name: 'OptionsList' as string,
      component: OptionsList,
      options: {title: 'OptionsList', headerShown: false},
    },
    {
      name: 'Welcome',
      component: Welcome,
      options: {title: 'Details Screen', headerShown: false},
    },
    {
      name: 'Feedback', // Add the Feedback screen route
      component: Feedback,
      options: {title: 'Feedback', headerShown: true}, // Enable header for Feedback
    },
  ];

  return (
    <SheetProvider>
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{headerShown: false}}
            initialRouteName="Home">
            {screen.map((screen, index) => (
              <Stack.Screen
                key={index}
                name={screen.name}
                component={screen.component}
                options={screen.options} // Use the options defined in the array
              />
            ))}
          </Stack.Navigator>
        </NavigationContainer>
        <Toast />
      </SafeAreaProvider>
    </SheetProvider>
  );
}

export default App;
