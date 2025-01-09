import {View, Text} from 'react-native';
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Home from '../screens/Home';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ContactsList from '../screens/Contacts';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
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

          // Return the Icon component
          return (
            <MaterialIcons name={`${iconName}`} size={size} color={color} />
          );
        },
        tabBarActiveTintColor: '#00A88E',
        tabBarInactiveTintColor: 'gray',
      })}>
      <Tab.Screen name="Kiểm tra" component={Home} />
      <Tab.Screen name="Lịch sử" component={ContactsList} />
      <Tab.Screen name="Thêm" component={Home} />
      <Tab.Screen name="Cài đặt" component={Home} />
    </Tab.Navigator>
  );
};

export default TabNavigator;
