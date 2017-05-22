import Expo, {AppLoading} from 'expo';
import React from 'react';
import Game from './src/Game'
import {View, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';

import {connect} from 'react-redux';
import {addNavigationHelpers} from 'react-navigation';
import {AppNavigator} from './reducers/navigation';

const AppWithNavigationState = ({ dispatch, nav }) => (
  <View style={{flex: 1}}>
    {/* <Game style={StyleSheet.absoluteFill} /> */}
    <AppNavigator navigation={addNavigationHelpers({
        dispatch: dispatch,
        state: nav,
      })}
    />
  </View>
);


export default connect(
  state => ({
    nav: state.nav
  }),
  {})(AppWithNavigationState);

  AppWithNavigationState.propTypes = {
  dispatch: PropTypes.func.isRequired,
  nav: PropTypes.object.isRequired,
};
