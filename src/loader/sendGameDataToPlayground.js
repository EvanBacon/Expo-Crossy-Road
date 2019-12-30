import Game from './Game';
import GameSave from './GameSave';

export function sendGameDataToPlayground() {
    const target = window.parent;
    const unlockedCharacters = [];
    Object.keys(Game.default ? Game.characters || {} : {}).forEach((key, idx) => {
        const character = Game.characters[key];
        if (character.locked) {
            return;
        }
        if (!GameSave.GetCharacter(idx)) {
            return;
        }
        unlockedCharacters.push(key);
    });
}

window.setInterval(() => {
    sendGameDataToPlayground();
}, 60 * 1000);