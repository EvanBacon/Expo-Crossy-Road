import * as React from 'react';
import { Image, StyleSheet, TouchableOpacity as TouchableBounce } from 'react-native';

import AudioManager from '../../src/AudioManager';

export default function Button({ onPress, style, imageStyle, source }) {
  return (
    <TouchableBounce
      onPress={onPress}
      onPressIn={async () => {
        await AudioManager.playAsync(AudioManager.sounds.button_in);
      }}
      onPressOut={async _ => {
        await AudioManager.playAsync(AudioManager.sounds.button_out);
      }}
      style={[styles.container, style]}
    >
      <Image
        source={source}
        style={[styles.image, imageStyle]}
      />
    </TouchableBounce>
  );
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
