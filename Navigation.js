import Expo, {AppLoading} from 'expo';
import React from 'react';
import Game from './src/Game'
import {View, StyleSheet, LayoutAnimation} from 'react-native';
import PropTypes from 'prop-types';

import {connect} from 'react-redux';
import {addNavigationHelpers} from 'react-navigation';
import {AppNavigator} from './reducers/navigation';
import State from './state';

class AppWithNavigationState extends React.Component {

  render() {
    const { dispatch, nav, gameState } = this.props;

    const App = AppNavigator.getNavigator()
    LayoutAnimation.easeInEaseOut();
    return (
      <View style={{flex: 1}}>
        <Game style={StyleSheet.absoluteFill} />
      {gameState != State.Game.playing &&
        <App navigation={addNavigationHelpers({
            dispatch: dispatch,
            state: nav,
          })}
        />
      }
      </View>
    )
  }
}



export default connect(
  state => ({
    nav: state.nav,
    gameState: state.game.gameState
  }),
  {})(AppWithNavigationState);

  AppWithNavigationState.propTypes = {
  dispatch: PropTypes.func.isRequired,
  nav: PropTypes.object.isRequired,
};
