import * THREE from 'three';

import * as AssetLoader from './AssetLoader';

import ThreeUI from './ThreeUI';
import Carousel from './Carousel';
import Easing from './Easing';
import Game from './Game';
import GameSave from './GameSave';
import Interface from './Interface';
import KeyboardHint from './KeyboardHint';
import KeyboardUIControls from './KeyboardUIControls';
import Localisation from './Localisation';
import PasrTimer from './PasrTimer';
import Utils from './Utils';
import * as ObjectPooler from './ObjectPooler'

const meshScalePortrait = 0.7;
const meshScaleLandscape = 0.7;
const meshYBasePosition = 197;
const prizeBallJiggle = 0.1;
let prizeBallEndPosition;;
let prizeBallTopExplodeTarget;
let prizeBallBottomExplodeTarget;
let vectorOne;
let prizeBallEndScale;
const GumballMachineScreen = {};
GumballMachineScreen.opportunitiesShowedSinceLastWatched = 0;
GumballMachineScreen.shakeNextBar = false;
GumballMachineScreen.init = function (ui, canvas, scene, camera, reUsedElements) {
    this.ui = ui;
    this.canvas = canvas;
    this.scene = scene;
    this.camera = camera;
    this.reUsedElements = reUsedElements;
    this.characterModels = [];
    this.targetMachineScale = new THREE.Vector3(1, 1, 1);
    this.updateTargetMachineScale();
    prizeBallEndPosition = new THREE.Vector3(7.5, 6, 7.52);
    prizeBallTopExplodeTarget = new THREE.Vector3(0, 4, 0);
    prizeBallBottomExplodeTarget = new THREE.Vector3(0, -4, 0);
    vectorOne = new THREE.Vector3(1, 1, 1);
    prizeBallEndScale = vectorOne.clone().multiplyScalar(3);
    this.timeToLeverTimer = new PasrTimer(1.5, 0, 1, 0);
    this.timeToJiggleTimer = new PasrTimer(1.5, 0, 1, 3.4);
    this.timeToPrizeEjectTimer = new PasrTimer(5.6, 0, 1, 0);
    this.timeToOpenPrizeTimer = new PasrTimer(7.5, 0, 1, 0);
    this.timeToResetTimer = new PasrTimer(8.5, 0, 1, 0);
    this.leverTimer = new PasrTimer(0, 0.3, 0.1, 0.6);
    this.prizeMoveTimer = new PasrTimer(0, 0, 1.2, 0.7);
    this.prizeBounceTimer = new PasrTimer(0, 0, 0, 0.4);
    this.prizeExplodeTimer = new PasrTimer(0, 0, 0.3, 0.4);
    this.createElements();
    this.createMachine();
    this.prepareCharacterModels();
};
GumballMachineScreen.createElements = function () {
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
        this.hide();
        if (this.prevScreen === 'selectingCharacter') {
            Carousel.Show();
        }
    });
    this.buyButton = this.ui.createSpriteFromSheet('purchase-wide.png', 'sprites/interface.png', 'sprites/interface.json');
    this.buyButton.width = 158;
    this.buyButton.height = 84;
    this.buyButton.anchor.x = ThreeUI.anchors.center;
    this.buyButton.anchor.y = ThreeUI.anchors.bottom;
    this.buyButton.pivot.y = 1;
    this.buyButton.y = 10;
    this.buyButton.visible = false;
    this.buyButton.defaultSprite = this.buyButton.assetPath;
    this.buyButton.blinkSprite = 'purchase-wide-blink.png';
    this.buyButton.onClick(this.buy.bind(this));
    this.buyButton.navigateOnTop = () => {
        if (this.backButton._visible) {
            return this.backButton;
        }
        return null;
    };
    this.characterNameText = this.ui.createText('', 48, 'EditUndoBrk', '#ffffff');
    this.characterNameText.y = 150;
    this.characterNameText.anchor.x = ThreeUI.anchors.center;
    this.characterNameText.anchor.y = ThreeUI.anchors.top;
    this.characterNameText.textAlign = 'center';
    this.characterNameText.visible = false;
    if (Localisation.userLang !== 'en') {
        this.characterNameText.size = 32;
    }
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
    this.playButton.onClick(this.playWithNewCharacter.bind(this));
    this.backButton.navigateOnBottom = () => {
        if (this.buyButton._visible) {
            return this.buyButton;
        }
        if (this.playButton._visible) {
            return this.playButton;
        }
        return null;
    };
    this.newCharacterText = this.ui.createText('', 48, 'EditUndoBrk', '#fff');
    this.newCharacterText.anchor.x = ThreeUI.anchors.center;
    this.newCharacterText.anchor.y = ThreeUI.anchors.bottom;
    this.newCharacterText.y = this.playButton.y + this.playButton.height + 20;
    this.newCharacterText.textAlign = 'center';
    this.newCharacterText.visible = false;
    if (Localisation.userLang !== 'en') {
        this.newCharacterText.size = 32;
    }
    this.flashOverlay = this.ui.createRectangle('#fff');
    this.flashOverlay.stretch.x = true;
    this.flashOverlay.stretch.y = true;
    this.flashOverlay.offset.left = -10;
    this.flashOverlay.offset.top = -10;
    this.flashOverlay.offset.bottom = -10;
    this.flashOverlay.offset.right = -10;
    this.flashOverlay.visible = false;
    this.confettiParent = this.ui.createRectangle('rgba(0,0,0,0)');
    this.confettiParent.stretch.x = true;
    this.confettiParent.stretch.y = true;
    this.confettiParent.visible = false;
    this.flashOutTween = new TWEEN.Tween(this.flashOverlay).delay(200).to({
        alpha: 0
    }, 200).easing(TWEEN.Easing.Quadratic.InOut);
};
GumballMachineScreen.createMachine = function () {
    this.machine = new THREE.Group();
    this.machine.position.set(2.4, meshYBasePosition, -2);
    this.machine.rotation.set(-0.05, -45 * Math.PI / 180, 0);
    this.scene.add(this.machine);
    this.machineBottom = ObjectPooler.importMesh('prize_machine_bottom', AssetLoader.loadedAssets['models/common-world.json'].models.prize_machine_bottom_vertex_optimised);
    this.machine.add(this.machineBottom);
    this.machineTop = ObjectPooler.importMesh('prize_machine_top', AssetLoader.loadedAssets['models/common-world.json'].models.prize_machine_top_vertex_optimised);
    this.machineTop.material = this.machineTop.material.clone();
    this.machineTop.material.transparent = true;
    this.machineTop.material.uniforms.transparency.value = 0.5;
    this.machineTop.position.y = 3.85;
    this.machineTop.alpha = 0.2;
    this.machine.add(this.machineTop);
    this.handlePivot = new THREE.Group();
    this.handlePivot.position.set(0.1, 2.82, 2.2);
    const handle = ObjectPooler.importMesh('prize_machine_handle', AssetLoader.loadedAssets['models/common-world.json'].models.prize_machine_handle_vertex_optimised);
    handle.rotation.y = 90 * Math.PI / 180;
    handle.position.set(0, -.25, .1);
    this.handlePivot.add(handle);
    this.machine.add(this.handlePivot);
    const ballTransforms = [{
        position: [0.97, 4.75, 0.84],
        rotation: [0, 10, 0]
    }, {
        position: [0.97, 6.2, 1.04],
        rotation: [0, -100, 0]
    }, {
        position: [0.9, 4.75, -1.1],
        rotation: [0, 75, 0]
    }, {
        position: [1, 6.9, -2],
        rotation: [0, -95, -90]
    }, {
        position: [-1, 4.5, 0.84],
        rotation: [0, 10, 0]
    }, {
        position: [-1.3, 6, 1],
        rotation: [0, -10, 0]
    }, {
        position: [-1, 5.8, -1],
        rotation: [0, -100, 0]
    }];
    this.balls = [];
    ballTransforms.forEach(({ position, rotation }) => {
        const ball = ObjectPooler.importMesh('prize_ball', AssetLoader.loadedAssets['models/common-world.json'].models.prize_ball_vertex_optimised);
        ball.position.set(position[0], position[1], position[2]);
        ball.rotation.set(rotation[0] * Math.PI / 180, rotation[1] * Math.PI / 180, rotation[2] * Math.PI / 180);
        ball.initialPosition = ball.position.clone();
        this.machine.add(ball);
        this.balls.push(ball);
    });
    this.prizeBall = new THREE.Group();
    this.prizeBall.position.set(1.5, 0.5, -0.08);
    this.prizeBall.visible = false;
    this.machine.add(this.prizeBall);
    this.prizeBallTop = ObjectPooler.importMesh('prize_ball_top', AssetLoader.loadedAssets['models/common-world.json'].models.prize_ball_top_vertex_optimised);
    this.prizeBallTop.startPosition = this.prizeBallTop.position.clone();
    this.prizeBall.add(this.prizeBallTop);
    prizeBallTopExplodeTarget.add(this.prizeBallTop.startPosition);
    this.prizeBallBottom = ObjectPooler.importMesh('prize_ball_bottom', AssetLoader.loadedAssets['models/common-world.json'].models.prize_ball_bottom_vertex_optimised);
    this.prizeBallBottom.startPosition = this.prizeBallBottom.position.clone();
    this.prizeBall.add(this.prizeBallBottom);
    prizeBallBottomExplodeTarget.add(this.prizeBallBottom.startPosition);
    this.prizeBall.startPosition = this.prizeBall.position.clone();
    this.bounceFromPosition = this.prizeBall.position.clone();
    this.bounceFromPosition.x = 0;
};
GumballMachineScreen.show = function () {
    Game.ambientLight.color = new THREE.Color(0.5, 0.5, 0.7);
    if (this.visible || !Carousel.hasEnoughCoinsForCharacter()) {
        return;
    }
    Game.audioManager.stopAllSounds();
    this.visible = true;
    this.prevScreen = Interface.CurrentScreen;
    this.prevCameraZoom = Game.camera.zoom;
    this.prevCameraPosition = Game.camera.position.clone();
    this.prevCameraRotation = Game.camera.rotation.clone();
    this.prevUIVisibilityState = Game.UI.getVisibilityState();
    this.camera.zoom = .8;
    this.camera.updateProjectionMatrix();
    Interface.CurrentScreen = 'gumball';
    this.unlockedCharacter = null;
    this.characterNameText.visible = false;
    this.newCharacterText.visible = false;
    this.playButton.visible = false;
    this.spinCharacter = false;
    this.jiggle = 0;
    this.machine.visible = true;
    this.showMachineParts();
    this.prizeBall.visible = false;
    this.prizeBall.position.set(this.prizeBall.startPosition.x, this.prizeBall.startPosition.y, this.prizeBall.startPosition.z);
    this.prizeBallTop.position.set(this.prizeBallTop.startPosition.x, this.prizeBallTop.startPosition.y, this.prizeBallTop.startPosition.z);
    this.prizeBallBottom.position.set(this.prizeBallBottom.startPosition.x, this.prizeBallBottom.startPosition.y, this.prizeBallBottom.startPosition.z);
    this.prizeBall.scale.setScalar(1);
    Game.camera.position.set(2.388232, 205.25858, 10.41098);
    Game.camera.rotation.set(-Math.PI / 8, 0, 0, 'YXZ');
    this.updateTargetMachineScale();
    this.scaleMachine();
    this.ui.hideAll();
    this.buyButton.visible = true;
    if (!Interface.tutorialLock) {
        this.backButton.visible = true;
    }
    this.reUsedElements.forEach(element => {
        element.visible = true;
    });
    KeyboardUIControls.setFocus(this.buyButton);
    Game.UI.MoveToFront(KeyboardUIControls.reticle);
    KeyboardHint.show('gumball');
};
GumballMachineScreen.updateTargetMachineScale = function () {
    if (!this.machine) {
        return;
    }
    const aspectRatio = this.canvas.width / this.canvas.height;
    const percLandscape = Utils.inverseLerp(window.minAspect, window.maxAspect, aspectRatio);
    const scale = THREE.Math.lerp(meshScalePortrait, meshScaleLandscape, percLandscape);
    this.targetMachineScale.setScalar(scale);
};
GumballMachineScreen.scaleMachine = function () {
    if (!this.machine) {
        return;
    }
    this.machine.scale.set(this.targetMachineScale.x, this.targetMachineScale.y, this.targetMachineScale.z);
};
GumballMachineScreen.showNotificationBar = function (skipDelay) {
    if (!Carousel.hasEnoughCoinsForCharacter() || Carousel.HowManyUnlocked().all) {
        return;
    }
    if (this.currentBar && this.currentBar.background._visible) {
        return;
    }
    GumballMachineScreen.opportunitiesShowedSinceLastWatched++;
    analytics.track('prize_machine', 'notification_shown');
    GumballMachineScreen.notificationClickSent = false;
    this.currentBar = Interface.notificationBar(Localisation.GetString("win-a-prize"), 'unlock', () => {
        if (!GumballMachineScreen.notificationClickSent) {
            analytics.track('prize_machine', 'notification_click');
        }
        GumballMachineScreen.notificationClickSent = true;
        GumballMachineScreen.opportunitiesShowedSinceLastWatched = 0;
        GumballMachineScreen.show();
    }, skipDelay);
    this.currentBar.shakeNextBar = GumballMachineScreen.shakeNextBar;
};
GumballMachineScreen.prepareCharacterModels = function () {
    const candidates = Carousel.GetRandomCharacterCandidates();
    const models = [];
    candidates.forEach(candidate => {
        if (candidate.char.mesh) {
            if (candidate.char.world === 'space') {
                candidate.idx -= Carousel.characters['original_cast'].length;
            }
            const model = ObjectPooler.importMesh(`Carousel.characters[${candidate.char.world}][${candidate.idx}`, candidate.char.mesh);
            model.position.set(2.4, 199, -2);
            model.rotation.y = 0.9;
            model.visible = false;
            model.scale.set(1.2, 1.2, 1.2);
            Game.scene.add(model);
            this.characterModels.push({
                idx: candidate.idx,
                world: candidate.char.world,
                model
            });
            models.push(model);
        }
    });
};
GumballMachineScreen.hideElements = function () {
    if (Game.currentWorld === 'space') {
        Game.ambientLight.color = new THREE.Color(0.3, 0.3, 0.6);
    }
    this.backButton.visible = false;
    this.buyButton.visible = false;
    this.characterNameText.visible = false;
    this.newCharacterText.visible = false;
    this.playButton.visible = false;
    this.flashOverlay.visible = false;
    this.confettiParent.visible = false;
    this.reUsedElements.forEach(element => {
        element.visible = false;
    });
    this.characterModels.forEach(({ model }) => {
        model.visible = false;
    });
    this.machine.visible = true;
};
GumballMachineScreen.hide = function () {
    if (this.prevCameraZoom) {
        this.hideElements();
        this.visible = false;
        Game.camera.zoom = this.prevCameraZoom;
        Game.camera.position.set(this.prevCameraPosition.x, this.prevCameraPosition.y, this.prevCameraPosition.z);
        Game.camera.rotation.set(this.prevCameraRotation.x, this.prevCameraRotation.y, this.prevCameraRotation.z, 'YXZ');
        Game.camera.updateProjectionMatrix();
        Interface.CurrentScreen = this.prevScreen;
        Game.UI.setVisibilityState(this.prevUIVisibilityState);
        Interface.setupEndScreenKeyboardNavigation();
    }
};
GumballMachineScreen.buy = function () {
    if (!Carousel.hasEnoughCoinsForCharacter()) {
        return;
    }
    if (!this.buyButton.visible) {
        return;
    }
    KeyboardHint.clearActiveScreen();
    KeyboardHint.hide();
    if (this.currentBar) {
        this.currentBar.background.visible = false;
    }
    if (Carousel.HowManyUnlocked().number === 1) {
        analytics.track('game_onboarding', 'first_prize_unlocked');
    }
    analytics.track('prize_machine', 'opened');
    Interface.ButtonSound();
    this.buyButton.visible = false;
    this.backButton.visible = false;
    this.timeToLeverTimer.Reset();
    this.timeToJiggleTimer.Reset();
    this.timeToPrizeEjectTimer.Reset();
    this.timeToOpenPrizeTimer.Reset();
    this.timeToResetTimer.Reset();
    for (let i = 0; i < 5; i++) {
        window.setTimeout(() => {
            Game.playSfx(Utils.getRandomFromArray(['prize/SlotMachineInsert', 'prize/Inserting-Coin-Into-Machine-v1', 'prize/Inserting-Coin-Into-Machine-v2', 'prize/Inserting-Coin-Into-Machine-v3', 'prize/Inserting-Coin-Into-Machine-v4', 'prize/coininsert3']));
        }, Utils.getRandomArbitrary(0, 600));
    }
    Game.playSfx('prize/insert-coin');
    Game.playSfx('prize/counting-of-money-short');
};
GumballMachineScreen.update = function (deltaTime) {
    if (this.spinCharacter) {
        this.characterModels.forEach(({ idx, model }) => {
            if (idx === this.unlockedCharacter.idx) {
                model.rotation.y -= deltaTime;
            }
        });
    }
    this.timerEvents(deltaTime);
    this.timerAnimations(deltaTime);
};
GumballMachineScreen.timerEvents = function (deltaTime) {
    if (this.timeToResetTimer.isFinished()) {
        return;
    }
    this.timeToLeverTimer.Tick(deltaTime);
    this.timeToJiggleTimer.Tick(deltaTime);
    this.timeToPrizeEjectTimer.Tick(deltaTime);
    this.timeToOpenPrizeTimer.Tick(deltaTime);
    this.timeToResetTimer.Tick(deltaTime);
    if (this.timeToJiggleTimer.reachedSustain()) {
        this.jiggle = prizeBallJiggle;
        Game.playSfx('prize/Prize-Wheel');
        Game.playSfx('prize/casinomachine');
    } else if (this.timeToJiggleTimer.isFinished()) {
        this.jiggle = Math.max(0, this.jiggle - deltaTime * 0.2);
    }
    if (this.timeToLeverTimer.reachedSustain()) {
        Game.playSfx('prize/play-slots-machine');
        this.leverTimer.Reset();
    }
    if (this.timeToPrizeEjectTimer.reachedSustain()) {
        Game.playSfx('prize/clickball');
        this.prizeBall.visible = true;
        this.prizeMoveTimer.Reset();
        this.prizeBounceTimer.Reset();
    }
    if (this.timeToOpenPrizeTimer.reachedSustain()) {
        this.prizeExplodeTimer.Reset();
        this.hideMachineParts();
        this.showUnlockedCharacter();
    }
    if (this.timeToResetTimer.reachedSustain()) {
        if (!Interface.tutorialLock) {
            this.backButton.visible = true;
        }
        this.playButton.visible = true;
        KeyboardHint.show('gumball');
        KeyboardUIControls.setFocus(this.playButton);
    }
};
GumballMachineScreen.timerAnimations = function (deltaTime) {
    if (this.jiggle > 0) {
        this.balls.forEach(({ initialPosition, position }) => {
            const jiggleVector = new THREE.Vector3(Utils.getRandomArbitrary(-this.jiggle, this.jiggle), Utils.getRandomArbitrary(-this.jiggle, this.jiggle), Utils.getRandomArbitrary(-this.jiggle, this.jiggle));
            const newPosition = initialPosition.clone().add(jiggleVector);
            position.set(newPosition.x, newPosition.y, newPosition.z);
        });
    }
    if (!this.leverTimer.isFinished()) {
        this.leverTimer.Tick(deltaTime);
        const percLevered = Easing.easeInOutSin(this.leverTimer.value);
        this.handlePivot.rotation.z = percLevered * -90 * Math.PI / 180;
    }
    if (!this.prizeMoveTimer.isFinished() || !this.prizeBounceTimer.isFinished()) {
        this.prizeMoveTimer.Tick(deltaTime);
        this.prizeBounceTimer.Tick(deltaTime);
        const prizeBounce = Easing.easeOutBounce(1 - this.prizeBounceTimer.value);
        const prizeTick = Easing.easeOutQuart(1 - this.prizeMoveTimer.value);
        const bounceMove = this.bounceFromPosition.clone().lerp(this.prizeBall.startPosition, prizeBounce);
        const ballMove = bounceMove.lerp(prizeBallEndPosition, prizeTick);
        this.prizeBall.position.set(ballMove.x, ballMove.y, ballMove.z);
        const newScale = vectorOne.clone().lerp(prizeBallEndScale, prizeTick);
        this.prizeBall.scale.set(newScale.x, newScale.y, newScale.z);
    }
    if (this.prizeExplodeTimer.GetStage() !== 4) {
        this.prizeExplodeTimer.Tick(deltaTime);
        const explodeTick = Easing.easeOutQuart(1 - this.prizeExplodeTimer.value);
        const newTopPosition = this.prizeBallTop.startPosition.clone().lerp(prizeBallTopExplodeTarget, explodeTick);
        const newBottomPosition = this.prizeBallBottom.startPosition.clone().lerp(prizeBallBottomExplodeTarget, explodeTick);
        this.prizeBallTop.position.set(newTopPosition.x, newTopPosition.y, newTopPosition.z);
        this.prizeBallBottom.position.set(newBottomPosition.x, newBottomPosition.y, newBottomPosition.z);
    }
};
GumballMachineScreen.hideMachineParts = function () {
    this.machineTop.visible = false;
    this.machineBottom.visible = false;
    this.handlePivot.visible = false;
    this.balls.forEach(ball => {
        ball.visible = false;
    });
};
GumballMachineScreen.showMachineParts = function () {
    this.machineTop.visible = true;
    this.machineBottom.visible = true;
    this.handlePivot.visible = true;
    this.balls.forEach(ball => {
        ball.visible = true;
    });
};
GumballMachineScreen.showUnlockedCharacter = function () {
    this.unlockedCharacter = Carousel.UnlockRandomCharacter();
    const numUnlocked = Carousel.HowManyUnlocked().number - 1;
    const unlockedName = Localisation.GetString(Object.keys(Game.characters)[this.unlockedCharacter.idx]);
    analytics.track('character_unlocked', unlockedName, numUnlocked, numUnlocked);
    PokiSDK.customEvent("unlock", "character", {
        name: unlockedName
    });
    Game.playSfx('prize/UnlockPlain');
    this.flashOverlay.alpha = 1;
    this.flashOverlay.visible = true;
    let characterModel;
    if (Game.characters[Object.keys(Game.characters)[this.unlockedCharacter.idx]].world === 'space') {
        this.unlockedCharacter.idx -= Carousel.characters['original_cast'].length;
        var world = 'space';
    } else {
        var world = 'original_cast';
    }
    this.unlockedCharacter.world = world;
    this.characterModels.forEach(character => {
        const idx = character.idx;
        if (idx === this.unlockedCharacter.idx) {
            if (world === character.world) {
                character.idx = idx;
                characterModel = character.model;
            }
        }
    });
    this.characterNameText.text = unlockedName;
    this.characterNameText.visible = true;
    this.newCharacterText.text = this.unlockedCharacter.hasCharacter ? Localisation.GetString('duplicate') : Localisation.GetString('new');
    this.newCharacterText.visible = true;
    this.flashOutTween.start();
    characterModel.rotation.y = 0.9;
    characterModel.material.uniforms.saturation.value = 1;
    characterModel.visible = true;
    characterModel.scale.set(0.5, 0.5, 0.5);
    new TWEEN.Tween(characterModel.scale).to({
        x: 2.5,
        y: 2.5,
        z: 2.5
    }, 500).start();
    new TWEEN.Tween(characterModel.rotation).to({
        y: -15
    }, 2000).easing(TWEEN.Easing.Quadratic.Out).onComplete(() => {
        this.spinCharacter = true;
        new TWEEN.Tween(characterModel.scale).to({
            x: 2,
            y: 2,
            z: 2
        }, 500).start();
    }).start();
    if (!this.unlockedCharacter.hasCharacter) {
        Game.playSfx('prize/prizewinner');
        window.setTimeout(this.confettiBlast.bind(this), 200);
    }
};
GumballMachineScreen.showUnlockedSpecialCharacter = function (name, idx) {
    const numUnlocked = Carousel.HowManyUnlocked().number - 1;
    const unlockedCharName = name;
    this.unlockedCharacter = Game.characters[unlockedCharName];
    const unlockedName = this.unlockedCharacter.mesh.fullName.toLowerCase().replace(/ +/, '_');
    analytics.track('character_unlocked', unlockedName, numUnlocked, numUnlocked);
    Game.playSfx('prize/UnlockPlain');
    this.flashOverlay.alpha = 1;
    this.flashOverlay.visible = true;
    this.specialCharacterModel = ObjectPooler.importMesh(`characters[${unlockedCharName}`, this.unlockedCharacter.mesh);
    this.unlockedCharacter.idx = idx - Carousel.characters['original_cast'].length;
    this.specialCharacterModel.position.set(Game.camera.position.x, Game.camera.position.y, Game.camera.position.z);
    this.specialCharacterModel.rotation.y = 0.9;
    this.specialCharacterModel.visible = true;
    this.specialCharacterModel.scale.set(1.2, 1.2, 1.2);
    Game.scene.add(this.specialCharacterModel);
    this.characterNameText.text = unlockedName;
    this.characterNameText.visible = true;
    this.flashOutTween.start();
    this.specialCharacterModel.rotation.y = 0.9;
    this.specialCharacterModel.material.uniforms.saturation.value = 1;
    this.specialCharacterModel.visible = true;
    this.specialCharacterModel.scale.set(0.5, 0.5, 0.5);
    new TWEEN.Tween(this.specialCharacterModel.scale).to({
        x: 2.5,
        y: 2.5,
        z: 2.5
    }, 500).start();
    new TWEEN.Tween(this.specialCharacterModel.rotation).to({
        y: -15
    }, 2000).easing(TWEEN.Easing.Quadratic.Out).onComplete(() => {
        this.spinCharacter = true;
        new TWEEN.Tween(this.specialCharacterModel.scale).to({
            x: 2,
            y: 2,
            z: 2
        }, 500).start();
    }).start();
};
GumballMachineScreen.playWithNewCharacter = function () {
    Interface.ButtonSound();
    AssetLoader.lastRequestedWorld = this.unlockedCharacter.world;
    if (this.unlockedCharacter.char) {
        var model = ObjectPooler.importMesh(`Carousel.characters[${this.unlockedCharacter.world}][${this.unlockedCharacter.idx}`, this.unlockedCharacter.char.mesh, false, true);
    } else {
        var model = ObjectPooler.importMesh(`Carousel.characters[${this.unlockedCharacter.world}][${this.unlockedCharacter.idx}`, this.unlockedCharacter.mesh, false, true);
    }
    Game.scene.add(model);
    model.position.set(0, 0, 2);
    if (this.unlockedCharacter.world === 'space') {
        this.unlockedCharacter.idx += Carousel.characters['original_cast'].length;
    }
    Game.playerController.setCharacter(model, Game.characters[Object.keys(Game.characters)[this.unlockedCharacter.idx]].mesh.charName);
    GameSave.SelectCharacter(this.unlockedCharacter.idx);
    this.visible = false;
    if (!GameSave.specialCharacterUnlocked) {
        Game.wipeAndRestart(() => {
            this.hideElements();
            Game.SetWorld(this.unlockedCharacter.world);
        });
    } else {
        this.hideElements();
        Game.SetWorld(this.unlockedCharacter.world);
    }
};
GumballMachineScreen.confirm = function () {
    if (this.buyButton.visible) {
        this.buyButton.fireEvent('click');
    } else if (this.playButton.visible) {
        this.playButton.fireEvent('click');
    }
};
GumballMachineScreen.resize = function () {
    this.updateTargetMachineScale();
    this.scaleMachine();
};
GumballMachineScreen.confettiSize = 20;
GumballMachineScreen.removeConfetti = function (confetti) {
    this.ui.delete(confetti);
};
GumballMachineScreen.confettiBlast = function () {
    
    this.confettis = [];
    this.confettiParent.visible = true;
    for (let coinIdx = 0; coinIdx < 50; coinIdx++) {
        const color = Utils.hslToRgb(Math.random(), 1, Utils.getRandomArbitrary(0.3, 0.7));
        const confetti = this.ui.createRectangle(`rgb(${color[0]},${color[1]},${color[2]})`);
        confetti.anchor.x = ThreeUI.anchors.left;
        confetti.anchor.y = ThreeUI.anchors.top;
        confetti.x = Utils.getRandomInt(0, this.ui.width);
        confetti.y = -50;
        confetti.height = GumballMachineScreen.confettiSize;
        confetti.width = GumballMachineScreen.confettiSize * 1.2;
        confetti.parent = this.confettiParent;
        this.confettis.push(confetti);
        const targetX = confetti.x + Utils.getRandomInt(-100, 100);
        const targetY = this.ui.height + 50;
        new TWEEN.Tween(confetti).to({
            x: targetX,
            y: targetY,
            rotation: Utils.getRandomInt(0, 360),
            width: GumballMachineScreen.confettiSize
        }, 1000).easing(TWEEN.Easing.Sinusoidal.InOut).delay(200 * coinIdx - 200 * coinIdx * 0.5 * Math.random()).onUpdate(function () {
            this.height = this.width;
        }).onComplete(function () {
            GumballMachineScreen.removeConfetti(this);
        }).start();
    }
};
GumballMachineScreen.hideUnlockedSpecialCharacter = function () {
    if (!this.specialCharacterModel || !this.characterNameText) {
        return;
    }
    this.specialCharacterModel.visible = false;
    this.characterNameText.visible = false;
};
export default GumballMachineScreen;