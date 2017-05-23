export const SET_GAME_STATE = 'SET_GAME_STATE';
export const SET_COIN_COUNT = 'SET_COIN_COUNT';
export const SET_HIGH_SCORE = 'SET_HIGH_SCORE';
export const setGameState = gameState => ({ type: SET_GAME_STATE, gameState });
export const setCoinCount = coins => ({ type: SET_COIN_COUNT, coins });
export const setHighScore = score => ({ type: SET_HIGH_SCORE, score });
