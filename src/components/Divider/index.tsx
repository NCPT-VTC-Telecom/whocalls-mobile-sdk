import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

const Divider: React.FC<any> = () => {
  return <View style={styles.divider} />;
};

export default Divider;

const styles = StyleSheet.create({
  divider: {
    backgroundColor: 'black',
    height: 1,
    // width: '100%',
    alignSelf: 'center',
    justifyContent: 'center',
    width: '90%',
    marginVertical: 8,
    paddingHorizontal: 16,
  },
});
