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
      <Button mode="contained" onPress={onPress} style={{borderRadius: 8}}>
        <Text style={{color: 'white'}}>Tải lại</Text>
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
    },

    title: {
      fontSize: 20,
      fontWeight: '500',
      //   flex: 1,
      alignContent: 'center',
      alignSelf: 'center',
    },
    images: {
      width: 200,
      height: 200,
    },
  });
};
