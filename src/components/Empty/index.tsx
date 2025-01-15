import {StyleSheet, View} from 'react-native';
import React from 'react';

import Text from '../Text';
// import {Image} from '@rneui/base';
import {Image} from 'react-native';

import {images} from '../../assets';
import {Button} from 'react-native-paper';

const EmptyComponents = ({onPress}: {onPress: () => void}) => {
  const styles = createStyles();
  return (
    <View style={styles.container}>
      <Image source={images.empty} style={styles.images} />
      <Text style={styles.title}>Chưa có dữ liệu</Text>
      <Button
        mode="contained"
        onPress={onPress}
        style={{borderRadius: 8, backgroundColor: '#00A88E'}}>
        <Text style={{color: 'white', fontWeight: '700'}}>Tải lại</Text>
      </Button>
    </View>
  );
};

export default EmptyComponents;

const createStyles = () => {
  return StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'white',
      alignContent: 'center',
      alignSelf: 'center',
      gap: 8,
    },

    title: {
      fontSize: 20,
      fontWeight: '700',

      alignContent: 'center',
      alignSelf: 'center',
    },
    images: {
      width: 200,
      height: 200,
    },
  });
};
