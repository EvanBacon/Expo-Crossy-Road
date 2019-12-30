import * THREE from 'three';

import ThreeUI from './ThreeUI';
import AppStoreInterstitial from './AppStoreInterstitial';
import Game from './Game';
import Storage from './Storage';

const KeyboardHint = {};

KeyboardHint.animateDelay = 0.5;
KeyboardHint.scale = 5;
KeyboardHint.hiddenAlpha = 0.35;
KeyboardHint.animate = [];
KeyboardHint.animateIdx = 0;
KeyboardHint.pressedWrongButton = 0;
KeyboardHint.hiddenThroughConfirmOnScreen = null;
KeyboardHint.hintReAppearAfterTimeout = 0;

KeyboardHint.hintConfirmScreenGroupIdx = {
    'main': 0,
    'main-show-more': 0,
    'main-char-select': 0,
    'main-first-play': 1,
    'movement-hint': 2,
    'death-onboarding': 3,
    'gift': 3,
    'gift-given': 3,
    'gumball': 3,
    'death': 3,
    'char-select': 4,
    'char-select-left-edge': 4,
    'char-select-right-edge': 4,
    'char-select-back-button': 4,
    'death-buttons': 5
};

KeyboardHint.hintConfirmAmounts = {};
KeyboardHint.hintConfirmCountedThisScreen = false;
KeyboardHint.hintConfirmsUntilHide = 2;

KeyboardHint.init = function () {
    this.createSprites();
    const savedHintConfirmAmounts = Storage.getItem('savedHintConfirmAmounts');
    if (savedHintConfirmAmounts) {
        const parsedAmounts = JSON.parse(savedHintConfirmAmounts);
        Object.keys(parsedAmounts).forEach(key => {
            this.hintConfirmAmounts[key] = parsedAmounts[key];
        });
    }
    if (window.mouseDisabled) {
        document.addEventListener('click', () => {
            this.keyPressed();
        });
    }
};

