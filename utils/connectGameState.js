import React, { Component, PropTypes } from "react";
import hoistNonReactStatic from "hoist-non-react-statics";
import {connect} from 'react-redux';

import {setGameState} from '../actions/game';
export default (WrappedComponent) => {
  class ConnectedComponent extends Component {
    render() {
      return (
        <WrappedComponent {...props} />
      );
    }
  }

  return connect(
    state => ({
      gameState: state.game.gameState
    }),
    {
      setGameState
    }
  )(hoistNonReactStatic(ConnectedComponent, WrappedComponent));
}
