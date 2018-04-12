import React, { Component } from 'react';
import { Animated, Dimensions, StyleSheet, View } from 'react-native';

import Button from '../Button';
import RetroText from '../RetroText';

const { width } = Dimensions.get('window');
export default class Banner extends Component {
  renderButton = ({ onPress, source, style }, key) => (
    <Button
      key={key}
      onPress={onPress}
      imageStyle={[styles.button, style]}
      source={source}
    />
  );

  render() {
    // LayoutAnimation.easeInEaseOut()
    const { animatedValue, style } = this.props;

    return (
      <View style={[styles.container, style]}>
        <Animated.View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            transform: [{ translateX: animatedValue }],
          }}
        >
          <RetroText style={styles.text} numberOfLines={2}>
            {this.props.title}
          </RetroText>
          {this.props.button && this.renderButton(this.props.button, 0)}
        </Animated.View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  text: {
    fontSize: 18,
    color: 'white',
    flex: 2,
    textAlign: 'center',
  },
  container: {
    alignItems: 'center',
    justifyContent: 'space-around',
    flexDirection: 'row',
    backgroundColor: 'red',
    height: 56,
    paddingHorizontal: 8,
    width,
    marginVertical: 8,
    maxWidth: width,
  },
  button: {
    height: 56,
  },
});
