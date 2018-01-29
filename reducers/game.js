import {
  SET_COIN_COUNT,
  SET_GAME_STATE,
  SET_HIGH_SCORE,
} from '../actions/game';
import State from '../state';

const initialState = {
  gameState: State.Game.none,
  coins: 0,
  highScore: null,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_HIGH_SCORE:
      return { ...state, highScore: action.score };
    case SET_COIN_COUNT:
      return { ...state, coins: action.coins };
    case SET_GAME_STATE:
      if (!State.Game.hasOwnProperty(action.gameState)) {
        console.error(
          `State ${action.gameState} does not exist! Check: reducers/game.js`,
        );
      }
      return { ...state, gameState: action.gameState };
    default:
      return state;
  }
}
