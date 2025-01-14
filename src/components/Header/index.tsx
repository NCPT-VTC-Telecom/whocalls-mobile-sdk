import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {StackScreenProps} from '@react-navigation/stack';

import AntDesign from 'react-native-vector-icons/AntDesign';
import {useAppNavigation} from '../../helpers';

const Headers = () => {
  const navigation = useAppNavigation();
  return (
    <View
      style={{
        backgroundColor: 'white',
        padding: 8,
        height: 60,
        justifyContent: 'center',
      }}>
      <AntDesign
        name="arrowleft"
        onPress={() => navigation.goBack()}
        size={20}
      />
      {/* <Text style={styles.title}>{name}</Text> */}
    </View>
  );
};

export default Headers;

const styles = StyleSheet.create({});
