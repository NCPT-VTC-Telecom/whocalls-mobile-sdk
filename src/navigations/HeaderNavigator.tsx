import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

interface HeaderNavigatorProps {
  isBack?: boolean;
  name: string;
}

const HeaderNavigator = ({isBack, name}: {isBack?: boolean; name: string}) => {
  return (
    <View
      style={{
        backgroundColor: 'white',
        padding: 8,
        height: 60,
        justifyContent: 'center',
      }}>
      <Text style={styles.title}>{name}</Text>
    </View>
  );
};

export default HeaderNavigator;

const styles = StyleSheet.create({
  title: {fontWeight: '500', fontSize: 20, textAlign: 'center'},
});
