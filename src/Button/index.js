import React, { Component } from 'react';
import { Text, View, Image, StyleSheet } from 'react-native';
import { Constants } from 'expo';
import TouchableBounce from 'react-native/Libraries/Components/Touchable/TouchableBounce'

export default class Button extends Component {
  render() {
    return (
      <TouchableBounce onPress={this.props.onPress} style={[styles.container, this.props.style]}>
        <Image source={this.props.source} style={[styles.image, this.props.imageStyle]}/>
      </TouchableBounce>

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
