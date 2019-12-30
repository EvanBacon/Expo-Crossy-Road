import Game from './Game'
import * as ObjectPooler from './ObjectPooler'
import * THREE from 'three';

const CharacterTryouts = {};

CharacterTryouts.isTryingOut = null;
CharacterTryouts.roundsLeft = 0;
CharacterTryouts.roundsSinceTryout = Infinity;

CharacterTryouts.startTryout = function (characterName, amountOfRounds, isAppPromo) {
    this.roundsSinceTryout = 0;
    this.roundsLeft = amountOfRounds;
    this.isTryingOut = characterName;
    this.characterPreTryouts = Game.playerController.currentCharacterName;
    this.isAppPromo = isAppPromo || false;
};
CharacterTryouts.roundEnded = function () {
    if (this.isTryingOut === null) {
        this.roundsSinceTryout++;
    }
    this.roundsLeft--;
    if (this.roundsLeft <= 0) {
        this.isTryingOut = null;
    }
};
CharacterTryouts.resetTryout = function () {
    this.roundsLeft = 0;
    this.isTryingOut = null;
    this.isAppPromo = false;
};
CharacterTryouts.setCharacterIfTryingOut = function () {
    let changeCharacterTo;
    if (!this.isTryingOut) {
        if (this.characterPreTryouts && Game.playerController.currentCharacterName !== this.characterPreTryouts) {
            changeCharacterTo = this.characterPreTryouts;
            this.characterPreTryouts = null;
        } else {
            return;
        }
    } else if (this.isTryingOut === Game.playerController.currentCharacterName) {
        return;
    } else {
        changeCharacterTo = this.isTryingOut;
    }
    const characterIndex = Object.keys(characters).indexOf(changeCharacterTo);
    const character = characters[changeCharacterTo];
    const characterModel = ObjectPooler.importMesh(`Carousel.characters[${Game.currentWorld}][${characterIndex}`, character.mesh, false, true);
    Game.scene.add(characterModel);
    Game.playerController.setCharacter(characterModel, changeCharacterTo);
};
export default CharacterTryouts;