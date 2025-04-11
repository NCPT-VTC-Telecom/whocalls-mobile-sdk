import React from 'react';
import {View, Animated, StyleSheet, Dimensions, ScrollView} from 'react-native';

const {width} = Dimensions.get('window');

const PlaceHolderItem = ({
  opacity,
}: {
  opacity: Animated.AnimatedInterpolation<number>;
}) => (
  <View style={styles.container}>
    <Animated.View style={[styles.placeholder, {opacity}]} />
    <Animated.View
      style={[styles.placeholder, styles.shortPlaceholder, {opacity}]}
    />
    <Animated.View style={[styles.placeholder, {opacity}]} />
  </View>
);

const PlaceHolder = () => {
  const animatedValue = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <ScrollView style={styles.scrollView}>
      {Array(5)
        .fill(null)
        .map((_, index) => (
          <PlaceHolderItem key={index} opacity={opacity} />
        ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  container: {
    padding: 16,
    gap: 8,
  },
  placeholder: {
    height: 20,
    backgroundColor: '#E1E9EE',
    borderRadius: 4,

    width: (width - 32) * 0.9,
  },
  shortPlaceholder: {
    width: (width - 32) * 0.7,
  },
});

export default PlaceHolder;
