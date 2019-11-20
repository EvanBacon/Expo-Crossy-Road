import { createBrowserApp } from '@react-navigation/web';
import { Platform } from 'react-native';
import { createAppContainer } from 'react-navigation';


export default Platform.select({
    web: input => createBrowserApp(input, { history: 'hash' }),
    default: input => createAppContainer(input),
});
