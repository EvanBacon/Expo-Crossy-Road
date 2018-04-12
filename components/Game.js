import ExpoGraphics from 'expo-graphics';
import React from 'react';
import { StyleSheet, Platform, View } from 'react-native';

import Machine from '../Game';
import Footer from './Footer';
import ScoreMeta from './ScoreMeta';
import Polaroid from './Polaroid';
import Title from './Title';
import { dispatch } from '@rematch/core';

class Game extends React.Component {
  componentWillMount() {
    this.machine = new Machine();
  }
  componentWillUnmount() {
    this.machine = null;
  }

  onContextCreate = async context => {
    await this.machine.onContextCreateAsync(context);

    this.props.onLoad();
  };

  onLeaderboardPress = () => {
    this.props.navigation.navigate('Leaderboard');
  };
  render() {
    return (
      <View style={styles.container} pointerEvents="box-none">
        <ExpoGraphics.View
          ref={ref => (global.gameRef = this.ref = ref)}
          key="game"
          onContextCreate={this.onContextCreate}
          onRender={this.machine.onRender}
          onResize={this.machine.onResize}
          onShouldReloadContext={this.onShouldReloadContext}
        />
        <ScoreMeta />
        <Title />
        <Footer onLeaderboardPress={this.onLeaderboardPress} />

        <Polaroid />
      </View>
    );
  }
  onShouldReloadContext = () => {
    /// The Android OS loses gl context on background, so we should reload it.
    return Platform.OS === 'android';
  };
}

export default Game;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  touchable: {
    flex: 1,
  },
});
