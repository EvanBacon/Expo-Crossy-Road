import nav from './navigation'
import game from './game'
import character from './character'

import { combineReducers } from 'redux'

export default combineReducers({
  nav,
  game,
  character
});
