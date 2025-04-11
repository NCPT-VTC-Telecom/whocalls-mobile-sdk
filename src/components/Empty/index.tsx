import {StyleSheet, View, Text} from 'react-native';
import React from 'react';

import {Image} from 'react-native';

import {images} from '../../assets';

import {Button} from '@rneui/themed';

const EmptyComponents = ({
  isLoading,
  onPress,
}: {
  isLoading?: boolean;
  onPress: () => void;
}) => {
  const styles = createStyles();
  return (
    <View style={styles.container}>
      <Image source={images.empty} style={styles.images} />
      <Text style={styles.title}>Chưa có dữ liệu</Text>
      {isLoading && (
        <Button
          onPress={onPress}
          color={'#18538C'}
          containerStyle={{width: 150}}
          title={'Tải lại'}
        />
      )}
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
      alignContent: 'center',
      alignSelf: 'center',
      gap: 8,
    },

    title: {
      fontSize: 18,
      fontWeight: '500',
      alignContent: 'center',
      alignSelf: 'center',
    },
    images: {
      width: 180,
      height: 180,
    },
  });
};
