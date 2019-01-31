import React, { Component } from 'react';
import { Text } from 'react-native';

export default class RetroText extends Component {
  render() {
    const { style, ...props } = this.props;
    return <Text style={[{ fontFamily: 'retro' }, style]} {...props} />;
  }
}
