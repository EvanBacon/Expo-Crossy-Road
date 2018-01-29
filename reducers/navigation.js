import {
  createNavigationContainer,
  createNavigator,
  StackNavigator,
} from 'react-navigation';

import CharacterSelect from '../src/CharacterSelect';
import GameOver from '../src/GameOver';
import Home from '../src/Home';
import Settings from '../src/Settings';
import CrossFade from '../transitioners/CrossFade';

const AppRouteConfigs = {
  Home: {
    screen: Home,
    navigationOptions: ({ navigation }) => ({
      header: null,
      gesturesEnabled: false,
    }),
  },
  CharacterSelect: {
    screen: CharacterSelect,
    navigationOptions: ({ navigation }) => ({
      header: null,
      gesturesEnabled: false,
    }),
  },
  GameOver: {
    screen: GameOver,
    navigationOptions: ({ navigation }) => ({
      header: null,
      gesturesEnabled: false,
    }),
  },
  Settings: {
    screen: Settings,
    navigationOptions: ({ navigation }) => ({
      header: null,
      gesturesEnabled: false,
    }),
  },
};

const router = StackNavigator(AppRouteConfigs, {
  cardStyle: { backgroundColor: 'transparent' },
  headerMode: 'none',
});

const navigator = createNavigator(router)(CrossFade);
const NavigationContainer = createNavigationContainer(navigator);

export class AppNavigator {
  static getNavigator() {
    return NavigationContainer;
  }
}

// const NavigationContainer = createNavigationContainer(createNavigator(Navigator)(CrossFade));
// export const AppNavigator = Navigator;

console.log(navigator);

const initialState = router.router.getStateForAction(
  router.router.getActionForPathAndParams('Home'),
); //Home

export default (state = initialState, action) => {
  const nextState = router.router.getStateForAction(action, state);

  // Simply return the original `state` if `nextState` is null or undefined.
  return nextState || state;
};
