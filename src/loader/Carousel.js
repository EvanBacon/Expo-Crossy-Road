import * as AssetLoader from './AssetLoader';
import * THREE from 'three';

import ThreeUI from './ThreeUI'
import AppStoreInterstitial from './AppStoreInterstitial'
import CharacterTryouts from './CharacterTryouts'
import Game from './Game'
import GameSave from './GameSave'
import Interface from './Interface'
import KeyboardHint from './KeyboardHint'
import KeyboardUIControls from './KeyboardUIControls'
import Localisation from './Localisation'
import Storage from './Storage'
import Utils from './Utils'
import GumballMachineScreen from './GumballMachineScreen'
import LoadingBar from './LoadingBar'
import * as ObjectPooler from './ObjectPooler';

class Carousel {
    static init() {
        if (!window.isMobile && !window.mouseDisabled) {
            document.body.addEventListener('click', this.processClick.bind(this));
            this.raycaster = new THREE.Raycaster();
        }
        if (!Carousel.isLoaded) {
            Carousel.characterModels = [];
            let numModelsAdded = 0;
            for (let idx = 0; idx < Object.keys(Carousel.characters).length; ++idx) {
                for (let itr = 0; itr < Carousel.characters[Object.keys(Carousel.characters)[idx]].length; itr++) {
                    const character = ObjectPooler.importMesh(`Carousel.characters[${Object.keys(Carousel.characters)[idx]}][${itr}`, Carousel.characters[Object.keys(Carousel.characters)[idx]][itr]);
                    Carousel.characterModels[numModelsAdded] = character;
                    Carousel.characterModels[numModelsAdded].world = Carousel.characters[Object.keys(Carousel.characters)[idx]][itr].world;
                    Carousel.characterModels[numModelsAdded].name = Carousel.characters[Object.keys(Carousel.characters)[idx]][itr].charName;
                    if (Carousel.characters[Object.keys(Carousel.characters)[idx]][itr].special) {
                        Carousel.characterModels[numModelsAdded].material.uniforms.GREY_COLOR.value = new THREE.Vector3(0.0, 0.0, 0.0);
                    }
                    numModelsAdded++;
                }
            }
        }
        Carousel.loadingBar = new LoadingBar();
        Carousel.loadingBar.chickenSrc = AssetLoader.getAssetById('sprites/chicken.png').src;
        AssetLoader.progressListeners.push(Carousel.loadingBar.setProgress.bind(Carousel.loadingBar));
    }

    static GetRandomCharacterCandidates() {
        const newCandidates = [];
        const duplicateCandidates = [];
        Object.keys(Game.characters).forEach((key, idx) => {
            const character = Game.characters[key];
            if (character.special) {
                return;
            }
            if (!character.world) {
                return;
            }
            if (!character.mesh) {
                return;
            }
            if (character.locked) {
                return;
            }
            if (idx === 0) {
                return;
            }
            if (idx === 5) {
                return;
            }
            if (!GameSave.GetCharacter(idx)) {
                newCandidates.push({
                    char: character,
                    idx,
                    hasCharacter: false
                });
            } else {
                duplicateCandidates.push({
                    char: character,
                    idx,
                    hasCharacter: true
                });
            }
        });
        if (!this.duplicatesEnabled) {
            return newCandidates;
        }
        if (duplicateCandidates.length === 0) {
            return newCandidates;
        }
        const hasBeenGivenForcedDuplicate = Storage.getItem('hasbeengivenduplicate');
        if (duplicateCandidates.length === 1 && !hasBeenGivenForcedDuplicate) {
            return duplicateCandidates;
        } else {
            return newCandidates;
        }
        const chanceForNew = 1 / (Object.keys(Game.characters).length - newCandidates.length - 1) * 1.5;
        if (Math.random() <= chanceForNew) {
            return newCandidates;
        } else {
            return duplicateCandidates;
        }
    }

