import React, { Component } from 'react';
import { Text, View, TouchableWithoutFeedback, Animated, Image, StyleSheet } from 'react-native';
import { Constants } from 'expo';
import TouchableBounce from 'react-native/Libraries/Components/Touchable/TouchableBounce'

export default class Button extends Component {
  animation = new Animated.Value(0);
  wrapStyle = { overflow: 'hidden', opacity: this.animation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.95],
    extrapolate: 'clamp'
  }), transform: [
    {
      translateY: this.animation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 6.5],
        extrapolate: 'clamp'
      })
    },
    {
      scale: 1
    }
  ]};


  render() {
    return (
      <TouchableWithoutFeedback onPressIn={_=> {
          this.animation.setValue(1);
        }} onPressOut={_=> {
          this.animation.setValue(0);
        }} onPress={this.props.onPress} style={[styles.container, this.props.style]}>
        <Animated.View style={{overflow: 'hidden'}}>
        <Animated.View style={this.wrapStyle}>
          <Image source={this.props.source} style={[styles.image, this.props.imageStyle]}/>
        </Animated.View>
      </Animated.View>
    </TouchableWithoutFeedback>

  );
}
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
  },
  image: {
    // flex: 1,

    resizeMode: 'contain',
    height: 48
  },
});
