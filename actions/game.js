export const UPDATE_GAME_STATE = 'UPDATE_GAME_STATE'
export const SET_CHARACTER = 'SET_CHARACTER'

export const updateGameState = gameState => ({ type: UPDATE_GAME_STATE, gameState });
export const setCharacter = character => ({ type: SET_CHARACTER, character });
