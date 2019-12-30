import Game from './Game';
import GumballMachineScreen from './GumballMachineScreen';
import {sendGameDataToPlayground} from './sendGameDataToPlayground';
import Storage from './Storage';

function getCharByIndex(idx) {
    let ci = 0;
    for (const char in Game.characters) {
        if (ci == idx) {
            return char;
        } else {
            ci++;
        }
    }
    return null;
}

function GameSave() { }


GameSave.specialCharacterToUnlockId = null;
GameSave.specialCharacterToUnlockName = null;
GameSave.GetCoins = () => {
    let coins = 0;
    coins = Storage.getItem('coins');
    coins = Math.round(coins);
    if (coins == null || isNaN(coins) || coins < 0) {
        coins = 0;
    }
    return coins;
};
GameSave.ModifyCoins = delta => {
    let coins = 0;
    coins = Storage.getItem('coins');
    coins = Math.round(coins);
    if (coins == null || isNaN(coins) || coins < 0) {
        coins = 0;
    }
    coins += delta;
    Storage.setItem('coins', coins);
    return coins;
};
GameSave.SelectCharacter = char => {
    Storage.setItem('selectedChar', char);
};
GameSave.GetSelectCharacter = () => Number(Storage.getItem('selectedChar'));
GameSave.GetCurrCharacter = () => {
    let cname = 'chicken';
    const sc = GameSave.GetSelectCharacter();
    if (sc !== null && !isNaN(sc)) {
        cname = getCharByIndex(sc);
    }
    return cname;
};
GameSave.GetCharacter = char => {
    const character = Storage.getItem(char);
    if (character == "t") {
        return true;
    }
    return false;
};
GameSave.UnlockCharacter = character => {
    Game.deathsSinceLastCharacterUnlock = 0;
    Storage.setItem(character, "t");
    PokiSDK.happyTime(1.0);
    sendGameDataToPlayground();
    return true;
};
GameSave.CheckMoonRockUnlock = () => { };
GameSave.setSpecialCharacterToUnlock = (specialCharacterId, specialCharacterName) => {
    GameSave.specialCharacterToUnlockId = specialCharacterId;
    GameSave.specialCharacterToUnlockName = specialCharacterName;
    GameSave.UnlockCharacter(specialCharacterId);
};
GameSave.showUnlockedSpacialCharacterCharacter = (specialCharacterId, specialCharacterName) => {
    GameSave.specialCharacterToUnlockId = null;
    GameSave.specialCharacterToUnlockName = null;
    setTimeout(() => {
        GameSave.specialCharacterUnlocked = true;
        GameSave.SelectCharacter(specialCharacterId);
        GumballMachineScreen.showUnlockedSpecialCharacter(specialCharacterName, specialCharacterId);
    }, 500);
};
export default GameSave;