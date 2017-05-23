import React, { Component, PropTypes } from "react";
import hoistNonReactStatic from "hoist-non-react-statics";
import {connect} from 'react-redux';

import {setCharacter} from '../actions/character';
export default (WrappedComponent) => {
  class ConnectedCharacterComponent extends Component {
    render() {
      return (
        <WrappedComponent {...this.props} />
      );
    }
  }

  return connect(
    state => ({
      characterName: state.character.name,
      characterId: state.character.id,
      characterIndex: state.character.index,
    }),
    {
      setCharacter
    }
  )(hoistNonReactStatic(ConnectedCharacterComponent, WrappedComponent));
}
