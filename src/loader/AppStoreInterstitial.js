import ThreeUI from './ThreeUI';
import Carousel from './Carousel';
import Game from './Game';
import Interface from './Interface';
import KeyboardUIControls from './KeyboardUIControls';
import Localisation from './Localisation';
import Utils from './Utils';
import * THREE from 'three';

const AppStoreInterstitial = {};
const appleUrl = "https://itunes.apple.com/app/apple-store/id924373886?pt=108682802&ct=crossypoki&mt=8";
const googleUrl = "https://play.google.com/store/apps/details?id=com.yodo1.crossyroad";
const borderSize = 4;

AppStoreInterstitial.lastUpsellScreen = '';
AppStoreInterstitial.init = function () {
    this.container = Game.UI.createRectangle();
    this.container.alpha = 0;
    this.container.anchor.x = ThreeUI.anchors.center;
    this.container.anchor.y = ThreeUI.anchors.center;
    this.container.visible = false;
    this.createPanel();
    this.createElements();
};
AppStoreInterstitial.createPanel = function () {
    this.overlay = Game.UI.createRectangle('rgba(105, 206, 236, 0.7)');
    this.overlay.stretch.x = true;
    this.overlay.stretch.y = true;
    this.overlay.offset.left = -1;
    this.overlay.offset.right = -1;
    this.overlay.offset.top = -1;
    this.overlay.offset.bottom = -1;
    this.overlay.visible = false;
    this.outsideRectangleWide = Game.UI.createRectangle('#fff');
    this.outsideRectangleWide.parent = this.container;
    this.outsideRectangleWide.stretch.x = true;
    this.outsideRectangleWide.stretch.y = true;
    this.outsideRectangleWide.offset.top = borderSize;
    this.outsideRectangleWide.offset.bottom = borderSize;
    this.outsideRectangleTall = Game.UI.createRectangle('#fff');
    this.outsideRectangleTall.parent = this.container;
    this.outsideRectangleTall.stretch.x = true;
    this.outsideRectangleTall.stretch.y = true;
    this.outsideRectangleTall.offset.left = borderSize;
    this.outsideRectangleTall.offset.right = borderSize;
    this.insideRectangleWide = Game.UI.createRectangle('#56C7F9');
    this.insideRectangleWide.parent = this.container;
    this.insideRectangleWide.stretch.x = true;
    this.insideRectangleWide.stretch.y = true;
    this.insideRectangleWide.offset.top = borderSize * 2;
    this.insideRectangleWide.offset.bottom = borderSize * 2;
    this.insideRectangleWide.offset.left = borderSize;
    this.insideRectangleWide.offset.right = borderSize;
    this.insideRectangleTall = Game.UI.createRectangle('#56C7F9');
    this.insideRectangleTall.parent = this.container;
    this.insideRectangleTall.stretch.x = true;
    this.insideRectangleTall.stretch.y = true;
    this.insideRectangleTall.offset.left = borderSize * 2;
    this.insideRectangleTall.offset.right = borderSize * 2;
    this.insideRectangleTall.offset.bottom = borderSize;
    this.insideRectangleTall.offset.top = borderSize;
    this.closeButton = Game.UI.createSpriteFromSheet('upsell-close.png', 'sprites/interface.png', 'sprites/interface.json');
    this.closeButton.parent = this.container;
    this.closeButton.x = borderSize / 2;
    this.closeButton.y = borderSize / 2;
    this.closeButton.width = 17 * 3;
    this.closeButton.height = 17 * 3;
    this.closeButton.anchor.x = ThreeUI.anchors.right;
    this.closeButton.anchor.y = ThreeUI.anchors.top;
    this.closeButton.defaultSprite = this.closeButton.assetPath;
    this.closeButton.blinkSprite = 'upsell-close-blink.png';
    this.closeButton.onClick(() => {
        Interface.ButtonSound();
        this.hide(true);
    });
};
AppStoreInterstitial.createElements = function () {
    const title = window.mobileUpsellText[0] || Localisation.GetString("upsell-title");
    this.titleText = Game.UI.createText(title, this.titleTextSize, 'EditUndoBrk', '#fff');
    this.titleText.parent = this.container;
    this.titleText.pivot.x = 0.5;
    this.titleText.pivot.y = 0;
    this.titleText.textBaseline = 'top';
    this.titleText.textAlign = 'center';
    this.titleText.x = this.container.width * 0.5;
    const subTitle = window.mobileUpsellText[0] || Localisation.GetString("upsell-title");
    this.subtitleText = Game.UI.createText(subTitle, this.titleTextSize, 'EditUndoBrk', '#FFE100');
    this.subtitleText.parent = this.container;
    this.subtitleText.pivot.x = 0;
    this.subtitleText.pivot.y = 0;
    this.subtitleText.textBaseline = 'top';
    this.subtitleText.visible = false;
    const usp1 = window.mobileUpsellText[1] || Localisation.GetString("upsell-usp1");
    this.usp1Coin = Game.UI.createSpriteFromSheet('coin.png', 'sprites/interface.png', 'sprites/interface.json');
    this.usp1Coin.pivot.y = 0.5;
    this.usp1Coin.parent = this.container;
    this.usp1Text = Game.UI.createText(usp1, this.bodyTextSize, 'EditUndoBrk', '#fff');
    this.usp1Text.parent = this.container;
    this.usp1Text.textBaseline = 'top';
    this.usp1Text.textVerticalAlign = 'center';
    const usp2 = window.mobileUpsellText[2] || Localisation.GetString("upsell-usp2");
    this.usp2Coin = Game.UI.createSpriteFromSheet('coin.png', 'sprites/interface.png', 'sprites/interface.json');
    this.usp2Coin.pivot.y = 0.5;
    this.usp2Coin.parent = this.container;
    this.usp2Text = Game.UI.createText(usp2, this.bodyTextSize, 'EditUndoBrk', '#fff');
    this.usp2Text.parent = this.container;
    this.usp2Text.textBaseline = 'top';
    this.usp2Text.textVerticalAlign = 'center';
    const usp3 = window.mobileUpsellText[3] || Localisation.GetString("upsell-usp3");
    this.usp3Coin = Game.UI.createSpriteFromSheet('coin.png', 'sprites/interface.png', 'sprites/interface.json');
    this.usp3Coin.pivot.y = 0.5;
    this.usp3Coin.parent = this.container;
    this.usp3Text = Game.UI.createText(usp3, this.bodyTextSize, 'EditUndoBrk', '#fff');
    this.usp3Text.parent = this.container;
    this.usp3Text.textBaseline = 'top';
    this.usp3Text.textVerticalAlign = 'center';
    this.appleButton = Game.UI.createSprite('sprites/upsell-app-store.png');
    this.appleButton.parent = this.container;
    this.appleButton.anchor.y = ThreeUI.anchors.bottom;
    this.appleButton.pivot.x = 0;
    this.appleButton.pivot.y = 1;
    this.appleButton.smoothing = true;
    this.googleButton = Game.UI.createSprite('sprites/upsell-google-play.png');
    this.googleButton.parent = this.container;
    this.googleButton.anchor.y = ThreeUI.anchors.bottom;
    this.googleButton.pivot.x = 0;
    this.googleButton.pivot.y = 1;
    this.googleButton.smoothing = true;
    this.exitButton = Game.UI.createSpriteFromSheet('GoTo.png', 'sprites/interface.png', 'sprites/interface.json');
    this.exitButton.x = 0;
    this.exitButton.y = 10;
    this.exitButton.visible = false;
    this.exitButton.pivot.y = 1;
    this.exitButton.anchor.x = ThreeUI.anchors.center;
    this.exitButton.anchor.y = ThreeUI.anchors.bottom;
    this.exitButton.defaultSprite = this.exitButton.assetPath;
    this.exitButton.blinkSprite = 'GoTo-blink.png';
    this.exitButton.width = 91;
    this.exitButton.height = 84;
    this.exitButton.onClick(this.hide.bind(this));
    this.googleButton.onClick(() => {
        Interface.ButtonSound();
        this.openUrl(googleUrl);
        PokiSDK.customEvent("appUpsell", "google", {});
        analytics.track('promotion', 'app_click_to', 'google');
    });
    this.appleButton.onClick(() => {
        Interface.ButtonSound();
        this.openUrl(appleUrl);
        PokiSDK.customEvent("appUpsell", "apple", {});
        analytics.track('promotion', 'app_click_to', 'apple');
    });
    this.phone = Game.UI.createSprite(window.mobileUpsellAvatarURL);
    this.phoneAspect = this.phone.width / this.phone.height;
    this.phone.parent = this.container;
    this.phone.pivot.x = 1;
    this.phone.pivot.y = 1;
    this.phone.anchor.x = ThreeUI.anchors.right;
    this.phone.anchor.y = ThreeUI.anchors.bottom;
    this.phone.smoothing = true;
};
AppStoreInterstitial.typeText = (textObject, textToType) => {
    let currentText = textObject.text;
    const charactersToType = textToType.split('');
    let isTyping = false;
    window.setTimeout(function () {
        isTyping = true;
        const typeTextInterval = window.setInterval(() => {
            if (charactersToType.length <= 0) {
                window.clearInterval(typeTextInterval);
                isTyping = false;
                return;
            }
            currentText += charactersToType.shift();
            textObject.text = currentText + (cursorToggle ? '|' : '');
        }, 200);
    }, 600);
    var cursorToggle = true;
    textObject.text = currentText + (cursorToggle ? '|' : '');
    const cursorInterval = window.setInterval(() => {
        if (!textObject.visible) {
            window.clearInterval(cursorInterval);
            return;
        }
        if (isTyping) {
            cursorToggle = true;
        } else {
            cursorToggle = !cursorToggle;
        }
        textObject.text = currentText + (cursorToggle ? '|' : '');
    }, 400);
};
AppStoreInterstitial.isVisible = function () {
    return this.container.visible;
};
AppStoreInterstitial.toggle = function (withOverlay) {
    if (this.container.visible) {
        this.hide();
    } else {
        this.show(withOverlay);
    }
};
AppStoreInterstitial.show = function (withOverlay) {
    if (this.container.visible) {
        return;
    }
    PokiSDK.customEvent("appUpsell", "open", {});
    analytics.track('promotion', 'app_impression', this.lastUpsellScreen);
    this.overlay.visible = !!withOverlay;
    this.container.visible = true;
    this.closeButton.visible = true;
    this.resize();
    Game.UI.MoveToFront(this.overlay);
    Game.UI.MoveToFront(this.outsideRectangleTall);
    Game.UI.MoveToFront(this.outsideRectangleWide);
    Game.UI.MoveToFront(this.insideRectangleTall);
    Game.UI.MoveToFront(this.insideRectangleWide);
    Game.UI.MoveToFront(this.titleText);
    Game.UI.MoveToFront(this.subtitleText);
    Game.UI.MoveToFront(this.usp1Coin);
    Game.UI.MoveToFront(this.usp1Text);
    Game.UI.MoveToFront(this.usp2Coin);
    Game.UI.MoveToFront(this.usp2Text);
    Game.UI.MoveToFront(this.usp3Coin);
    Game.UI.MoveToFront(this.usp3Text);
    Game.UI.MoveToFront(this.phone);
    Game.UI.MoveToFront(this.googleButton);
    Game.UI.MoveToFront(this.appleButton);
    Game.UI.MoveToFront(this.closeButton);
    Game.UI.MoveToFront(this.exitButton);
    let focusButton;
    if (Interface.CurrentScreen === 'selectingCharacter') {
        Game.UI.MoveToFront(Carousel.showUpsell);
        Game.UI.MoveToFront(KeyboardUIControls.reticle);
        Game.UI.MoveToFront(Carousel.attention);
        focusButton = Carousel.showUpsell;
    } else {
        Game.UI.MoveToFront(KeyboardUIControls.reticle);
    }
    if (Interface.CurrentScreen === 'main') {
        Interface.hideLogo(true);
        this.exitButton.visible = true;
        if (window.isMobile) {
            Interface.moveToPlay.visible = false;
        } else {
            Interface.playButton.visible = false;
        }
        focusButton = this.exitButton;
    } else if (Interface.CurrentScreen === 'death') {
        focusButton = Interface.playButton;
    }
    KeyboardUIControls.setFocus(this.closeButton);
};
AppStoreInterstitial.hide = function (moveWorldSelector) {
    if (!this.container.visible) {
        return;
    }
    PokiSDK.customEvent("appUpsell", "close", {});
    this.overlay.visible = false;
    this.container.visible = false;
    this.exitButton.visible = false;
    this.closeButton.visible = false;
    if (Interface.CurrentScreen === 'selectingCharacter') {
        Carousel.UpsellClosed(moveWorldSelector);
        focusButton = Carousel.showUpsell;
    }
    if (Interface.CurrentScreen === 'main') {
        if (window.isMobile) {
            Interface.moveToPlay.visible = true;
        } else {
            Interface.playButton.visible = true;
        }
        Interface.showLogo(true);
        focusButton = KeyboardUIControls.setFocus(Interface.playButton);
        Interface.showUpsell.x = 10;
        Interface.showUpsell.anchor.x = ThreeUI.anchors.right;
        Interface.ButtonScaleSet();
    } else if (Interface.CurrentScreen === 'death') {
        focusButton = Interface.playButton;
    }
};
AppStoreInterstitial.openUrl = function (url) {
    analytics.track('promotion', 'app_click_from', this.lastUpsellScreen);
    window.open(url, "Crossy Road");
};
AppStoreInterstitial.resize = function () {
    if (!this.container.visible) {
        return;
    }
    const aspectRatio = Game.canvas.width / Game.canvas.height;
    const percLandscape = Utils.inverseLerp(window.minAspect, window.maxAspect, aspectRatio);
    const minSideMargin = 50;
    const minTopMargin = 50;
    const minBottomMargin = 120;
    const targetAspectRatio = 16 / 11;
    const maxHeight = Game.UI.height - minBottomMargin - minTopMargin;
    this.container.y = (minTopMargin - minBottomMargin) / 2;
    this.container.width = Game.UI.width - minSideMargin;
    this.container.height = this.container.width / targetAspectRatio;
    if (this.container.height > maxHeight) {
        this.container.height = maxHeight;
        this.container.width = maxHeight * targetAspectRatio;
    }
    const scale = this.container.height / maxHeight;
    this.padding = 25 * scale;
    this.upsellPadding = 10 * scale;
    this.titleTextSize = 40 * scale;
    this.bodyTextSize = 30 * scale;
    this.upsellButtonScale = 1 * scale;
    this.phone.height = 320 * 1.3 * scale;
    this.phone.width = this.phone.height * this.phoneAspect;
    this.titleText.x = this.container.width * 0.5;
    this.resizeAndRepositionElements(scale);
};
AppStoreInterstitial.resizeAndRepositionElements = function (scale) {
    this.titleText.y = 50 * scale;
    this.titleText.size = this.titleTextSize;
    this.subtitleText.x = this.titleText.x;
    this.subtitleText.y = this.titleText.y + this.titleText.size * 1.1;
    this.subtitleText.size = this.titleTextSize;
    this.usp1Coin.x = 80 * scale;
    this.usp1Coin.y = this.titleText.y + this.titleText.size + 100 * scale;
    this.usp1Coin.height = this.bodyTextSize;
    this.usp1Coin.width = this.usp1Coin.height;
    this.usp1Text.x = this.usp1Coin.x + this.bodyTextSize * 1.2;
    this.usp1Text.y = this.usp1Coin.y - 10 * scale;
    this.usp1Text.size = this.bodyTextSize;
    this.usp2Coin.x = this.usp1Coin.x;
    this.usp2Coin.y = this.usp1Coin.y + this.usp1Coin.height + this.padding * 1.5;
    this.usp2Coin.height = this.bodyTextSize;
    this.usp2Coin.width = this.usp2Coin.height;
    this.usp2Text.x = this.usp2Coin.x + this.bodyTextSize * 1.2;
    this.usp2Text.y = this.usp2Coin.y - 10 * scale;
    this.usp2Text.size = this.bodyTextSize;
    this.usp3Coin.x = this.usp1Coin.x;
    this.usp3Coin.y = this.usp2Coin.y + this.usp2Coin.height + this.padding * 1.5;
    this.usp3Coin.height = this.bodyTextSize;
    this.usp3Coin.width = this.usp3Coin.height;
    this.usp3Text.x = this.usp3Coin.x + this.bodyTextSize * 1.2;
    this.usp3Text.y = this.usp3Coin.y - 10 * scale;
    this.usp3Text.size = this.bodyTextSize;
    this.appleButton.width = 214 * this.upsellButtonScale;
    this.appleButton.height = 82 * this.upsellButtonScale;
    this.googleButton.width = 214 * this.upsellButtonScale;
    this.googleButton.height = 82 * this.upsellButtonScale;
    this.appleButton.x = this.padding * 3.5;
    this.appleButton.y = this.padding * 2.5;
    this.googleButton.x = this.appleButton.x + this.appleButton.width + this.upsellPadding;
    this.googleButton.y = this.appleButton.y;
    this.phone.x = -70 * scale;
    this.phone.y = -50 * scale;
};
export default AppStoreInterstitial;