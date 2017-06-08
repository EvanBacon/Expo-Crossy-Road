import {
  SET_CHARACTER,
} from '../actions/character'

import Characters from '../Characters'
const initialState = {
  id: Characters.nikki.id,
  name: Characters.nikki.name,
  index: Characters.nikki.index,
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_CHARACTER:
    // console.warn(action.character);
    if (!Characters.hasOwnProperty(action.character.id)) {
        console.error(`Character ${action.character.id} does not exist! Check: reducers/game.js`);
    }
    return {...state, ...action.character};
    default:
    return state
  }
}