    static Show() {
        Game.ambientLight.color = new THREE.Color(0.5, 0.5, 0.7);
        for (var i = 0; i < Carousel.characterModels.length; ++i) {
            Game.scene.remove(Carousel.characterModels[i]);
        }
        Carousel.initialWorld = Game.currentWorld;
        Carousel.worldSelected = Game.currentWorld;
        Game.audioManager.stopAllSounds();
        Interface.CurrentScreen = "selectingCharacter";
        Interface.hintContainer.visible = false;
        Interface.hideLogo(true);
        const length = Carousel.characterModels.length;
        for (var i = 0; i < length; i++) {
            Carousel.characterModels[i].rotation.y = startRotation;
        }
        Game.camera.position.set(0.0, 105.25858, 10.41098);
        Game.camera.rotation.set(-Math.PI / 8, 0, 0, 'YXZ');
        Storage.setItem("hasSeenCarousel", "true");
        Game.LoadCarousel();
        if (!Carousel.isLoaded) {
            Carousel.isLoaded = true;
            Carousel.prepareModels();
            let world_idx;
            for (var i = 0; i < Object.keys(Game.worlds).length; ++i) {
                const banner = Game.UI.createSpriteFromSheet(Game.worlds[Object.keys(Game.worlds)[i]].banner, 'sprites/interface.png', 'sprites/interface.json');
                banner.pivot = {
                    x: 0.5,
                    y: 0
                };
                banner.x = i * 256;
                banner.y = 10;
                banner.visible = true;
                banner.alpha = 1;
                banner.rotation = 0;
                banner.anchor.x = ThreeUI.anchors.center;
                banner.anchor.y = ThreeUI.anchors.top;
                banner.world = Object.keys(Game.worlds)[i];
                let bannerText = Game.UI.createText(`${Game.worlds[Object.keys(Game.worlds)[i]].numCharactersUnlocked}/${Game.worlds[Object.keys(Game.worlds)[i]].numCharacters}`, 20, 'EditUndoBrk', '#ffffff');
                bannerText.parent = banner;
                bannerText.anchor.x = ThreeUI.anchors.right;
                bannerText.anchor.y = ThreeUI.anchors.bottom;
                bannerText.textAlign = 'right';
                bannerText.x += 5;
                bannerText.y += 5;
                if (bannerText === '0/0') {
                    bannerText = '';
                }
                banner.text = bannerText;
                Carousel.banners.push(banner);
                world_idx = Object.keys(Game.worlds)[i];
                banner.onClick(function () {
                    Carousel.inputFocus = 'worlds';
                    Carousel.Navigate(Carousel.banners.indexOf(this) - Carousel.bannerFocus);
                    if (Carousel.worldSelected !== 'piffle') {
                        Carousel.inputFocus = 'characters';
                    }
                    TWEEN.remove(Carousel.banners[Carousel.bannerFocus].tween);
                }.bind(banner));
            }
        }
        Carousel.text = Game.UI.createText(Carousel.characters[Carousel.worldSelected][Carousel.focus].fullName.toUpperCase(), 48, 'EditUndoBrk', '#ffffff');
        Carousel.text.y = 200;
        Carousel.text.anchor.x = ThreeUI.anchors.center;
        Carousel.text.anchor.y = ThreeUI.anchors.top;
        Carousel.text.textAlign = 'center';
        Carousel.select = Game.UI.createSpriteFromSheet('play-wide.png', 'sprites/interface.png', 'sprites/interface.json');
        Carousel.select.x = 0;
        Carousel.select.y = 10;
        Carousel.select.rotation = 0;
        Carousel.select.alpha = 1;
        Carousel.select.pivot.x = 0.5;
        Carousel.select.pivot.y = 1;
        Carousel.select.anchor.x = ThreeUI.anchors.center;
        Carousel.select.anchor.y = ThreeUI.anchors.bottom;
        Carousel.select.onClick(Carousel.SelectCharacter);
        Carousel.select.defaultSprite = Carousel.select.assetPath;
        Carousel.select.blinkSprite = 'play-wide-blink.png';
        Carousel.select.width = 158;
        Carousel.select.height = 84;
        Carousel.showUpsell = Game.UI.createSpriteFromSheet('button-info.png', 'sprites/interface.png', 'sprites/interface.json');
        Carousel.showUpsell.x = 0;
        Carousel.showUpsell.y = 10;
        Carousel.showUpsell.visible = false;
        Carousel.showUpsell.rotation = 0;
        Carousel.showUpsell.alpha = 1;
        Carousel.showUpsell.pivot.x = 0.5;
        Carousel.showUpsell.pivot.y = 1;
        Carousel.showUpsell.anchor.x = ThreeUI.anchors.center;
        Carousel.showUpsell.anchor.y = ThreeUI.anchors.bottom;
        Carousel.showUpsell.onClick(Carousel.btnShowUpsellCallback);
        Carousel.showUpsell.defaultSprite = Carousel.showUpsell.assetPath;
        Carousel.showUpsell.blinkSprite = 'button-info-blink.png';
        Carousel.showUpsell.width = 158;
        Carousel.showUpsell.height = 84;
        Carousel.attention = Game.UI.createSpriteFromSheet('attention.png', 'sprites/interface.png', 'sprites/interface.json');
        Carousel.attention.parent = Carousel.showUpsell;
        Carousel.attention.anchor.x = ThreeUI.anchors.right;
        Carousel.attention.anchor.y = ThreeUI.anchors.top;
        Carousel.attention.x = 10;
        Carousel.attention.y = -5;
        const notInMachineText = Game.UI.createText(Localisation.GetString("not-available-as-prize"), 24, 'EditUndoBrk', '#ffffff');
        notInMachineText.parent = Carousel.showUpsell;
        notInMachineText.y = -65;
        notInMachineText.anchor.x = ThreeUI.anchors.center;
        notInMachineText.anchor.y = ThreeUI.anchors.top;
        notInMachineText.textAlign = 'center';
        notInMachineText.lineHeight = 1.2;
        Carousel.backButton = Game.UI.createSpriteFromSheet('smallBack.png', 'sprites/interface.png', 'sprites/interface.json');
        Carousel.backButton.width = 16 * 4;
        Carousel.backButton.height = 16 * 4;
        Carousel.backButton.x = 10;
        Carousel.backButton.y = 10;
        Carousel.backButton.pivot = {
            x: 0,
            y: 0
        };
        Carousel.backButton.onClick(() => {
            AssetLoader.lastRequestedWorld = Carousel.initialWorld;
            Game.SetWorld(Carousel.initialWorld);
            Carousel.close();
        });
        Carousel.backButton.defaultSprite = Carousel.backButton.assetPath;
        Carousel.backButton.blinkSprite = 'smallBack-blink.png';
        if (!GameSave.GetCharacter(0)) {
            GameSave.UnlockCharacter(0);
        }
        if (!GameSave.GetCharacter(5)) {
            GameSave.UnlockCharacter(5);
        }
        Carousel.select.navigateOnTop = () => {
            if (Carousel.inputFocus != 'worlds') {
                Carousel.inputFocus = 'worlds';
                Game.UI.MoveToFront(Carousel.banners[Carousel.bannerFocus]);
                Game.UI.MoveToFront(Carousel.banners[Carousel.bannerFocus].text);
                TWEEN.remove(Carousel.banners[Carousel.bannerFocus].tween);
                Carousel.banners[Carousel.bannerFocus].tween = new TWEEN.Tween(Carousel.banners[Carousel.bannerFocus]).to({
                    width: 300,
                    height: 153
                }, 500).easing(TWEEN.Easing.Quartic.Out).repeat(Infinity).yoyo(true).start();
                Game.UI.MoveToFront(Interface.coinText);
                Game.UI.MoveToFront(Interface.coinIcon);
            }
        };
        Carousel.select.navigateOnBottom = () => {
            if (Carousel.inputFocus != 'characters' && Carousel.characters[Carousel.worldSelected] !== undefined) {
                KeyboardUIControls.setFocus(Carousel.select);
                Carousel.inputFocus = 'characters';
                for (let i = 0; i < Carousel.banners.length; ++i) {
                    TWEEN.remove(Carousel.banners[i].tween);
                    Carousel.banners[i].tween = new TWEEN.Tween(Carousel.banners[i]).to({
                        width: 256,
                        height: 121
                    }, 100).easing(TWEEN.Easing.Quartic.Out).start();
                }
                Game.UI.MoveToFront(Interface.coinText);
                Game.UI.MoveToFront(Interface.coinIcon);
            }
        };
        Carousel.backButton.navigateOnBottom = () => {
            this.showBottomNavigationKeyboardHint();
            if (Carousel.select._visible) {
                return Carousel.select;
            } else if (Carousel.showUpsell._visible) {
                return Carousel.showUpsell;
            }
        };
        if (CharacterTryouts.isTryingOut) {
            Carousel.focus = Object.keys(Game.characters).indexOf(CharacterTryouts.isTryingOut);
        } else {
            Carousel.focus = GameSave.GetSelectCharacter();
        }
        if (Carousel.focus === null) {
            Carousel.focus = 0;
        }
        Carousel.text.text = Game.characters[Object.keys(Game.characters)[Carousel.focus]].mesh.fullName.toUpperCase();
        Carousel.select.visible = true;
        Carousel.backButton.visible = true;
        Carousel.text.visible = true;
        Interface.coinText.visible = true;
        Interface.coinIcon.visible = true;
        Game.refreshUnlockedCharactersNumber();
        Carousel.banners.forEach(banner => {
            banner.visible = true;
            banner.text.text = `${Game.worlds[banner.world].numCharactersUnlocked}/${Game.worlds[banner.world].numCharacters}`;
        });
        Carousel.ButtonScaleSet();
        Game.camera.position.x = 0;
        if (Localisation.userLang !== 'en') {
            Carousel.text.size = 32;
        }
        KeyboardUIControls.setFocus(Carousel.select);
        Game.UI.MoveToFront(KeyboardUIControls.reticle);
        Game.UI.MoveToFront(Carousel.attention);
        Game.UI.MoveToFront(Interface.coinText);
        Game.UI.MoveToFront(Interface.coinIcon);
        KeyboardHint.show('char-select');
        this.showBottomNavigationKeyboardHint();
        Carousel.refreshCharacters(Carousel.worldSelected);
        for (var i = 0; i < Carousel.banners.length; ++i) {
            if (Carousel.banners[i].world === Carousel.worldSelected) {
                Carousel.inputFocus = 'worlds';
                Carousel.Navigate(i - Carousel.bannerFocus, false);
                Carousel.inputFocus = 'characters';
                KeyboardUIControls.setFocus(Carousel.select);
                break;
            }
        }
    }

