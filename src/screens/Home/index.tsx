import {View, Text, Image, StyleSheet} from 'react-native';
import React from 'react';
import {images} from '../../assets';

const Home = () => {
  const styles = createStyles();
  return (
    <View style={styles.container}>
      <Image source={images.logo} style={styles.image} />
      <Text style={{flex: 1}}>Chao mừng đến với WhoCalls</Text>
    </View>
  );
};

export default Home;

const createStyles = () => {
  return StyleSheet.create({
    container: {flex: 1, justifyContent: 'center', alignItems: 'center'},
    image: {
      width: 200,
      height: 200,
    },
  });
};
