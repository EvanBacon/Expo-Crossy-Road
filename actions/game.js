export const SET_GAME_STATE = 'SET_GAME_STATE'
export const SET_CHARACTER = 'SET_CHARACTER'
export const SET_COIN_COUNT = 'SET_COIN_COUNT'
export const setGameState = gameState => ({ type: SET_GAME_STATE, gameState });
export const setCharacter = character => ({ type: SET_CHARACTER, character });
export const setCoinCount = coins => ({ type: SET_COIN_COUNT, coins });