    static showBottomNavigationKeyboardHint() {
        if (Carousel.banners[Carousel.bannerFocus].world === 'piffle') {
            return;
        }
        if (this.focus === 0) {
            KeyboardHint.switch('char-select-left-edge');
        } else if (this.focus === Carousel.characters[Carousel.worldSelected].length - 1) {
            KeyboardHint.switch('char-select-right-edge');
        } else {
            KeyboardHint.switch('char-select');
        }
    }

    static roundEnded() {
        if (this.roundsSinceBuyingCharacter !== null) {
            this.roundsSinceBuyingCharacter++;
        }
    }

    static processClick({ clientX, clientY }) {
        if (Interface.CurrentScreen !== 'selectingCharacter') {
            return;
        }
        const bounds = Game.containerRect;
        const mouse = new THREE.Vector2();
        mouse.x = (clientX - bounds.left) / bounds.width * 2 - 1;
        mouse.y = -((clientY - bounds.top) / bounds.height) * 2 + 1;
        this.raycaster.setFromCamera(mouse, Game.camera);
        const intersects = this.raycaster.intersectObjects(Game.scene.children);
        let foundMesh = null;
        intersects.forEach(({ object }) => {
            if (foundMesh) {
                return;
            }
            let idx = 0;
            Carousel.characterModels.forEach(model => {
                if (foundMesh) {
                    return;
                }
                if (model === object) {
                    foundMesh = idx;
                } else {
                    if (model.world === Carousel.worldSelected) {
                        idx++;
                    }
                }
            });
        });
        if (foundMesh === null) {
            return;
        }
        const navigate = foundMesh - this.focus;
        if (navigate !== 0) {
            this.Navigate(navigate);
        }
    }

