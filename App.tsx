import React from 'react';

import {name as appName} from './app.json';
import type {PropsWithChildren} from 'react';
import {AppRegistry, SafeAreaView, StyleSheet, useColorScheme} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
// import {createStackNavigator} from '@react-navigation/stack';

import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import Welcome from './src/Welcome';
import Home from './src/screens/Home';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const Stack = createNativeStackNavigator();

  const Tab = createBottomTabNavigator();

  const HomeTab = () => {
    return (
      <Tab.Navigator screenOptions={{headerStyle: {backgroundColor: '#00A88E'}, title: 'WhoCalls', headerTitleStyle: {color: 'white'}}}>
        <Tab.Screen name="Check" component={Home} />
        <Tab.Screen name="List" component={Home} />
        <Tab.Screen name="Add" component={Home} />
        <Tab.Screen name="Setting" component={Home} />
      </Tab.Navigator>
    );
  };

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{headerShown: false}} initialRouteName="Home">
          <Stack.Screen name="Welcome" component={Welcome} />
          <Stack.Screen name="Home" component={HomeTab} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

AppRegistry.registerComponent(appName, () => App);

export default App;
