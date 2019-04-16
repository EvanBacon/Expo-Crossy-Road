import React from 'react';
import { View, Text } from 'react-native';

// import { setHighScore } from '../../actions/game';

class Score extends React.Component {
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
      <Text
        pointerEvents={'none'}
        style={{
          color: 'white',
          fontFamily: 'retro',
          fontSize: 48,
          backgroundColor: 'transparent',
        }}
      >
        {this.props.score}
      </Text>

      {this.props.highScore && (
        <Text
          pointerEvents={'none'}
          style={{
            color: 'white',
            fontFamily: 'retro',
            fontSize: 14,
            letterSpacing: -0.1,
            backgroundColor: 'transparent',
          }}
        >
          TOP {this.props.highScore}
        </Text>
      )}
    </View>
  );
}

export default Score;

// export default connect(
//   state => ({
//     highScore: state.game.highScore,
//   }),
//   { setHighScore }
// )(Score);