    static Navigate(dx) {
        const animate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
        if (Carousel.inputFocus === 'worlds') {
            KeyboardUIControls.setFocus(Carousel.select);
            const t = Carousel.bannerFocus;
            Carousel.bannerFocus = Math.min(Object.keys(Game.worlds).length - 1, Math.max(0, Carousel.bannerFocus + dx));
            if (t !== Carousel.bannerFocus) {
                TWEEN.remove(Carousel.banners[Carousel.bannerFocus].tween);
                if (animate) {
                    Carousel.banners[Carousel.bannerFocus].tween = new TWEEN.Tween(Carousel.banners[Carousel.bannerFocus]).to({
                        width: 300,
                        height: 153
                    }, 500).easing(TWEEN.Easing.Quartic.Out).repeat(Infinity).yoyo(true).start();
                } else {
                    Carousel.inputFocus = 'characters';
                }
                TWEEN.remove(Carousel.banners[t].tween);
                Carousel.banners[t].tween = new TWEEN.Tween(Carousel.banners[t]).to({
                    width: 256,
                    height: 121
                }, 100).easing(TWEEN.Easing.Quartic.Out).start();
                Game.UI.MoveToFront(Carousel.banners[Carousel.bannerFocus]);
                Game.UI.MoveToFront(Carousel.banners[Carousel.bannerFocus].text);
                TWEEN.remove(Carousel.banners[Carousel.bannerFocus].movementTween);
                Carousel.banners[Carousel.bannerFocus].movementTween = new TWEEN.Tween(Carousel.banners[Carousel.bannerFocus]).to({
                    x: 0
                }, 200).easing(TWEEN.Easing.Quartic.Out).start();
                for (let i = 0; i < Carousel.banners.length; ++i) {
                    TWEEN.remove(Carousel.banners[i].movementTween);
                    Carousel.banners[i].movementTween = new TWEEN.Tween(Carousel.banners[i]).to({
                        x: 250 * (i - Carousel.bannerFocus)
                    }, 500).easing(TWEEN.Easing.Quartic.Out).start();
                }
                Game.UI.MoveToFront(Interface.coinText);
                Game.UI.MoveToFront(Interface.coinIcon);
                Game.UI.MoveToFront(Carousel.backButton);
                Carousel.refreshCharacters(Carousel.banners[Carousel.bannerFocus].world);
            }
            return;
        }
        Carousel.focus = Math.min(Carousel.characters[Carousel.worldSelected].length - 1, Math.max(0, Carousel.focus + dx));
        Carousel.text.text = Carousel.characters[Carousel.worldSelected][Carousel.focus].fullName.toUpperCase();
        if (!GameSave.GetCharacter(Carousel.focus)) {
            Carousel.text.color = '#dddddd';
        } else {
            Carousel.text.color = '#ffffff';
        }
        Carousel.CheckAvailability();
        TweenCarouselCam(Carousel.focus);
        AppStoreInterstitial.hide(false);
        this.showBottomNavigationKeyboardHint();
    }
}


