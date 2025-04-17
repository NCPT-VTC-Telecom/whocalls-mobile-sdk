import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ContactsList from '../screens/Contacts';
import HeaderNavigator from './HeaderNavigator';
import Settings from '../screens/Settings';
import CheckInformation from '../screens/Home';
import SMSPage from '../screens/SMS';
import {Platform, Animated, Easing} from 'react-native';

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
            iconName = 'check-circle';
          } else if (route.name === 'Danh sách') {
            iconName = 'contacts';
          } else if (route.name === 'Lịch sử') {
            iconName = 'person-add-alt-1';
          } else if (route.name === 'Cài đặt') {
            iconName = 'settings';
          } else if (route.name === 'SMS') {
            iconName = 'message';
          } else {
            iconName = 'home';
          }

          // Animation for bouncy effect
          const scale = new Animated.Value(focused ? 1.2 : 1);

          Animated.timing(scale, {
            toValue: focused ? 1.2 : 1,
            duration: 300,
            easing: Easing.bounce,
            useNativeDriver: true,
          }).start();

          return (
            <Animated.View style={{transform: [{scale}]}}>
              <MaterialIcons name={`${iconName}`} size={size} color={color} />
            </Animated.View>
          );
        },
        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.5)',
        tabBarStyle: {
          backgroundColor: '#18538C',
          padding: 15,
        },
        header: renderHeader(route.name),
      })}>
      <Tab.Screen name="Kiểm tra" component={CheckInformation} />
      {/* {Platform.OS === 'android' && (
        <Tab.Screen
          name="SMS"
          component={SMSPage}
          options={{headerShown: false}}
        />
      )} */}
      <Tab.Screen name="Danh sách" component={ContactsList} />
      <Tab.Screen name="Cài đặt" component={Settings} />
    </Tab.Navigator>
  );
};

export default TabNavigator;
