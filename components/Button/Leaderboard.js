import React from 'react';

import Icon from './Icon';

class Leaderboard extends React.Component {
  onPress = () => {
    this.props.onPress && this.props.onPress();
  };
  render() {
    const { onPress, name, ...props } = this.props;
    return <Icon onPress={this.onPress} name="trophy" {...props} />;
  }
}

export default Leaderboard;
