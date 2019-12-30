import * THREE from 'three';

import ThreeUI from './ThreeUI';
import AppStoreInterstitial from './AppStoreInterstitial';
import Carousel from './Carousel';
import Game from './Game';
import Interface from './Interface';

const KeyboardUIControls = {};
KeyboardUIControls.animatedRectangleScale = 0.9;
KeyboardUIControls.sprites = {
    default: 'focus.png',
    wide: 'focus-wide.png',
    square: 'focus-square-small.png',
    keyboard: 'focus-keyboard.png',
    upsellClose: 'focus-upsell-close.png',
    deviceButton: 'focus-device-button.png',
    upsell: 'focus-upsell.png',
    upsellBlink: 'focus-upsell-blink.png'
};
KeyboardUIControls.init = function () {
    this.blinkButton = null;
    if (window.isMobile) {
        return;
    }
    this.reticle = Game.UI.createSpriteFromSheet(this.sprites.default, 'sprites/interface.png', 'sprites/interface.json');
    this.reticle.stretch.x = true;
    this.reticle.stretch.y = true;
    this.reticle.anchor.x = ThreeUI.anchors.center;
    this.reticle.anchor.y = ThreeUI.anchors.center;
    this.reticle.visible = false;
    this.reticle.pivot.x = 0;
    this.reticle.pivot.y = 0;
    this.animateReticle = Game.UI.createRectangle('#005c7e');
    this.animateReticle.visible = false;
    this.animateReticle.pivot.x = 0.5;
    this.animateReticle.pivot.y = 0.5;
    Game.UI.MoveToBack(this.animateReticle);
};
KeyboardUIControls.setFocus = function (button) {
    if ((!button || !this.reticle || this.reticle.parent === button || this.disabled) && !window.isMobile) {
        return;
    }
    Game.timeSinceLastBlink = -1;
    if (window.isMobile) {
        this.blinkButton = button;
        return;
    }
    if (this.reticle.parent && this.reticle.parent.blinkSprite && this.reticle.parent.defaultSprite && !this.reticle.parent.disabled) {
        this.reticle.parent.setAssetPath(this.reticle.parent.defaultSprite);
    }
    if (button.blinkSprite && !button.disabled) {
        button.setAssetPath(button.blinkSprite);
    }
    this.reticle.parent = button;
    if (button.assetPath.includes('device')) {
        this.reticle.setAssetPath(this.sprites.deviceButton);
    } else if (button.assetPath.includes('keyboard')) {
        this.reticle.setAssetPath(this.sprites.keyboard);
    } else if (button.assetPath.includes('upsell-close')) {
        this.reticle.setAssetPath(this.sprites.upsellClose);
    } else if (button.assetPath.includes('upsell-')) {
        this.reticle.setAssetPath(this.sprites.upsellBlink);
    } else if (button.width === button.height) {
        this.reticle.setAssetPath(this.sprites.square);
    } else if (button.width > button.height * 1.6) {
        this.reticle.setAssetPath(this.sprites.wide);
    } else {
        this.reticle.setAssetPath(this.sprites.default);
    }
    this.reticle.visible = true;
};
KeyboardUIControls.disable = function () {
    this.disabled = true;
};
KeyboardUIControls.enable = function () {
    this.disabled = false;
};
KeyboardUIControls.getFocus = function () {
    return this.reticle.parent;
};
KeyboardUIControls.update = function (deltaTime) {
    if (this.disabled) {
        return;
    }
    const button = window.isMobile ? this.blinkButton : this.reticle.parent;
    if (button && !button.disabled) {
        if (Game.timeSinceLastBlink < 0) {
            if (button.blinkSprite) {
                button.setAssetPath(button.blinkSprite);
            }
        } else if (Game.timeSinceLastBlink >= 0.4) {
            if (button.blinkSprite && button.defaultSprite) {
                if (button.assetPath === button.defaultSprite) {
                    button.setAssetPath(button.blinkSprite);
                } else {
                    button.setAssetPath(button.defaultSprite);
                }
            } else if (!window.isMobile) {
                if (this.reticle.assetPath === this.sprites.upsell) {
                    this.reticle.setAssetPath(this.sprites.upsellBlink);
                } else if (this.reticle.assetPath === this.sprites.upsellBlink) {
                    this.reticle.setAssetPath(this.sprites.upsell);
                }
            }
        }
    }
};
KeyboardUIControls.handleKeyEvent = function ({ keyCode }) {
    if (!Game.takesUserInput || this.disabled || !this.reticle) {
        return;
    }
    const button = this.reticle.parent;
    let spacebar = false;
    let enter = false;
    let left = false;
    let right = false;
    let top = false;
    let bottom = false;
    let exit = false;
    switch (keyCode) {
        case 32:
            spacebar = true;
            break;
        case 13:
            enter = true;
            break;
        case 87:
        case 38:
            top = true;
            break;
        case 65:
        case 37:
            left = true;
            break;
        case 83:
        case 40:
            bottom = true;
            break;
        case 68:
        case 39:
            right = true;
            break;
        case 27:
            exit = true;
            break;
    }
    if ((spacebar || enter) && button && !button.disabled) {
        this.reticle.parent.fireEvent('click');
        return;
    }
    if (exit) {
        if (AppStoreInterstitial.isVisible() && Interface.CurrentScreen === 'main') {
            AppStoreInterstitial.hide();
            return;
        }
        if (Interface.CurrentScreen === 'selectingCharacter') {
            Carousel.close();
            return;
        }
    }
    if (Interface.CurrentScreen === 'main' && (top || left || bottom || right || spacebar) && !AppStoreInterstitial.isVisible()) {
        Interface.playButtonCallback(false);
        return;
    }
    if (Interface.CurrentScreen === 'main' && !Game.hasPlayedBefore && top) {
        Interface.playButtonCallback();
        return;
    }
    if (Interface.CurrentScreen === 'selectingCharacter' && (left || right)) {
        KeyboardUIControls.CarouselNavigation(left, right);
        return;
    }
    if (button) {
        if (left && button.navigateOnLeft) {
            var navigateTo = button.navigateOnLeft;
            if (typeof button.navigateOnLeft === 'function') {
                navigateTo = navigateTo();
            }
            this.setFocus(navigateTo);
            return;
        }
        if (right && button.navigateOnRight) {
            var navigateTo = button.navigateOnRight;
            if (typeof navigateTo === 'function') {
                navigateTo = navigateTo();
            }
            this.setFocus(navigateTo);
            return;
        }
        if (top && button.navigateOnTop) {
            var navigateTo = button.navigateOnTop;
            if (typeof navigateTo === 'function') {
                navigateTo = navigateTo();
            }
            this.setFocus(navigateTo);
            return;
        }
        if (bottom && button.navigateOnBottom) {
            var navigateTo = button.navigateOnBottom;
            if (typeof navigateTo === 'function') {
                navigateTo = navigateTo();
            }
            this.setFocus(navigateTo);
            return;
        }
    }
};
KeyboardUIControls.CarouselNavigation = (left, right) => {
    if (left) {
        Carousel.btnLeftCallBack(true);
    }
    if (right) {
        Carousel.btnRightCallBack(true);
    }
};
KeyboardUIControls.animateBetweenButtons = function (sourceButton, targetButton) {
    if (!sourceButton) {
        return;
    }
    const sourceBounds = sourceButton.getBounds();
    const targetBounds = targetButton.getBounds();
    this.animateReticle.x = sourceBounds.x + sourceBounds.width * 0.5;
    this.animateReticle.y = sourceBounds.y + sourceBounds.height * 0.5;
    this.animateReticle.width = sourceBounds.width * this.animatedRectangleScale;
    this.animateReticle.height = sourceBounds.height * this.animatedRectangleScale;
    this.animateReticle.visible = true;
    this.animateReticle.sourceBounds = sourceBounds;
    this.animateReticle.targetBounds = targetBounds;
    this.animateReticle.t = 0;
    new TWEEN.Tween(this.animateReticle).to({
        x: targetBounds.x + targetBounds.width * 0.5,
        y: targetBounds.y + targetBounds.height * 0.5,
        t: 1
    }, 150).onUpdate(function () {
        const scale = Math.abs(this.t - 0.5) + 0.5;
        let width;
        let height;
        if (this.t < 0.5) {
            width = this.sourceBounds.width * KeyboardUIControls.animatedRectangleScale;
            height = this.sourceBounds.height * KeyboardUIControls.animatedRectangleScale;
        } else {
            width = this.targetBounds.width * KeyboardUIControls.animatedRectangleScale;
            height = this.targetBounds.height * KeyboardUIControls.animatedRectangleScale;
        }
        this.width = width * scale;
        this.height = height * scale;
    }).start();
};
export default KeyboardUIControls;