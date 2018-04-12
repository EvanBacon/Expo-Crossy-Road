import React from 'react';
import { Linking } from 'react-native';

import storeUrl from '../../utils/storeUrl';
import Icon from './Icon';

class Rate extends React.Component {
  onPress = () => {
    const url = storeUrl();
    if (url) {
      Linking.openURL(url);
    }

    this.props.onPress && this.props.onPress();
  };
  render() {
    const { onPress, name, ...props } = this.props;

    if (!storeUrl()) {
      return null;
    }
    return <Icon onPress={this.onPress} name="star-o" {...props} />;
  }
}

export default Rate;
