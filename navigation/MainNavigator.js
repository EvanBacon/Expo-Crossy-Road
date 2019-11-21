import { createStackNavigator } from 'react-navigation-stack';

// import Home from '../screens/HomeScreen';
import Game from '../screens/GameScreen';
import GameOver from '../screens/GameOverScreen';
import CharacterSelect from '../screens/CharacterSelectScreen';
import Settings from '../screens/SettingsScreen';

export default createStackNavigator(
  {
    Game,
    Settings,
    GameOver,
    CharacterSelect,
  },
  {
    cardStyle: {
      backgroundColor: 'transparent',
    },
    defaultNavigationOptions: {
      header: null,
    },
  },
);
