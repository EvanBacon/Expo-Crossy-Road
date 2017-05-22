import {
  SET_GAME_STATE,
  SET_CHARACTER,
  SET_COIN_COUNT,
} from '../actions/game'

import State from '../state'
import Characters from '../Characters'
const initialState = {
  gameState: State.Game.none,
  character: Characters.chicken,
  coins: 0
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_COIN_COUNT:
    return {...state, coins: action.coins};
    case SET_GAME_STATE:
    if (!State.Game.hasOwnProperty(action.gameState)) {
        console.error(`State ${action.gameState} does not exist! Check: reducers/game.js`);
    }
    return {...state, gameState: action.gameState};
    case SET_CHARACTER:
    if (!Characters.hasOwnProperty(action.character.id)) {
        console.error(`Character ${action.character.id} does not exist! Check: reducers/game.js`);
    }
    return {...state, character: action.character};

    default:
    return state
  }
}
