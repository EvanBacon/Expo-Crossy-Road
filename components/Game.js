import { GameView } from 'expo-exotic';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import Machine from '../Game';
import Footer from './Footer';
import Polaroid from './Polaroid';
import ScoreMeta from './ScoreMeta';
import Title from './Title';

class Game extends React.Component {
  componentWillMount() {
    this.game = new Machine();
  }
  componentWillUnmount() {
    this.game = null;
  }

  onLeaderboardPress = () => {
    this.props.navigation.navigate('Leaderboard');
  };

  render() {
    const { onContextCreate, ...game } = this.game;

    return (
      <View style={styles.container} pointerEvents="box-none">
        <GameView
          {...game}
          onContextCreate={async props => {
            await onContextCreate(props);
            this.props.onLoad();
          }}
        />
        <ScoreMeta />
        <Title />
        <Footer onLeaderboardPress={this.onLeaderboardPress} />

        <Polaroid />
      </View>
    );
  }
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
