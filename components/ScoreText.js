import React from 'react';
import { View, Text } from 'react-native';
import { useSafeArea } from 'react-native-safe-area-context';

// import { setHighScore } from '../../actions/game';

function Score({ gameOver, score, highScore, ...props }) {

  React.useEffect(() => {
    if (gameOver) {
      if (score > highScore) {
        // setHighScore(score);
      }


    }
  }, [gameOver])


  const { top, left } = useSafeArea();

  return (
    <View pointerEvents="none" style={{ position: 'absolute', top: Math.max(top, 16), left: Math.max(left, 8) }}>
      <Text
        style={{
          color: 'white',
          fontFamily: 'retro',
          fontSize: 48,
          backgroundColor: 'transparent',
        }}
      >
        {score}
      </Text>

      {highScore && (
        <Text
          style={{
            color: 'white',
            fontFamily: 'retro',
            fontSize: 14,
            letterSpacing: -0.1,
            backgroundColor: 'transparent',
          }}
        >
          TOP {highScore}
        </Text>
      )}
    </View>
  )
}

export default Score;
