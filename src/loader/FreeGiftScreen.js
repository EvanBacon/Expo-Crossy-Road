import * THREE from 'three';

import * as AssetLoader from './AssetLoader';

import ThreeUI from './ThreeUI';
import Carousel from './Carousel';
import FreeGift from './FreeGift';
import Easing from './Easing';
import Game from './Game';
import GameSave from './GameSave';
import GumballMachineScreen from './GumballMachineScreen';
import Interface from './Interface';
import KeyboardHint from './KeyboardHint';
import KeyboardUIControls from './KeyboardUIControls';
import * as Utils from './Utils';

import * as ObjectPooler from './ObjectPooler';
import PasrTimer from './PasrTimer'

const giftHopHeight = 0.7;
const baseCoinIconSize = 75;
const baseCoinTextSize = 7.5;
const FreeGiftScreen = {
    meshScalePortrait: 0.7,
    meshScaleLandscape: 1,
    meshYBasePosition: 298
};
FreeGiftScreen.init = function (ui, canvas, scene, reUsedElements) {
    this.ui = ui;
    this.canvas = canvas;
    this.scene = scene;
    this.reUsedElements = reUsedElements;
    this.targetGiftScale = new THREE.Vector3(1, 1, 1);
    this.meshYScaleModifier = 1;
    this.meshXZScaleModifier = 1;
    this.giftShrinkScaleModifier = 1;
    this.openingGift = false;
    this.shakeGift = 0;
    this.hopTrigger = 1;
    this.hopTimer = new PasrTimer(1, 0.2, 0, 0.12);
    this.fallTimer = new PasrTimer(0, 0, 0, 0.4);
    this.fallWobbleTimer = new PasrTimer(0.35, 0.15, 0.05, 0.3);
    this.openTimer = new PasrTimer(0, 0.75, 0.75, 0.05);
    this.textTimer = new PasrTimer(0.1, 0.5, 0.5, 1.5);
    this.createElements();
    this.prepareGiftMeshes();
};
FreeGiftScreen.prepareGiftMeshes = function () {
    this.giftMeshes = [];
    const modelData = [AssetLoader.loadedAssets['models/common-world.json'].models.gift_1_optimised, AssetLoader.loadedAssets['models/common-world.json'].models.gift_2_optimised, AssetLoader.loadedAssets['models/common-world.json'].models.gift_3_optimised, AssetLoader.loadedAssets['models/common-world.json'].models.gift_4_optimised, AssetLoader.loadedAssets['models/common-world.json'].models.gift_5_optimised, AssetLoader.loadedAssets['models/common-world.json'].models.gift_6_optimised, AssetLoader.loadedAssets['models/common-world.json'].models.gift_7_optimised];
    modelData.forEach((model, idx) => {
        const mesh = ObjectPooler.importMesh(`gift_${idx}`, model);
        mesh.visible = false;
        mesh.position.set(2.4, this.meshYBasePosition, -2);
        mesh.rotation.y = 45 * Math.PI / 180;
        this.scene.add(mesh);
        this.giftMeshes.push(mesh);
    });
};
FreeGiftScreen.createElements = function () {
    this.backButton = this.ui.createSpriteFromSheet('smallBack.png', 'sprites/interface.png', 'sprites/interface.json');
    this.backButton.width = 16 * 4;
    this.backButton.height = 16 * 4;
    this.backButton.x = 10;
    this.backButton.y = 10;
    this.backButton.pivot = {
        x: 0,
        y: 0
    };
    this.backButton.visible = false;
    this.backButton.defaultSprite = this.backButton.assetPath;
    this.backButton.blinkSprite = 'smallBack-blink.png';
    this.backButton.onClick(() => {
        Interface.ButtonSound();
        if (this.prevScreen === 'selectingCharacter') {
            this.hideElements();
            Carousel.Show();
        } else {
            this.hide();
        }
    });
    this.openGiftButton = this.ui.createSpriteFromSheet('open-gift.png', 'sprites/interface.png', 'sprites/interface.json');
    this.openGiftButton.width = 158;
    this.openGiftButton.height = 84;
    this.openGiftButton.anchor.x = ThreeUI.anchors.center;
    this.openGiftButton.anchor.y = ThreeUI.anchors.bottom;
    this.openGiftButton.pivot.y = 1;
    this.openGiftButton.y = 10;
    this.openGiftButton.visible = false;
    this.openGiftButton.defaultSprite = this.openGiftButton.assetPath;
    this.openGiftButton.blinkSprite = 'open-gift-blink.png';
    this.openGiftButton.onClick(this.openGift.bind(this));
    this.openGiftButton.navigateOnTop = () => {
        if (this.backButton._visible) {
            return this.backButton;
        }
        return null;
    };
    this.coinContainer = this.ui.createRectangle('rgba(0,0,0,0)');
    this.coinContainer.visible = false;
    this.coinContainer.anchor.x = ThreeUI.anchors.center;
    this.coinContainer.anchor.y = ThreeUI.anchors.center;
    this.coinText = this.ui.createBitmapText('120', baseCoinTextSize, 0, 0, 'fonts/8-bit-wonder-yellow.png', 'fonts/8-bit-wonder.json');
    this.coinText.anchor.x = ThreeUI.anchors.center;
    this.coinText.anchor.y = ThreeUI.anchors.center;
    this.coinText.parent = this.coinContainer;
    this.coinText.pivot.x = 0.5;
    this.coinText.pivot.y = 0.5;
    this.coinIcon = this.ui.createSpriteFromSheet('coin.png', 'sprites/interface.png', 'sprites/interface.json');
    this.coinIcon.parent = this.coinContainer;
    this.coinIcon.anchor.x = ThreeUI.anchors.center;
    this.coinIcon.anchor.y = ThreeUI.anchors.center;
    this.coinIcon.width = baseCoinIconSize;
    this.coinIcon.height = baseCoinIconSize;
    this.coinIcon.pivot.x = 0;
    this.coinIcon.pivot.y = 1;
    this.timeToGiftText = this.ui.createText('', 36, 'EditUndoBrk', '#fff');
    this.timeToGiftText.anchor.x = ThreeUI.anchors.center;
    this.timeToGiftText.anchor.y = ThreeUI.anchors.bottom;
    this.timeToGiftText.textAlign = 'center';
    this.timeToGiftText.textBaseline = 'middle';
    this.timeToGiftText.visible = false;
    this.timeToGiftText.lineHeight = 1.2;
    this.timeToGiftText.textVerticalAlign = 'bottom';
    this.playButton = this.ui.createSpriteFromSheet('play-wide.png', 'sprites/interface.png', 'sprites/interface.json');
    this.playButton.width = 158;
    this.playButton.height = 84;
    this.playButton.anchor.x = ThreeUI.anchors.center;
    this.playButton.anchor.y = ThreeUI.anchors.bottom;
    this.playButton.pivot.y = 1;
    this.playButton.y = 10;
    this.playButton.visible = false;
    this.playButton.defaultSprite = this.playButton.assetPath;
    this.playButton.blinkSprite = 'play-wide-blink.png';
    this.playButton.navigateOnTop = () => {
        if (this.backButton._visible) {
            return this.backButton;
        }
        return null;
    };
    this.playButton.onClick(() => {
        Interface.ButtonSound();
        this.hide();
        FreeGift.transformFreeGiftBarToTimeBar();
        GumballMachineScreen.showNotificationBar(true);
        Interface.setupEndScreenKeyboardNavigation();
        Interface.focusFirstNotificationBar();
    });
    this.backButton.navigateOnBottom = () => {
        if (this.openGiftButton._visible) {
            return this.openGiftButton;
        }
        if (this.playButton._visible) {
            return this.playButton;
        }
        return null;
    };
    this.timeToGiftText.y = this.playButton.y + this.playButton.height + 40;
    this.flashOverlay = this.ui.createRectangle('#fff');
    this.flashOverlay.stretch.x = true;
    this.flashOverlay.stretch.y = true;
    this.flashOverlay.offset.left = -10;
    this.flashOverlay.offset.top = -10;
    this.flashOverlay.offset.bottom = -10;
    this.flashOverlay.offset.right = -10;
    this.flashOverlay.visible = false;
    this.flashOutTween = new TWEEN.Tween(this.flashOverlay).to({
        alpha: 0
    }, 200).easing(TWEEN.Easing.Quadratic.InOut);
};
FreeGiftScreen.show = function () {
    Game.ambientLight.color = new THREE.Color(0.5, 0.5, 0.7);
    if (FreeGift.getTimeToGift() > 0 || this.visible) {
        return;
    }
    Game.audioManager.stopAllSounds();
    this.visible = true;
    this.openingGift = false;
    this.shakeGift = 0;
    this.prevScreen = Interface.CurrentScreen;
    this.prevCameraZoom = Game.camera.zoom;
    this.prevCameraPosition = Game.camera.position.clone();
    this.prevCameraRotation = Game.camera.rotation.clone();
    this.prevUIVisibilityState = Game.UI.getVisibilityState();
    Interface.CurrentScreen = 'free-gift';
    Game.camera.position.set(2.388232, 305.25858, 10.41098);
    Game.camera.rotation.set(-Math.PI / 8, 0, 0, 'YXZ');
    Game.camera.zoom = .8;
    Game.camera.updateProjectionMatrix();
    this.ui.hideAll();
    this.openGiftButton.visible = true;
    if (!Interface.tutorialLock) {
        this.backButton.visible = true;
    }
    this.reUsedElements.forEach(element => {
        element.visible = true;
    });
    this.activeGift = Utils.getRandomFromArray(this.giftMeshes);
    this.activeGift.visible = true;
    window.activeGift = this.activeGift;
    this.meshYScaleModifier = Utils.getRandomArbitrary(0.8, 1.15);
    this.meshXZScaleModifier = Utils.getRandomArbitrary(0.8, 1.1);
    this.updateTargetGiftScale();
    this.scaleActiveGift();
    this.fallTimer.Reset();
    this.fallWobbleTimer.Reset();
    this.hopTimer.Reset();
    KeyboardUIControls.setFocus(this.openGiftButton);
    Game.UI.MoveToFront(KeyboardUIControls.reticle);
    KeyboardHint.show('gift');
};
FreeGiftScreen.hide = function (...args) {
    const resetCamera = args.length > 0 && args[0] !== undefined ? args[0] : true;
    if (!this.prevCameraZoom) {
        return;
    }
    if (Game.currentWorld === 'space') {
        Game.ambientLight.color = new THREE.Color(0.3, 0.3, 0.6);
    }
    if (this.activeGift) {
        this.activeGift.visible = false;
    }
    if (resetCamera) {
        Game.camera.zoom = this.prevCameraZoom;
        Game.camera.position.set(this.prevCameraPosition.x, this.prevCameraPosition.y, this.prevCameraPosition.z);
        Game.camera.rotation.set(this.prevCameraRotation.x, this.prevCameraRotation.y, this.prevCameraRotation.z, 'YXZ');
        Game.camera.updateProjectionMatrix();
    }
    Interface.hideRemainingCoins();
    Interface.CurrentScreen = this.prevScreen;
    Game.UI.setVisibilityState(this.prevUIVisibilityState);
    this.visible = false;
    Interface.setupEndScreenKeyboardNavigation();
};
FreeGiftScreen.openGift = function () {
    if (this.openingGift) {
        return;
    }
    KeyboardHint.clearActiveScreen();
    KeyboardHint.hide();
    Game.playSfx('gift/openbox');
    Game.playSfx('gift/booktap');
    this.openTimer.Reset();
    this.openingGift = true;
    this.openGiftButton.visible = false;
    this.backButton.visible = false;
};
FreeGiftScreen.confirm = function () {
    if (this.openGiftButton.visible) {
        this.openGiftButton.fireEvent('click');
    } else if (this.playButton.visible) {
        this.playButton.fireEvent('click');
    }
};
FreeGiftScreen.updateTargetGiftScale = function () {
    if (!this.activeGift) {
        return;
    }
    const aspectRatio = this.canvas.width / this.canvas.height;
    const percLandscape = Utils.inverseLerp(window.minAspect, window.maxAspect, aspectRatio);
    const scale = THREE.Math.lerp(FreeGiftScreen.meshScalePortrait, FreeGiftScreen.meshScaleLandscape, percLandscape);
    this.targetGiftScale.set(scale * this.meshXZScaleModifier, scale * this.meshYScaleModifier, scale * this.meshXZScaleModifier);
};
FreeGiftScreen.update = function (deltaTime) {
    if (!this.textTimer.isFinished()) {
        this.textTimer.Tick(deltaTime);
        const coinTextScale = 1 + Easing.easeInOutCubic(this.textTimer.value) * 0.25;
        this.coinText.setScale(baseCoinTextSize * coinTextScale);
        this.coinIcon.width = baseCoinIconSize * coinTextScale;
        this.coinIcon.height = this.coinIcon.width;
        this.positionCoinElements();
    }
    if (!this.activeGift) {
        return;
    }
    this.hopTimer.Tick(deltaTime);
    this.fallTimer.Tick(deltaTime);
    this.fallWobbleTimer.Tick(deltaTime);
    this.openTimer.Tick(deltaTime);
    const hopDistance = giftHopHeight * Easing.easeOutQuad(this.fallTimer.value) + Easing.easeOutQuad(this.hopTimer.value);
    this.activeGift.position.y = this.meshYBasePosition + hopDistance;
    this.scaleActiveGift();
    if (this.hopTimer.reachedFinished() || this.fallTimer.reachedFinished()) {
        Game.playSfx('gift/booktap');
    }
    if (this.fallWobbleTimer.isFinished() && !this.openingGift) {
        this.hopTrigger -= deltaTime;
        if (this.hopTrigger < 0) {
            this.hopTimer.Reset();
            this.hopTrigger += Utils.getRandomArbitrary(3, 5);
        }
    }
    if (this.openingGift && this.openTimer.isFinished()) {
        this.awardGift();
    }
};
FreeGiftScreen.positionCoinElements = function () {
    this.coinIcon.x = this.coinText.width * 0.5;
    this.coinIcon.y = this.coinText.height * 0.5;
    this.coinContainer.x = -this.coinIcon.width * 0.5;
    this.coinContainer.x = -this.coinIcon.width * 0.5;
};
FreeGiftScreen.awardGift = function (reward) {
    if (FreeGift.getTimeToGift() > 0) {
        return;
    }
    var reward = FreeGift.getCurrentReward();
    this.coinText.setText(reward.toString());
    this.coinContainer.visible = true;
    this.coinText.visible = true;
    this.coinIcon.visible = true;
    this.positionCoinElements();
    this.activeGift.visible = false;
    this.activeGift = null;
    this.flashOverlay.alpha = 1;
    this.flashOverlay.visible = true;
    GameSave.ModifyCoins(reward);
    Interface.coinsWereModified();
    FreeGift.giftWasAwarded();
    window.setTimeout(() => {
        this.flashOutTween.start();
        this.textTimer.Reset();
        this.playButton.visible = true;
        this.timeToGiftText.visible = true;
        KeyboardHint.show('gift-given');
        KeyboardUIControls.setFocus(this.playButton);
        const timeToGift = FreeGift.getTimeToGift();
        this.timeToGiftText.text = FreeGift.timeToText(timeToGift);
        Game.playSfx('gift/Earn Points');
        this.confettiBlast(20);
        window.setTimeout(() => {
            if (!this.visible) {
                return;
            }
            this.confettiBlast(20);
        }, 200);
        window.setTimeout(() => {
            this.flashOverlay.alpha = 1;
            this.flashOverlay.visible = true;
            window.setTimeout(() => {
                this.flashOutTween.start();
                if (!this.visible) {
                    return;
                }
                Interface.coinBlast(reward);
            }, 100);
        }, 400);
    }, 100);
};
FreeGiftScreen.scaleActiveGift = function () {
    if (!this.activeGift) {
        return;
    }
    const fallWobbleScale = new THREE.Vector3(1, 1, 1).lerp(new THREE.Vector3(1.05, 0.95, 1.05), this.hopTimer.value + Easing.easeInOutCubic(this.fallWobbleTimer.value));
    const openTime = Easing.easeOutQuart(this.openTimer.value);
    const openScale = -openTime * 0.25 * THREE.Math.lerp(1, Utils.getRandomArbitrary(0.9, 1), openTime);
    const scale = fallWobbleScale.addScalar(openScale).multiply(this.targetGiftScale);
    this.activeGift.scale.set(scale.x, scale.y, scale.z);
};
FreeGiftScreen.resize = function () {
    this.updateTargetGiftScale();
    this.scaleActiveGift();
};
FreeGiftScreen.confettiBlast = function (amount) {
    
    const confettiSize = 50;
    const confettiParent = this.ui.createRectangle('rgba(0,0,0,0)');
    confettiParent.anchor.x = ThreeUI.anchors.center;
    confettiParent.anchor.y = ThreeUI.anchors.center;
    this.confettis = [];
    for (let confettiIdx = 0; confettiIdx < amount; confettiIdx++) {
        const confetti = this.ui.createRectangle('#ffee44');
        confetti.anchor.x = ThreeUI.anchors.center;
        confetti.anchor.y = ThreeUI.anchors.center;
        confetti.height = confettiSize * Utils.getRandomArbitrary(0.02, 0.4);
        confetti.width = confettiSize * Utils.getRandomArbitrary(0.8, 1);
        confetti.parent = confettiParent;
        confetti.rotation = Utils.getRandomInt(-50, 50);
        this.confettis.push(confetti);
        const direction = new THREE.Vector2(Utils.getRandomArbitrary(-1, 1), Utils.getRandomArbitrary(-1, 1)).normalize();
        confetti.x = Utils.getRandomArbitrary(20, 75) * direction.x;
        confetti.y = Utils.getRandomArbitrary(20, 75) * direction.y;
        const targetX = confetti.x + Utils.getRandomArbitrary(50, 250) * direction.x;
        const targetY = confetti.y + Utils.getRandomArbitrary(0, 150) * direction.y;
        const targetRotation = confetti.rotation * Utils.getRandomArbitrary(1.1, 1.3);
        new TWEEN.Tween(confetti).to({
            x: targetX,
            y: targetY,
            rotation: targetRotation
        }, 500).easing(TWEEN.Easing.Quartic.Out).onComplete(function () {
            FreeGiftScreen.removeConfetti(this);
        }).start();
    }
    new TWEEN.Tween(confettiParent).to({
        y: confettiParent.y + 50
    }, 500).onComplete(() => {
        this.ui.delete(confettiParent);
    }).easing(TWEEN.Easing.Quartic.In).delay(250).start();
};
FreeGiftScreen.removeConfetti = function (confetti) {
    const deleteConfetti = function (confetti) {
        this.ui.delete(confetti);
    }.bind(this, confetti);
    new TWEEN.Tween(confetti).to({
        width: 0,
        height: 0
    }, 200).onComplete(() => {
        deleteConfetti();
    }).start();
};
export default FreeGiftScreen;