import { BlurView, Constants } from 'expo';
import React from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import { connect } from 'react-redux';

import * as Button from '../components/Button';
import Leaderboard from '../ExpoParty/components/Leaderboard';
import Item from '../ExpoParty/components/Leaderboard/Item';

class LeaderboardScreen extends React.Component {
  onCancelPress = () => {
    this.props.navigation.goBack();
  };
  render() {
    const { score } = this.props;
    return (
      <BlurView style={styles.container}>
        <StatusBar barStyle="light-content" />

        <Item
          gutter={2}
          title={'Me'}
          subtitle={score}
          itemHeight={64}
          backgroundColor={'#fff'}
        />

        <Leaderboard />

        <Button.Cancel style={styles.button} onPress={this.onCancelPress} />
      </BlurView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: Constants.statusBarHeight * 2,
    backgroundColor: 'black',
    flex: 1,
  },
  button: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    zIndex: 1,
    shadowOpacity: 0.4,
  },
});
export default connect(({ score: { best } }) => ({ score: best }))(
  LeaderboardScreen,
);
