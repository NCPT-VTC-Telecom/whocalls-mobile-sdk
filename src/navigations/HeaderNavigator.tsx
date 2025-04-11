import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

interface HeaderNavigatorProps {
  name: string;
}

const HeaderNavigator = ({name}: HeaderNavigatorProps) => {
  const {top} = useSafeAreaInsets();

  return (
    <View
      style={{
        paddingTop: Math.max(top, 10),
        backgroundColor: '#18538C',
        paddingBottom: 12,
        paddingHorizontal: 12,

        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
      <Text style={styles.title}>{name}</Text>
    </View>
  );
};

export default HeaderNavigator;

const styles = StyleSheet.create({
  title: {fontWeight: '500', fontSize: 20, textAlign: 'center', color: 'white'},
  button: {
    marginLeft: 10,
    padding: 8,
    backgroundColor: '#fff',
    borderRadius: 5,
  },
});
