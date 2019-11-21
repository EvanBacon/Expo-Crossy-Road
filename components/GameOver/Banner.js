import React from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

import useDimensions from '../../src/hooks/useDimensions';
import Button from '../Button';

export default function Banner(props) {
  const renderButton = ({ onPress, source, style }, key) => (
    <Button
      key={key}
      onPress={onPress}
      imageStyle={[styles.button, style]}
      source={source}
      style={{ marginLeft: 8, width: 90, flex: undefined }}
    />
  );

  const { animatedValue, style } = props;
  const { window: { width } } = useDimensions()
  return (
    <Animated.View style={[styles.container, { minWidth: width, maxWidth: width }, style]}>
      <Animated.View
        style={[
          styles.banner,
          {
            transform: [{ translateX: animatedValue }],
          },
        ]}
      >
        <Text style={styles.text} numberOfLines={2}>
          {props.title}
        </Text>
        {props.button && renderButton(props.button, 0)}
      </Animated.View>
    </Animated.View>
  );

}

const styles = StyleSheet.create({
  text: {
    fontSize: 18,
    color: 'white',
    fontFamily: 'retro',
    textAlign: 'center',
  },
  banner: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: 'red',
    height: 56,
    paddingHorizontal: 8,
    marginVertical: 8,
  },
  button: {
    height: 56,
    marginLeft: 24,
  },
});
