import GameScreen from '../screens/GameScreen';
import CharacterSelectScreen from '../screens/CharacterSelectScreen';
import GameOverScreen from '../screens/GameOverScreen';
import SettingsScreen from '../screens/SettingsScreen';
import LeaderboardScreen from '../screens/LeaderboardScreen';
import CrossFade from '../transitioners/CrossFade';

import {
  createNavigationContainer,
  createNavigator,
  StackNavigator,
} from 'react-navigation';

const ModalStack = StackNavigator(
  {
    Game: {
      screen: GameScreen,
    },
    Leaderboard: {
      screen: LeaderboardScreen,
    },
    CharacterSelect: {
      screen: CharacterSelectScreen,
    },
    GameOver: {
      screen: GameOverScreen,
    },
    Settings: {
      screen: SettingsScreen,
    },
  },
  {
    mode: 'modal',
    headerMode: 'none',
    gesturesEnabled: false,
    cardStyle: {
      backgroundColor: 'transparent',
    },
  },
);

export default createNavigator(ModalStack)(CrossFade);
