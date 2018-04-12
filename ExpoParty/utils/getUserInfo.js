import { Constants } from 'expo';
import getSlug from './getSlug';

function getUserInfo() {
  const {
    appOwnership,
    expoVersion,
    deviceId,
    deviceName,
    deviceYearClass,
    isDevice,
    platform,
  } = Constants;
  return {
    slug: getSlug(),
    appOwnership,
    expoVersion,
    deviceId,
    deviceName,
    deviceYearClass,
    isDevice,
    platform,
  };
}
export default getUserInfo;