KeyboardHint.createSprites = function () {
    
    this.keyContainer = Game.UI.createRectangle('rgba(0,0,0,0)');
    this.keyContainer.anchor.x = ThreeUI.anchors.center;
    this.keyContainer.anchor.y = ThreeUI.anchors.bottom;
    this.keyContainer.visible = false;
    this.emptyKeys = [];
    let lastEmptySpriteOnTop;
    for (let i = 0; i < 8; i++) {
        var topRowKey = Game.UI.createSpriteFromSheet('key-top-row.png', 'sprites/interface.png', 'sprites/interface.json');
        topRowKey.width = topRowKey.width * this.scale;
        topRowKey.height = topRowKey.height * this.scale;
        topRowKey.x = topRowKey.width * i;
        topRowKey.pivot.x = 0;
        topRowKey.pivot.y = 0;
        topRowKey.smoothing = false;
        topRowKey.parent = this.keyContainer;
        lastEmptySpriteOnTop = topRowKey;
        this.emptyKeys.push(topRowKey);
    }
    this.cursorUp = Game.UI.createSpriteFromSheet('cursor-up.png', 'sprites/interface.png', 'sprites/interface.json');
    this.cursorUp.width = this.cursorUp.width * this.scale;
    this.cursorUp.height = this.cursorUp.height * this.scale;
    this.cursorUp.parent = this.keyContainer;
    this.cursorUp.pivot.x = 0;
    this.cursorUp.pivot.y = 0;
    this.cursorUp.smoothing = false;
    this.cursorUp.x = lastEmptySpriteOnTop.x + lastEmptySpriteOnTop.width;
    this.cursorUp.defaultSprite = 'cursor-up-active.png';
    this.cursorUp.animateSprite = 'cursor-up.png';
    const topRowRightKey = Game.UI.createSpriteFromSheet('key-top-row-right.png', 'sprites/interface.png', 'sprites/interface.json');
    topRowRightKey.width = topRowRightKey.width * this.scale;
    topRowRightKey.height = topRowRightKey.height * this.scale;
    topRowRightKey.parent = this.keyContainer;
    topRowRightKey.pivot.x = 0;
    topRowRightKey.pivot.y = 0;
    topRowRightKey.smoothing = false;
    topRowRightKey.x = this.cursorUp.x + this.cursorUp.width;
    this.emptyKeys.push(topRowRightKey);
    const bottomRowLeftKey = Game.UI.createSpriteFromSheet('key-bottom-row-left.png', 'sprites/interface.png', 'sprites/interface.json');
    bottomRowLeftKey.width = bottomRowLeftKey.width * this.scale;
    bottomRowLeftKey.height = bottomRowLeftKey.height * this.scale;
    bottomRowLeftKey.y = topRowKey.height;
    bottomRowLeftKey.parent = this.keyContainer;
    bottomRowLeftKey.pivot.x = 0;
    bottomRowLeftKey.pivot.y = 0;
    bottomRowLeftKey.smoothing = false;
    this.emptyKeys.push(bottomRowLeftKey);
    this.spacebar = Game.UI.createSpriteFromSheet('spacebar.png', 'sprites/interface.png', 'sprites/interface.json');
    this.spacebar.pivot.x = 0;
    this.spacebar.pivot.y = 0;
    this.spacebar.x = bottomRowLeftKey.x + bottomRowLeftKey.width;
    this.spacebar.y = bottomRowLeftKey.y;
    this.spacebar.smoothing = false;
    this.spacebar.parent = this.keyContainer;
    this.spacebar.width = this.spacebar.width * this.scale;
    this.spacebar.height = this.spacebar.height * this.scale;
    this.spacebar.defaultSprite = 'spacebar-pressed.png';
    this.spacebar.animateSprite = 'spacebar.png';
    const bottomRowKey = Game.UI.createSpriteFromSheet('key-bottom-row.png', 'sprites/interface.png', 'sprites/interface.json');
    bottomRowKey.width = bottomRowKey.width * this.scale;
    bottomRowKey.height = bottomRowKey.height * this.scale;
    bottomRowKey.y = this.spacebar.y;
    bottomRowKey.x = this.spacebar.x + this.spacebar.width;
    bottomRowKey.parent = this.keyContainer;
    bottomRowKey.pivot.x = 0;
    bottomRowKey.pivot.y = 0;
    bottomRowKey.smoothing = false;
    this.emptyKeys.push(bottomRowKey);
    this.cursorLeft = Game.UI.createSpriteFromSheet('cursor-left.png', 'sprites/interface.png', 'sprites/interface.json');
    this.cursorLeft.width = this.cursorLeft.width * this.scale;
    this.cursorLeft.height = this.cursorLeft.height * this.scale;
    this.cursorLeft.parent = this.keyContainer;
    this.cursorLeft.pivot.x = 0;
    this.cursorLeft.pivot.y = 0;
    this.cursorLeft.smoothing = false;
    this.cursorLeft.x = bottomRowKey.x + bottomRowKey.width;
    this.cursorLeft.y = bottomRowKey.y;
    this.cursorLeft.defaultSprite = 'cursor-left-active.png';
    this.cursorLeft.animateSprite = 'cursor-left.png';
    this.cursorDown = Game.UI.createSpriteFromSheet('cursor-down.png', 'sprites/interface.png', 'sprites/interface.json');
    this.cursorDown.width = this.cursorDown.width * this.scale;
    this.cursorDown.height = this.cursorDown.height * this.scale;
    this.cursorDown.parent = this.keyContainer;
    this.cursorDown.pivot.x = 0;
    this.cursorDown.pivot.y = 0;
    this.cursorDown.smoothing = false;
    this.cursorDown.x = this.cursorLeft.x + this.cursorLeft.width;
    this.cursorDown.y = this.cursorLeft.y;
    this.cursorDown.defaultSprite = 'cursor-down-active.png';
    this.cursorDown.animateSprite = 'cursor-down.png';
    this.cursorRight = Game.UI.createSpriteFromSheet('cursor-right.png', 'sprites/interface.png', 'sprites/interface.json');
    this.cursorRight.width = this.cursorRight.width * this.scale;
    this.cursorRight.height = this.cursorRight.height * this.scale;
    this.cursorRight.parent = this.keyContainer;
    this.cursorRight.pivot.x = 0;
    this.cursorRight.pivot.y = 0;
    this.cursorRight.smoothing = false;
    this.cursorRight.x = this.cursorDown.x + this.cursorDown.width;
    this.cursorRight.y = this.cursorDown.y;
    this.cursorRight.defaultSprite = 'cursor-right-active.png';
    this.cursorRight.animateSprite = 'cursor-right.png';
    this.keyContainer.width = topRowRightKey.x + topRowRightKey.width;
    this.keyContainer.height = this.cursorDown.y + this.cursorDown.height;
    this.allKeys = [this.cursorLeft, this.cursorRight, this.cursorDown, this.cursorUp, this.spacebar].concat(this.emptyKeys);
};

