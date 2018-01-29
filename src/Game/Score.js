import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';

import { setHighScore } from '../../actions/game';
import RetroText from '../RetroText';

class Score extends Component {
  componentWillReceiveProps(nextProps) {
    if (nextProps.gameOver != this.props.gameOver && nextProps.gameOver) {
      this.updateHighScore(nextProps.score, nextProps.highScore);
    }
  }

  updateHighScore = (score, highScore) => {
    if (score > highScore) {
      this.props.setHighScore(score);
    }
  };

  render = () => (
    <View style={{ position: 'absolute', top: 15, left: 8 }}>
      <RetroText
        pointerEvents={'none'}
        style={{ color: 'white', fontSize: 48, backgroundColor: 'transparent' }}
      >
        {this.props.score}
      </RetroText>

      {this.props.highScore && (
        <RetroText
          pointerEvents={'none'}
          style={{
            color: 'white',
            fontSize: 14,
            letterSpacing: -0.1,
            backgroundColor: 'transparent',
          }}
        >
          TOP {this.props.highScore}
        </RetroText>
      )}
    </View>
  );
}

export default connect(
  state => ({
    highScore: state.game.highScore,
  }),
  { setHighScore },
)(Score);
