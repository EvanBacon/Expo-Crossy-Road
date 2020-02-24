import React from 'react';
import { StyleSheet, Text,Platform, View } from 'react-native';
import { useSafeArea } from 'react-native-safe-area-context';
import GameContext from '../context/GameContext';


function generateTextShadow(width) {
  return  Platform.select({ web: {
    textShadow: `-${width}px 0px 0px #000, ${width}px 0px 0px #000, 0px -${width}px 0px #000, 0px ${width}px 0px #000`
  }, default: {} });
} 
const textShadow = generateTextShadow(4)
const textShadowHighscore = generateTextShadow(2)
export default function Score({ gameOver, score, ...props }) {
  const { highscore = 0, setHighscore } = React.useContext(GameContext)

  React.useEffect(() => {
    if (gameOver) {
      if (score > highscore) {
        setHighscore(score);
      }
    }
  }, [gameOver])


  const { top, left } = useSafeArea();

  return (
    <View pointerEvents="none" style={[styles.container, { top: Math.max(top, 16), left: Math.max(left, 8) }]}>
      <Text style={[styles.score, textShadow]}>{score}</Text>
      {highscore > 0 && (<Text style={[styles.highscore, textShadowHighscore]}>TOP {highscore}</Text>)}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
  },
  
  score: {
    color: 'white',
    fontFamily: 'retro',
    fontSize: 48,
    backgroundColor: 'transparent',
  },
  highscore: {
    color: 'yellow',
    fontFamily: 'retro',
    fontSize: 14,
    marginTop: 4,
    letterSpacing: -0.1,
    backgroundColor: 'transparent',
  }
})