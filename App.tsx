import React from 'react';

import {name as appName} from './app.json';
import {AppRegistry} from 'react-native';

import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import Welcome from './src/Welcome';
import TabNavigator from './src/navigations/TabNavigator';
import OptionsList from './src/screens/Settings/Options';

function App(): React.JSX.Element {
  const Stack = createNativeStackNavigator();

  const screen = [
    {
      name: 'Home',
      component: TabNavigator,
      options: {title: 'Home'},
    },
    {
      name: 'OptionsList' as string,
      component: OptionsList,
      options: {title: 'OptionsList'},
    },
    {
      name: 'Welcome',
      component: Welcome,
      options: {title: 'Details Screen'},
    },
  ];

  return (
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
              options={{title: screen.options.title}}
            />
          ))}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

AppRegistry.registerComponent(appName, () => App);

export default App;
