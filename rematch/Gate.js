import { init } from '@rematch/core';
import { getPersistor } from '@rematch/persist';
import createRematchPersist from '@rematch/persist';
import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/es/integration/react';

import * as models from './models';
import { AsyncStorage } from 'react-native';
const persistPlugin = createRematchPersist({
  whiteList: ['score'],
  version: 2,
  storage: AsyncStorage,
});

export const store = init({
  models,
  plugins: [persistPlugin],
});

class Gate extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <PersistGate persistor={getPersistor()}>
          {this.props.children}
        </PersistGate>
      </Provider>
    );
  }
}

export default Gate;
