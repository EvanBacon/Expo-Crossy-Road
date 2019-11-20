import { createBrowserApp } from '@react-navigation/web';
import { Platform } from 'react-native';
import { createAppContainer } from 'react-navigation';

import createApp from './createApp';
import MainNavigator from './MainNavigator';

const createApp = Platform.select({
    web: createBrowserApp,
    default: createAppContainer,
})

export default createApp(MainNavigator);