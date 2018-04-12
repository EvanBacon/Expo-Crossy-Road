import { Constants } from 'expo';
import { Platform } from 'react-native';

function storeUrl() {
  const { OS } = Platform;
  const manifest = Constants.manifest[OS];

  if (OS === 'ios') {
    return manifest.appStoreUrl;
  } else {
    return manifest.playStoreUrl;
  }
}

export default storeUrl;
