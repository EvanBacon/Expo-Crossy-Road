import React, { Component } from 'react';
import { Text, View, Image, StyleSheet } from 'react-native';
import TouchableBounce from 'react-native/Libraries/Components/Touchable/TouchableBounce'

export default class Button extends Component {
  render() {
    return (
      <TouchableBounce onPress={this.props.onPress} style={[styles.container, this.props.style]}>
          <Image source={this.props.source} style={[styles.image, this.props.imageStyle]}/>
    </TouchableBounce>

  );
}

/*
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
*/
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
