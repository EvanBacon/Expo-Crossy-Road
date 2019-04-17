import { createBrowserApp } from '@react-navigation/web';
import { createAppContainer } from 'react-navigation';
import { Platform } from 'react-native';

const createApp =  Platform.select({
    web: createBrowserApp,
    default: createAppContainer,
})

import MainNavigator from './MainNavigator';

export default createApp(MainNavigator);