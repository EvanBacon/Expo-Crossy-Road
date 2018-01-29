import hoistNonReactStatic from 'hoist-non-react-statics';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { setCharacter } from '../actions/character';

export default WrappedComponent => {
  class ConnectedCharacterComponent extends Component {
    render() {
      return <WrappedComponent {...this.props} />;
    }
  }

  return connect(
    state => ({
      character: state.character,
    }),
    {
      setCharacter,
    },
  )(hoistNonReactStatic(ConnectedCharacterComponent, WrappedComponent));
};
