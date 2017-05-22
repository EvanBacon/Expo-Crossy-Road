import Expo, {AppLoading} from 'expo';
import React from 'react';
import Game from './src/Game'
import {View, StyleSheet} from 'react-native';

import {connect} from 'react-redux';
import {addNavigationHelpers} from 'react-navigation';
import {AppNavigator} from './reducers/navigation';

class App extends React.Component {
  render = () => (
    <View style={{flex: 1}}>
      <Game
        style={StyleSheet.absoluteFill}
      />
      <AppNavigator navigation={addNavigationHelpers({
          dispatch: this.props.dispatch,
          state: this.props.nav,
        })} />
      </View>
    );
  }

  export default connect(
    state => {
      nav: state.nav
    }, {})(App);
