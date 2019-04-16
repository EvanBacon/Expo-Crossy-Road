import React, { Component } from 'react';
import {
  Image,
  StyleSheet,
  TouchableOpacity as TouchableBounce,
} from 'react-native';

import AudioManager from '../../AudioManager';

// import TouchableBounce from 'react-native/Libraries/Components/Touchable/TouchableBounce';

export default class Button extends Component {
  state = { soundReady: false };

  render() {
    return (
      <TouchableBounce
        onPress={this.props.onPress}
        onPressIn={async () => {
          await AudioManager.playAsync(AudioManager.sounds.button_in);
        }}
        onPressOut={async _ => {
          await AudioManager.playAsync(AudioManager.sounds.button_out);
        }}
        style={[styles.container, this.props.style]}
      >
        <Image
          source={this.props.source}
          style={[styles.image, this.props.imageStyle]}
        />
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
    flex: 1,
  },
  image: {
    flex: 1,

    resizeMode: 'contain',
    height: 48,
  },
});
