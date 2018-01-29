import hoistNonReactStatic from 'hoist-non-react-statics';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { setGameState } from '../actions/game';

export default WrappedComponent => {
  class ConnectedGameStateComponent extends Component {
    render() {
      return <WrappedComponent {...this.props} />;
    }
  }

  return connect(
    state => ({
      gameState: state.game.gameState,
    }),
    {
      setGameState,
    },
  )(hoistNonReactStatic(ConnectedGameStateComponent, WrappedComponent));
};
