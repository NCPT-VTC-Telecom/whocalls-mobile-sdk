import React from 'react';
import {View, StyleSheet, Animated, Easing} from 'react-native';

interface PlaceHolderProps {
  type?: 'post' | 'list';
  numOfItem?: number;
}

const PlaceHolder = ({type = 'post', numOfItem = 10}: PlaceHolderProps) => {
  const opacity = React.useRef(new Animated.Value(0.1)).current;

  React.useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(opacity, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      {resetBeforeIteration: true, iterations: Number.MAX_SAFE_INTEGER},
    );
    animation.start();

    return () => {
      animation.stop();
    };
  }, []);

  if (type === 'list') {
    return (
      <View style={{flex: 1, padding: 16, gap: 16}}>
        {[...new Array(numOfItem)].map((_, idx) => (
          <View key={idx} style={styles.header}>
            <Animated.View style={[styles.avatar, {opacity}]} />
            <View style={styles.content}>
              <Animated.View
                style={[styles.contentLine, {width: 120, opacity}]}
              />
              <Animated.View
                style={[styles.contentLine, {width: 200, opacity}]}
              />
            </View>
          </View>
        ))}
      </View>
    );
  }

  return (
    <View style={{flex: 1}}>
      {[...new Array(numOfItem)].map((_, idx) => (
        <View key={idx} style={styles.container}>
          <View style={styles.header}>
            <Animated.View style={[styles.avatar, {opacity}]} />
            <View style={styles.content}>
              <Animated.View
                style={[styles.contentLine, {width: 120, opacity}]}
              />
              <Animated.View
                style={[styles.contentLine, {width: 200, opacity}]}
              />
            </View>
          </View>
          <Animated.View style={[styles.line, {opacity}]} />
          <Animated.View style={[styles.line, {opacity}]} />
          <Animated.View style={[styles.line, {marginRight: 100, opacity}]} />
          <Animated.View style={[styles.line, {marginRight: 50, opacity}]} />
          <Animated.View style={[styles.line, {opacity}]} />
          <Animated.View style={[styles.line, {marginRight: 100, opacity}]} />
          <Animated.View style={[styles.line, {marginRight: 50, opacity}]} />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  content: {
    flex: 1,
    marginLeft: 20,
  },
  contentLine: {
    height: 13,
    borderRadius: 5,
    backgroundColor: '#ddd',
    marginVertical: 8,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ddd',
  },
  line: {
    height: 13,
    borderRadius: 5,
    backgroundColor: '#ddd',
    marginVertical: 8,
  },
});

export default React.memo(PlaceHolder, () => true);