KeyboardHint.isVisible = function () {
    return this.keyContainer.visible;
};

KeyboardHint.switch = function (screen) {
    this.setupSpritesForScreen(screen);
};

KeyboardHint.clearActiveScreen = function () {
    this.lastShowedScreen = null;
};

KeyboardHint.reset = function () {
    this.clearActiveScreen();
    this.hide();
};

KeyboardHint.show = function (screen, skipShownCheck) {
    if (window.isMobile) {
        return;
    }
    if (!screen) {
        return;
    }
    if (AppStoreInterstitial.isVisible()) {
        return;
    }
    if (this.keyContainer.visible) {
        this.switch(screen);
        return;
    }
    const screenIdx = this.hintConfirmScreenGroupIdx[screen];
    if (screenIdx !== this.currentScreenIdx && screen !== this.lastShowedScreen) {
        this.hintConfirmCountedThisScreen = false;
    }
    if (!skipShownCheck && this.hintConfirmAmounts[screenIdx] && this.hintConfirmAmounts[screenIdx] >= this.hintConfirmsUntilHide) {
        this.keyContainer.visible = false;
    } else {
        this.keyContainer.visible = true;
    }
    this.setupSpritesForScreen(screen, skipShownCheck);
};

KeyboardHint.setupSpritesForScreen = function (screen, forceUpdateAnimations) {
    if (window.isMobile) {
        return;
    }
    this.cancelReappearTimeout();
    const screenIdx = this.hintConfirmScreenGroupIdx[screen];
    const updateAnimations = screen !== this.lastShowedScreen || forceUpdateAnimations;
    if (updateAnimations) {
        Game.timeSinceLastBlink = -1;
        this.animateIdx = 1;
    }
    this.lastShowedScreen = screen;
    this.currentScreenIdx = screenIdx;
    this.animate = [];
    this.keyContainer.y = 80;
    const hideEmpty = true;
    if (screen === 'main') {
        this.cursorLeft.alpha = 1;
        this.cursorRight.alpha = 1;
        this.cursorDown.alpha = 1;
        this.cursorUp.alpha = 1;
        this.spacebar.alpha = 1;
        this.animate.push(this.cursorUp);
    } else if (screen === 'main-show-more') {
        this.cursorLeft.alpha = 1;
        this.cursorRight.alpha = 1;
        this.cursorDown.alpha = 1;
        this.cursorUp.alpha = 1;
        this.spacebar.alpha = 1;
        this.animate.push(this.cursorUp);
    } else if (screen === 'main-char-select') {
        this.cursorLeft.alpha = 1;
        this.cursorRight.alpha = 1;
        this.cursorDown.alpha = 1;
        this.cursorUp.alpha = 1;
        this.spacebar.alpha = 1;
        this.animate.push(this.cursorUp);
    } else if (screen === 'main-first-play') {
        this.cursorLeft.alpha = 1;
        this.cursorRight.alpha = 1;
        this.cursorDown.alpha = 1;
        this.cursorUp.alpha = 1;
        this.spacebar.alpha = this.hiddenAlpha;
        this.animate.push(this.cursorUp);
    } else if (screen === 'movement-hint') {
        this.cursorLeft.alpha = 1;
        this.cursorRight.alpha = 1;
        this.cursorDown.alpha = 1;
        this.cursorUp.alpha = 1;
        this.spacebar.alpha = this.hiddenAlpha;
        this.animate.push(this.cursorLeft, this.cursorRight, this.cursorDown);
    } else if (screen === 'full-movement-hint') {
        this.cursorLeft.alpha = 1;
        this.cursorRight.alpha = 1;
        this.cursorDown.alpha = 1;
        this.cursorUp.alpha = 1;
        this.spacebar.alpha = 1;
        this.animate.push(this.cursorUp, this.cursorLeft, this.cursorRight, this.cursorDown, this.spacebar);
    } else if (screen === 'death-onboarding' || screen === 'gift' || screen === 'gift-given' || screen === 'gumball') {
        this.cursorLeft.alpha = this.hiddenAlpha;
        this.cursorRight.alpha = this.hiddenAlpha;
        this.cursorDown.alpha = this.hiddenAlpha;
        this.cursorUp.alpha = this.hiddenAlpha;
        this.spacebar.alpha = 1;
        this.animate.push(this.spacebar);
    } else if (screen === 'char-select') {
        this.cursorLeft.alpha = 1;
        this.cursorRight.alpha = 1;
        this.cursorDown.alpha = 1;
        this.cursorUp.alpha = 1;
        this.spacebar.alpha = 1;
        this.animate.push(this.spacebar, this.cursorLeft, this.cursorRight, this.cursorUp);
    } else if (screen === 'char-select-left-edge') {
        this.cursorLeft.alpha = 1;
        this.cursorRight.alpha = 1;
        this.cursorDown.alpha = 1;
        this.cursorUp.alpha = 1;
        this.spacebar.alpha = 1;
        this.animate.push(this.spacebar, this.cursorRight, this.cursorUp);
    } else if (screen === 'char-select-right-edge') {
        this.cursorLeft.alpha = 1;
        this.cursorRight.alpha = 1;
        this.cursorDown.alpha = 1;
        this.cursorUp.alpha = 1;
        this.spacebar.alpha = 1;
        this.animate.push(this.spacebar, this.cursorLeft, this.cursorUp);
    } else if (screen === 'char-select-back-button') {
        this.cursorLeft.alpha = 1;
        this.cursorRight.alpha = 1;
        this.cursorDown.alpha = 1;
        this.cursorUp.alpha = 1;
        this.spacebar.alpha = 1;
        this.animate.push(this.spacebar, this.cursorDown, this.cursorLeft, this.cursorRight);
    } else if (screen === 'death-buttons') {
        this.cursorLeft.alpha = 1;
        this.cursorRight.alpha = 1;
        this.cursorDown.alpha = 1;
        this.cursorUp.alpha = 1;
        this.spacebar.alpha = 1;
        this.animate.push(this.spacebar, this.cursorDown, this.cursorUp);
    } else if (screen === 'death') {
        this.cursorLeft.alpha = this.hiddenAlpha;
        this.cursorRight.alpha = this.hiddenAlpha;
        this.cursorDown.alpha = this.hiddenAlpha;
        this.cursorUp.alpha = this.hiddenAlpha;
        this.spacebar.alpha = 1;
        this.animate.push(this.spacebar);
    }
    if (screen === 'char-select' || screen === 'char-select-left-edge' || screen === 'char-select-right-edge' || screen === 'char-select-back-button' || screen === 'gift' || screen === 'gumball' || screen === 'death' || screen === 'death-buttons') {
        this.keyContainer.y = 160;
    } else if (screen === 'gift-given') {
        this.keyContainer.y = 220;
    }
    this.emptyKeys.forEach(key => {
        key.alpha = hideEmpty ? this.hiddenAlpha : 1;
    });
    if (this.cursorUp.alpha === this.hiddenAlpha && this.cursorDown.alpha === this.hiddenAlpha) {
        this.cursorUp.animateSprite = 'cursor-up-hidden.png';
    } else {
        this.cursorUp.animateSprite = 'cursor-up.png';
    }
    this.allKeys.forEach(key => {
        if (updateAnimations) {
            if (this.animate.includes(key)) {
                if (key.defaultSprite) {
                    key.setAssetPath(key.defaultSprite);
                }
            } else {
                if (key.animateSprite) {
                    key.setAssetPath(key.animateSprite);
                }
            }
        }
        Game.UI.MoveToFront(key);
    });
    Game.UI.MoveToFront(this.cursorDown);
};

