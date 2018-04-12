import { dispatch } from '@rematch/core';
import React from 'react';
import { StyleSheet } from 'react-native';
import { connect } from 'react-redux';

import Icon from './Icon';

class Sound extends React.Component {
  onPress = () => {
    dispatch.muted.toggle();
    this.props.onPress && this.props.onPress();
  };
  render() {
    const { onPress, name, muted, ...props } = this.props;
    const iconName = muted ? 'volume-off' : 'volume-up';
    return <Icon onPress={this.onPress} name={iconName} {...props} />;
  }
}

const styles = StyleSheet.create({
  container: {},
  icon: {
    resizeMode: 'contain',
    height: 48,
  },
});

export default connect(({ muted }) => ({ muted }))(Sound);
