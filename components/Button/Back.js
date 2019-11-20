import React, { Component } from 'react';
import {
  Image,
  StyleSheet,
  TouchableOpacity as TouchableBounce,
} from 'react-native';

import Images from '../../src/Images';

export default class Button extends Component {
  render() {
    return (
      <TouchableBounce
        onPress={this.props.onPress}
        style={[styles.container, this.props.style]}
      >
        <Image
          source={Images.button.back}
          style={[styles.image, this.props.imageStyle]}
        />
      </TouchableBounce>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
  },
  image: {
    resizeMode: 'contain',
    height: 48,
    width: 60,
  },
});
