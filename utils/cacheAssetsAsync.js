import { Asset, Font } from 'expo';
import { Image } from 'react-native';

export default function cacheAssetsAsync({
  images = [],
  fonts = [],
  audio = [],
}) {
  return Promise.all([
    ...cacheImages(images),
    ...cacheFonts(fonts),
    ...cacheAudio(audio),
  ]);
}

function cacheAudio(audio) {
  return audio.map(phile => Asset.fromModule(phile).downloadAsync());
}

function cacheImages(images) {
  return images.map(image => {
    if (typeof image === 'string') {
      return Image.prefetch(image);
    } else {
      return Asset.fromModule(image).downloadAsync();
    }
  });
}

function cacheFonts(fonts) {
  return fonts.map(font => Font.loadAsync(font));
}
