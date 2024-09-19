import * as React from 'react';
import { Image, StyleSheet } from 'react-native';

import Images from '../src/Images';

const sprite = Object.values(Images.hand);

const INTERVAL = 400;

export default function HandCTA({ style }) {
  const [index, setIndex] = React.useState(0)

  React.useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % sprite.length)
    }, INTERVAL);

    return () => clearInterval(interval);
  }, []);

  return <Image source={sprite[index]} style={[styles.image, style]} />
}

const styles = StyleSheet.create({
  image: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    resizeMode: 'contain',
  },
});
