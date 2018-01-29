import { combineReducers } from 'redux';

import character from './character';
import game from './game';
import nav from './navigation';

export default combineReducers({
  nav,
  game,
  character,
});