KeyboardHint.update = function (deltaTime) {
    if (this.animate.length === 0) {
        return;
    }
    if (Game.timeSinceLastBlink < 0) {
        this.animate.forEach((key, idx) => {
            if (idx === 0) {
                key.setAssetPath(key.defaultSprite);
            } else {
                key.setAssetPath(key.animateSprite);
            }
        });
    }
    if (Game.timeSinceLastBlink >= 0.4) {
        this.animate.forEach((key, idx) => {
            if (idx + this.animateDelay === this.animateIdx) {
                key.setAssetPath(key.defaultSprite);
            } else {
                key.setAssetPath(key.animateSprite);
            }
        });
        this.animateIdx += this.animateDelay;
    }
    if (this.animateIdx - this.animateDelay >= this.animate.length) {
        this.animateIdx = this.animateDelay;
    }
};

KeyboardHint.hide = function () {
    this.keyContainer.visible = false;
    this.currentScreenIdx = null;
};

KeyboardHint.triggerReappearTimeout = function (time) {
    time = typeof time === 'number' ? time : 2000;
    this.cancelReappearTimeout();
    this.hintReAppearAfterTimeout = window.setTimeout(() => {
        if (this.lastShowedScreen !== 'main-first-play') {
            this.show(this.lastShowedScreen);
        }
    }, time);
};

