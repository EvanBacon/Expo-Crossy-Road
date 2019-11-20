import * as React from 'react';
import { Image, StyleSheet, TouchableOpacity as TouchableBounce } from 'react-native';

import Images from '../../src/Images';

export default function Button({ onPress, style, imageStyle }) {
  return (
    <TouchableBounce
      onPress={onPress}
      style={style}
    >
      <Image
        source={Images.button.back}
        style={[styles.image, imageStyle]}
      />
    </TouchableBounce>
  );
}

const styles = StyleSheet.create({
  image: {
    resizeMode: 'contain',
    height: 48,
    width: 60,
  },
});
