import {
  UPDATE_GAME_STATE,
  SET_CHARACTER
} from '../actions/game'

import State from '../state'
import Characters from '../Characters'
const initialState = {
  gameState: State.Game.none,
  character: Characters.chicken
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case UPDATE_GAME_STATE:
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