KeyboardHint.cancelReappearTimeout = function () {
    window.clearInterval(this.hintReAppearAfterTimeout);
};

KeyboardHint.hintConfirmed = function () {
    if (this.hintConfirmCountedThisScreen) {
        return;
    }
    this.hintConfirmAmounts[this.currentScreenIdx] = (this.hintConfirmAmounts[this.currentScreenIdx] || 0) + 1;
    this.hintConfirmCountedThisScreen = true;
    Storage.setItem('savedHintConfirmAmounts', JSON.stringify(this.hintConfirmAmounts));
};

KeyboardHint.keyPressed = function (spacebar, left, top, right, bottom) {
    const pressedCorrectButton = spacebar && this.animate.includes(this.spacebar) || left && this.animate.includes(this.cursorLeft) || top && this.animate.includes(this.cursorUp) || right && this.animate.includes(this.cursorRight) || bottom && this.animate.includes(this.cursorDown);
    if (pressedCorrectButton) {
        this.pressedWrongButton = 0;
        this.hintConfirmed();
        this.hide();
        window.requestAnimationFrame(() => {
            if (!Game.playing || Game.playerController.Dead) {
                this.triggerReappearTimeout(2000);
            }
        });
    } else {
        if (this.lastShowedScreen) {
            this.pressedWrongButton++;
            if (this.pressedWrongButton >= 2 && this.lastShowedScreen) {
                this.show(this.lastShowedScreen, true);
            }
        }
    }
};

window.KeyboardHint = KeyboardHint;

export default KeyboardHint;