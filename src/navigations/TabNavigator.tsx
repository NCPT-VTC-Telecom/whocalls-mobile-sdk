import {View, Text} from 'react-native';
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ContactsList from '../screens/Contacts';
import HeaderNavigator from './HeaderNavigator';
import {Header} from '@react-navigation/elements';
import Settings from '../screens/Settings';
import AddNumbers from '../screens/AddNumbers';
import CheckInformation from '../screens/Home';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  const renderHeader = (name: string) => () => {
    return <HeaderNavigator name={name} />;
  };
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName;

          if (route.name === 'Kiểm tra') {
            iconName = 'check-circle'; // Icon name for Home
          } else if (route.name === 'Lịch sử') {
            iconName = 'contacts'; // Icon name for Profile
          } else if (route.name === 'Thêm') {
            iconName = 'person-add-alt-1'; // Icon name for Profile
          } else if (route.name === 'Cài đặt') {
            iconName = 'settings';
          }

          return (
            <MaterialIcons name={`${iconName}`} size={size} color={color} />
          );
        },
        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: '#18538C',
        },
        header: renderHeader(route.name),
      })}>
      <Tab.Screen name="Kiểm tra" component={CheckInformation} />
      <Tab.Screen name="Lịch sử" component={ContactsList} />
      <Tab.Screen name="Thêm" component={AddNumbers} />
      <Tab.Screen name="Cài đặt" component={Settings} />
    </Tab.Navigator>
  );
};

export default TabNavigator;
