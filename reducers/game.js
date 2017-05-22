import {
  UPDATE_GAME_STATE,
} from '../actions/game'

import State from '../state'
const initialState = {
  gameState: State.Game.none
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case UPDATE_GAME_STATE:
    if (!State.Game.hasOwnProperty(action.gameState)) {
        console.error(`State ${action.gameState} does not exist! Check: reducers/game.js`);
    }
    return {...state, gameState: action.gameState};
    default:
    return state
  }
}
