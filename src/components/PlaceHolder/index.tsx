import React, {useEffect, useRef} from 'react';
import {Animated, StyleSheet, View} from 'react-native';

const PlaceHolder: React.FC = () => {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    );
    animation.start();

    return () => animation.stop();
  }, [opacity]);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.loader, {opacity}]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loader: {
    width: 100,
    height: 100,
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
  },
});

export default PlaceHolder;
