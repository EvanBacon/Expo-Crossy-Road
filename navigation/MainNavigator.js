import { createStackNavigator } from 'react-navigation';

// import Home from '../screens/HomeScreen';
import Game from '../screens/GameScreen';
// import GameOver from '../screens/GameOverScreen';
import CharacterSelect from '../screens/CharacterSelectScreen';

export default createStackNavigator(
  {
    Game,
    //   GameOver,
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