Carousel.characters = {};
Carousel.characterModels = [];
Carousel.focus = 0;
Carousel.banners = [];
Carousel.bannerFocus = 0;
Carousel.inputFocus = 'characters';
Carousel.initialWorld;
Carousel.loadingBar = null;
const startRotation = 0.9;
Carousel.duplicatesEnabled = false;
Carousel.prepareCharacters = () => {
    Carousel.characters = [];
    for (const char in Game.characters) {
        if (Game.characters.hasOwnProperty(char)) {
            if (Carousel.characters[Game.characters[char].world] === undefined) {
                Carousel.characters[Game.characters[char].world] = [];
            }
            if (!Game.characters[char].mesh) {
                continue;
            }
            Carousel.characters[Game.characters[char].world].push(Game.characters[char].mesh);
            Game.characters[char].mesh.charName = char;
            Game.characters[char].mesh.fullName = Localisation.GetString(char);
            Game.characters[char].mesh.world = Game.characters[char].world;
            Game.characters[char].mesh.special = Game.characters[char].special;
        }
    }
};
Carousel.hasEnoughCoinsForCharacter = () => GameSave.GetCoins() >= Carousel.charactCost;
Carousel.HowManyUnlocked = () => {
    const unlocked = {
        number: 0,
        all: true
    };
    let index = 0;
    Object.keys(Game.characters).forEach(key => {
        if (Game.characters[key].world) {
            const data = Game.characters[key];
            if (key === 'chicken' || GameSave.GetCharacter(index)) {
                unlocked.number++;
            } else if (!data.locked && !data.special) {
                unlocked.all = false;
            }
            index++;
        }
    });
    return unlocked;
};
Carousel.UnlockRandomCharacter = () => {
    const candidates = Carousel.GetRandomCharacterCandidates();
    const toUnlock = Utils.getRandomFromArray(candidates);
    GameSave.ModifyCoins(-Carousel.charactCost);
    GameSave.UnlockCharacter(toUnlock.idx);
    Carousel.roundsSinceBuyingCharacter = 0;
    return toUnlock;
};
Carousel.refreshCharacters = world => {
    for (var i = 0; i < Carousel.characterModels.length; ++i) {
        Game.scene.remove(Carousel.characterModels[i]);
    }
    if (world !== undefined) {
        Carousel.worldSelected = world;
    }
    if (AssetLoader.areCharactersLoaded(Carousel.worldSelected)) {
        if (Carousel.characters[world] !== undefined) {
            var i = 0;
            for (let itr = 0; itr < Carousel.characterModels.length; itr++) {
                if (Carousel.characterModels[itr].world === Carousel.worldSelected) {
                    Carousel.characterModels[itr].position.set(0 + i * 2, 99, -2);
                    if (Carousel.characterModels[itr].name === 'space_chicken' && Carousel.characterModels[itr].children.length === 0) {
                        const glass = ObjectPooler.importMesh('Carousel.characters[undefined][1', Carousel.characters[undefined][1]);
                        glass.scale.set(1.01, 1.01, 1.01);
                        glass.material.transparent = true;
                        glass.material.uniforms.transparency.value = 0.7;
                        glass.material.uniforms.saturation.value = 1.0;
                        Carousel.characterModels[itr].add(glass);
                    }
                    Game.scene.add(Carousel.characterModels[itr]);
                    i++;
                }
            }
            Carousel.focus = 0;
            Carousel.text.text = Carousel.characters[Carousel.worldSelected][Carousel.focus].fullName.toUpperCase();
            if (!GameSave.GetCharacter(Carousel.focus)) {
                Carousel.text.color = '#dddddd';
            } else {
                Carousel.text.color = '#ffffff';
            }
            AppStoreInterstitial.hide();
        } else {
            AppStoreInterstitial.show(true);
        }
    } else {
        if (Carousel.worldSelected !== 'piffle') {
            Carousel.loadingBar.show();
            Carousel.select.visible = false;
            AssetLoader.loadCharacters(Carousel.worldSelected, () => {
                Game.initCharacters();
                Carousel.prepareCharacters();
                Carousel.prepareModels();
                GumballMachineScreen.prepareCharacterModels();
                Carousel.refreshCharacters(Carousel.currentWorld);
                Carousel.select.visible = true;
            });
            Carousel.loadingBar.enteredFinalLoadingPhase();
        } else {
            AppStoreInterstitial.show(true);
        }
    }
    Game.camera.position.set(0.0, 105.25858, 10.41098);
    Game.camera.rotation.set(-Math.PI / 8, 0, 0, 'YXZ');
};
Carousel.prepareModels = () => {
    Carousel.characterModels = [];
    let numModelsAdded = 0;
    for (let idx = 0; idx < Object.keys(Carousel.characters).length; ++idx) {
        for (var itr = 0; itr < Carousel.characters[Object.keys(Carousel.characters)[idx]].length; itr++) {
            const character = ObjectPooler.importMesh(`Carousel.characters[${Object.keys(Carousel.characters)[idx]}][${itr}`, Carousel.characters[Object.keys(Carousel.characters)[idx]][itr]);
            Carousel.characterModels[numModelsAdded] = character;
            Carousel.characterModels[numModelsAdded].world = Carousel.characters[Object.keys(Carousel.characters)[idx]][itr].world;
            Carousel.characterModels[numModelsAdded].name = Carousel.characters[Object.keys(Carousel.characters)[idx]][itr].charName;
            if (Carousel.characters[Object.keys(Carousel.characters)[idx]][itr].special) {
                Carousel.characterModels[numModelsAdded].material.uniforms.GREY_COLOR.value = new THREE.Vector3(0.0, 0.0, 0.0);
            }
            numModelsAdded++;
        }
    }
    for (var itr = 0; itr < Carousel.characterModels.length; itr++) {
        if (!GameSave.GetCharacter(itr)) {
            Carousel.characterModels[itr].material.uniforms.saturation.value = 0;
        }
    }
};
Carousel.calcButtonsWidth = () => Carousel.btnLeft.width + Carousel.btnLeft.x * 2 + Carousel.select.width + Carousel.btnRight.x * 2;
const carouselBtnScale = 1.0;
Carousel.ButtonScaleSet = () => {
    if (!Carousel.btnLeft) {
        return;
    }
    let newScale = 1;
    do {
        Carousel.btnLeft.width = 84 * newScale;
        Carousel.btnLeft.height = 84 * newScale;
        Carousel.btnRight.width = 84 * newScale;
        Carousel.btnRight.height = 84 * newScale;
        Carousel.select.width = 158 * newScale;
        Carousel.select.height = 84 * newScale;
        Carousel.showUpsell.width = 158 * newScale;
        Carousel.showUpsell.height = 84 * newScale;
        newScale -= 0.05;
    } while (Carousel.calcButtonsWidth() > Game.UI.width);
};
Carousel.close = () => {
    for (let i = 0; i < Carousel.characterModels.length; ++i) {
        Game.scene.remove(Carousel.characterModels[i]);
    }
    Interface.ButtonSound();
    Interface.showMain();
    AppStoreInterstitial.hide();
    if (Carousel.select && Carousel.backButton && Carousel.banners && Carousel.text && Carousel.showUpsell) {
        Carousel.select.visible = false;
        Carousel.backButton.visible = false;
        Carousel.banners.forEach(banner => {
            banner.visible = false;
        });
        Carousel.text.visible = false;
        Carousel.showUpsell.visible = false;
    }
    Game.configureCameras();
    Interface.CurrentScreen = 'main';
    Game.playerController.player.material.uniforms.saturation.value = 1;
};
Carousel.SelectCharacter = () => {
    if (AppStoreInterstitial.isVisible()) {
        return;
    }
    const characterIsTryout = Carousel.characters[Carousel.worldSelected][Carousel.focus].charName === CharacterTryouts.isTryingOut;
    const charIdx = Object.keys(Game.characters).indexOf(Carousel.characters[Carousel.worldSelected][Carousel.focus].charName);
    if (!GameSave.GetCharacter(charIdx) && charIdx != 0 && !characterIsTryout) {
        return false;
    }
    Interface.showInterstitial(() => {
        AssetLoader.lastRequestedWorld = Carousel.worldSelected;
        Game.SetWorld(Carousel.worldSelected);
        Game.wipeAndRestart();
        let character;
        if (Carousel.characters[Carousel.worldSelected][Carousel.focus].charName === "space_chicken_carousel") {
            character = ObjectPooler.importMesh('Carousel.characters[undefined][0', Carousel.characters[undefined][0], false, true);
        } else {
            character = ObjectPooler.importMesh(`Carousel.characters[${Carousel.worldSelected}][${Carousel.focus}`, Carousel.characters[Carousel.worldSelected][Carousel.focus], false, true);
        }
        character.castShadow = true;
        character.position.set(0, 0, 2);
        Game.playerController.setCharacter(character, Carousel.characters[Carousel.worldSelected][Carousel.focus].charName);
        Game.playerController.Reset();
        Game.takesUserInput = true;
        if (!characterIsTryout) {
            CharacterTryouts.resetTryout();
            GameSave.SelectCharacter(charIdx);
        }
        Carousel.close();
        return true;
    });
};
Carousel.roundsSinceBuyingCharacter = null;
Carousel.charactCost = 100;
Carousel.BuyCharacter = () => {
    if (GameSave.GetCharacter(Carousel.focus)) {
        return false;
    }
    if (!Carousel.hasEnoughCoinsForCharacter()) {
        return false;
    } else {
        Carousel.roundsSinceBuyingCharacter = 0;
        GameSave.ModifyCoins(-Carousel.charactCost);
        if (!Carousel.hasEnoughCoinsForCharacter()) {
            Carousel.buy.setAssetPath('purchase-wide-gray.png');
        }
        GameSave.UnlockCharacter(Carousel.focus);
        Carousel.text.color = '#fff';
        Carousel.characterModels[Carousel.focus].material.uniforms.saturation.value = 1;
        Carousel.CheckAvailability();
        Interface.ButtonSound();
        return true;
    }
};
Carousel.Update = deltaTime => {
    let idx = 0;
    for (let itr = 0; itr < Carousel.characterModels.length; itr++) {
        if (Carousel.characterModels[itr].world !== Carousel.worldSelected) {
            continue;
        }
        const model = Carousel.characterModels[itr];
        let newScale;
        if (idx == Carousel.focus && Carousel.inputFocus === "characters") {
            newScale = THREE.Math.lerp(model.scale.x, 2.2, deltaTime * 5);
        } else {
            newScale = THREE.Math.lerp(model.scale.x, 1, deltaTime * 5);
        }
        model.scale.set(newScale, newScale, newScale);
        if (GameSave.GetCharacter(Carousel.characterModels[0].name === "space_chicken" ? itr + 5 : itr)) {
            model.rotation.set(0, model.rotation.y - 1.0 * deltaTime, 0);
            Carousel.characterModels[itr].material.uniforms.saturation.value = 1;
        } else if (Carousel.characterModels[itr].world) {
            model.rotation.y = startRotation;
            Carousel.characterModels[itr].material.uniforms.saturation.value = 0;
        }
        idx++;
    }
    if (!Carousel.characters[Carousel.worldSelected]) {
        return;
    }
    if (Carousel.focus >= Carousel.characters[Carousel.worldSelected].length) {
        Carousel.focus = Carousel.characters[Carousel.worldSelected].length - 1;
    }
    if (GameSave.GetCharacter(Carousel.worldSelected === 'space' ? Carousel.focus + 5 : Carousel.focus)) {
        Carousel.select.setAssetPath('play-wide.png');
        Carousel.select.disabled = false;
    } else {
        Carousel.select.setAssetPath('play-wide-gray.png');
        Carousel.select.disabled = true;
    }
};
let previousFocus;
Carousel.ProcessTouchStart = () => {
    previousFocus = Carousel.focus;
};
let carouselCamTween;
const TweenCarouselCam = function TweenCarouselCam() {
    let worldX = null;
    let idx = 0;
    for (var i = 0; i < Carousel.banners.length; ++i) {
        if (worldX == null || Math.abs(Carousel.banners[i].x) < Math.abs(worldX)) {
            worldX = Carousel.banners[i].x;
            idx = i;
        }
    }
    if (window.isMobile) {
        for (var i = 0; i < Carousel.banners.length; ++i) {
            const t = new TWEEN.Tween(Carousel.banners[i]).easing(TWEEN.Easing.Sinusoidal.InOut).to({
                x: Carousel.banners[idx].x < 0.0 ? `+${Math.abs(Carousel.banners[idx].x)}` : `-${Math.abs(Carousel.banners[idx].x)}`
            }, 500).start();
        }
    }
    if (Carousel.focus * 2 === Game.camera.position.x) {
        return;
    }
    if (carouselCamTween) {
        carouselCamTween.stop();
    }
    const dt = 100 * Math.abs(Carousel.focus * 2 - Game.camera.position.x);
    carouselCamTween = new TWEEN.Tween(Game.camera.position).easing(TWEEN.Easing.Sinusoidal.InOut).to({
        x: Carousel.focus * 2
    }, dt).start();
};
const targetScrollSpeed = 0.01;
Carousel.ProcessTouchMove = (dx, posY) => {
    if (posY > window.innerHeight / 5) {
        AppStoreInterstitial.hide();
        var minX = 0;
        var maxX = Carousel.characters[Carousel.worldSelected].length * 2 - 1;
        const buffer = 0;
        let scrollSpeed;
        if (Game.camera.position.x < minX && Game.camera.position.x > minX - buffer) {
            scrollSpeed = targetScrollSpeed * 0.5;
        } else if (Game.camera.position.x > maxX && Game.camera.position.x < maxX + buffer) {
            scrollSpeed = targetScrollSpeed * 0.5;
        } else {
            scrollSpeed = targetScrollSpeed;
        }
        Game.camera.position.x += dx * scrollSpeed * -1;
        Game.camera.position.x = THREE.Math.clamp(Game.camera.position.x, minX - buffer, maxX + buffer);
        Carousel.focus = Math.round(THREE.Math.clamp(Game.camera.position.x, 0, Carousel.characterModels.length * 2 - 2) / 2);
        Carousel.CheckAvailability();
        Carousel.text.text = Carousel.characters[Carousel.worldSelected][THREE.Math.clamp(Carousel.focus, 0, Carousel.characters[Carousel.worldSelected].length - 1)].fullName.toUpperCase();
        if (!GameSave.GetCharacter(Carousel.focus)) {
            Carousel.text.color = '#dddddd';
        } else {
            Carousel.text.color = '#ffffff';
        }
    } else {
        var minX = Carousel.banners[0].width * (Carousel.banners.length - 1) * -1.0;
        var maxX = Carousel.banners[0].width * (Carousel.banners.length - 1) - 1.0;
        let nearestWorldToCenter = Carousel.banners[0];
        if (Carousel.banners[0].x + dx < 0.0 && Carousel.banners[0].x + dx > minX) {
            for (let i = 0; i < Carousel.banners.length; ++i) {
                Carousel.banners[i].x += dx;
                if (Math.abs(nearestWorldToCenter.x) > Math.abs(Carousel.banners[i].x)) {
                    nearestWorldToCenter = Carousel.banners[i];
                    Carousel.bannerFocus = i;
                }
            }
        }
        if (Carousel.worldSelected !== nearestWorldToCenter.world) {
            Carousel.refreshCharacters(nearestWorldToCenter.world);
        }
    }
};
Carousel.ProcessTouchEnd = () => {
    TweenCarouselCam(Carousel.focus);
};
Carousel.btnShowUpsellCallback = () => { };
Carousel.UpsellClosed = moveWorldSelector => {
    Carousel.inputFocus = 'worlds';
    if (moveWorldSelector) {
        Carousel.Navigate(-1, false);
    }
};
Carousel.btnLeftCallBack = () => {
    Carousel.Navigate(-1);
};
Carousel.btnRightCallBack = () => {
    Carousel.Navigate(1);
};
Carousel.CheckAvailability = () => {
    Carousel.select.visible = true;
    Carousel.showUpsell.visible = false;
    if (Carousel.worldSelected === 'piffle') {
        Carousel.select.visible = false;
        Carousel.showUpsell.visible = true;
    }
    if (Carousel.showUpsell._visible) { }
    if (Carousel.select._visible) {
        KeyboardUIControls.setFocus(Carousel.select);
    }
};
export default Carousel;