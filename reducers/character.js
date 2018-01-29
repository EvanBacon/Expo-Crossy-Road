import { SET_CHARACTER } from '../actions/character';
import Characters from '../Characters';

const initialState = {
  id: Characters.chicken.id,
  name: Characters.chicken.name,
  index: Characters.chicken.index,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_CHARACTER:
      // console.warn(action.character);
      if (!Characters.hasOwnProperty(action.character.id)) {
        console.error(
          `Character ${
            action.character.id
          } does not exist! Check: reducers/game.js`,
        );
      }
      return { ...state, ...action.character };
    default:
      return state;
  }
}
