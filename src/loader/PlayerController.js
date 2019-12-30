import * as THREE from 'three';

import AppStoreInterstitial from './AppStoreInterstitial';
import Carousel from './Carousel';
import CharacterTryouts from './CharacterTryouts';
import Easing from './Easing';
import FreeGift from './FreeGift';
import Game from './Game';
import GameSave from './GameSave';
import GumballMachineScreen from './GumballMachineScreen';
import Interface from './Interface';
import KeyboardHint from './KeyboardHint';
import Localisation from './Localisation';
import MetaHelper from './MetaHelper';
import ParticleSystem from './ParticleSystem';
import PasrTimer from './PasrTimer';
import Physics from './Physics';
import RewardedHelper from './RewardedHelper';
import ScreenFlash from './ScreenFlash';
import Storage from './Storage';
import WaterParticleSystem from './WaterParticleSystem';


class PlayerController {

    roundIdx = 1;
    IsMoving = false;
    hopDelay = 0.15;
    hopDistance = 1;
    currentCharacter = null;
    startGameWobble = true;
    playerWidth = 0.29;
    playerDepth = 0.52;
    rotatePasr = new PasrTimer(0, 0, 0, 0.4);
    hopPasr = new PasrTimer(0, 0.07, 0, 0.12);
    hopPasrEased = 0;
    movePasr = new PasrTimer(0, 0, 0, 0.4);
    vectorOne = new THREE.Vector3(1, 1, 1);
    hasMoved = false;
    hasMovedThisRound = false;
    drownPasr = new PasrTimer(0, 0, 0, 1);
    dipPasr = new PasrTimer(0.01, 0.1, 0.17, 0.1);
    drownParticles = new WaterParticleSystem(70, 0x449EFF, new THREE.Vector3(60, 60, 60), 1.9, 0.3, 0.9, new THREE.Vector3(0, 1.5, 0), null, null, true);
    chickenParticles;
    robotParticles;
    spaceChickenParticles;
    splatPasr = new PasrTimer(0, 0, 0, 0.1);
    spreadPasr = new PasrTimer(0, 0, 0, 1.0);
    cutePasr = new PasrTimer(0, 0.4, 0, 0.4);
    pushPasr = new PasrTimer(0, 0.03, 0, 0.12);
    scaleVector = new THREE.Vector3(1, 1, 1);
    deadScale = new THREE.Vector3(1.2, 0.7, 1.1);
    movePasrVector = new THREE.Vector3(1, 1, 1);
    hopHeight = 0.5;
    heightOffset = 0.375;
    hopTimer = 0;
    cameraMoveOnEagleZ = 6;
    DeathCamPosition = new THREE.Vector3(2.388232, 10.25858, 10);
    desiredMeshScale = new THREE.Vector3(1, 1, 1);
    lerpingMeshScale = new THREE.Vector3(1, 1, 1);
    lerpingMeshOffset = new THREE.Vector3(1, 1, 1);
    lerpingMeshRotation = new THREE.Vector3(1, 1, 1);
    directionRightEuler = new THREE.Euler(0, Math.PI / 2, 0);
    directionLeftEuler = new THREE.Euler(0, 3 * Math.PI / 2, 0);
    directionForwardEuler = new THREE.Euler(0, Math.PI, 0);
    directionBackEuler = new THREE.Euler(0, 0, 0);
    nextPlayerAction = "none";
    Dead = false;
    deathType = "none";
    drownTest = false;
    killerCar = null;
    killerTrain = null;
    waitingForEagle = false;
    killerXOffset = 0;
    playingRiverAmbience = false;
    rightIsBlocked = false;
    leftIsBlocked = false;
    forwardIsBlocked = false;
    backIsBlocked = false;
    bumped = 0;
    eagleCountdown = 0;
    lastKill = "";
    killTime = 0;
    onLily = null;
    spaceWalkerTimer = 0;
    spaceWalkerAnimations = [];
    
    constructor(character) {
        this.player = character;
        this.cutePasr.Reset();
        this.targetPosition = new THREE.Vector3(0, this.heightOffset, 2);
        this.previousPosition = new THREE.Vector3(0, this.heightOffset, 2);
        this.desiredDirection = character.quaternion.clone();
        this.setUpCharacterParticles(GameSave.GetCurrCharacter());
    }

    deathParts() {
        if (GameSave.GetCurrCharacter() == 'chicken') {
            this.chickenParticles.emit(500);
        } else if (GameSave.GetCurrCharacter() == 'robot') {
            this.robotExplode();
        }
    }
    
    robotExplode() {
        this.robotParticles.reset(this.player.position.x, 0.5, this.player.position.z);
        this.robotParticles.play();
        this.screenFlash.play();
    }

    kill(reason) {
        PokiSDK.roundEnd(Game.currentWorld === 'original_cast' ? 'original' : Game.currentWorld);
        Game.deathsSinceLastCharacterUnlock++;
        Storage.setItem('deathsSinceLastCharacterUnlock', Game.deathsSinceLastCharacterUnlock);
        if (!Storage.getItem('first_round_finished')) {
            analytics.track('game_onboarding', 'first_round_finished');
            Storage.setItem('first_round_finished', true);
        }
        analytics.track('game_play', 'round_finished', this.roundIdx, this.roundIdx);
        analytics.track('game_play', 'game_over', reason, Game.score);
        this.onLily = null;
        Interface.HideHint();
        if (this.Dead) {
            return;
        } else {
            this.lastKill = reason;
            this.killTime = Date.now();
        }
        Interface.pauseBtn.visible = false;
        this.Dead = true;
        switch (this.deathType = reason) {
            case "tooslow":
                Game.playSfx('hawk-screech-02');
                break;
            case "ufo":
                Game.playSfx('UFO_Pickup');
                break;
            case "water":
                if (Game.currentWorld === 'original_cast') {
                    Game.playRandomSfx(['watersplash', 'watersplashlow']);
                } else if (Game.currentWorld === 'space') {
                    Game.playRandomSfx(['default_death1', 'default_death2']);
                }
                break;
            case "log":
                if (Game.currentWorld === 'original_cast') {
                    Game.playRandomSfx(['rapidsdeath3', 'rapidsdeath9']);
                } else if (Game.currentWorld === 'space') {
                    Game.playSfx('LeaveScreen_On_Asteroid');
                }
                break;
            case "car":
                if (GameSave.GetCurrCharacter() == 'chicken') {
                    Game.playSfx(['carsquish3']);
                } else {
                    Game.playRandomSfx(['carsquish', 'carsquish3']);
                }
                this.player.rotation.set(0, Math.random() * (Math.PI / 2) - Math.PI / 4, 0);
                break;
            case "carside":
                Game.playSfx('carhit');
                this.player.rotation.set(0, Math.PI, Math.random() * (Math.PI / 2) - Math.PI / 4);
                break;
            case "train":
                Game.playSfx('trainsplat');
                this.player.rotation.set(0, Math.random() * (Math.PI / 2) - Math.PI / 4, 0);
                break;
            case "trainside":
                Game.playSfx('trainsplat');
                this.player.rotation.set(0, 0, 0);
                break;
        }
        if (reason === "tooslow" || reason === "ufo") {
            this.eagleCountdown = .4;
            this.waitingForEagle = true;
        } else if (typeof this.currentCharacter.death !== 'undefined') {
            this.deathParts();
            Game.playRandomSfx(this.currentCharacter.death);
        }
        Interface.CurrentScreen = "death";
        Interface.showMore.visible = false;
        Interface.characterSelect.visible = false;
        Interface.topScore.visible = true;
        Interface.barContainer.visible = true;
        this.drownPasr.Reset();
        this.playingRiverAmbience = false;
        this.bumped = 0;
        const adRand = Math.random();
        const featuresToShow = MetaHelper.getFeaturesByRound(this.roundIdx);
        for (let idx = 0; idx < featuresToShow.length; idx++) {
            const feature = featuresToShow[idx];
            if (feature.key === 'upsell-interstitial') {
                AppStoreInterstitial.lastUpsellScreen = 'game_over_interstitial';
                AppStoreInterstitial.show();
            }
            if (feature.key === 'upsell-notification') {
                AppStoreInterstitial.lastUpsellScreen = 'game_over_interstitial';
                AppStoreInterstitial.show();
            }
            if (feature.key === 'rewarded') {
                RewardedHelper.showRewardedOpportunity();
            }
            if (feature.key === 'tryout-characters') {
                Interface.notificationBar(null, 'tryout-characters');
            }
            if (feature.key === 'tryout-buy') {
                var actualRoundsLeft = CharacterTryouts.roundsLeft - 1;
                Interface.notificationBar(null, 'tryout-buy');
                var text;
                if (actualRoundsLeft > 0) {
                    text = `${actualRoundsLeft} round ${actualRoundsLeft !== 1 ? 's' : ''}left`;
                } else {
                    text = 'last chance to buy';
                }
                Interface.notificationBar(text, 'tryout-rounds-left');
            }
            if (feature.key === 'tryout-app-store') {
                Interface.notificationBar(null, 'tryout-app-store');
            }
            if (feature.key === 'free-gift') {
                FreeGift.notificationBar();
            }
            if (feature.key === 'tryout-app-store-promo') {
                var actualRoundsLeft = CharacterTryouts.roundsLeft - 1;
                if (actualRoundsLeft >= 0) {
                    Interface.notificationBar(null, 'tryout-app-store-promo');
                    if (actualRoundsLeft > 0) {
                        Interface.notificationBar(`${actualRoundsLeft} round${actualRoundsLeft !== 1 ? 's' : ''} left`, 'tryout-rounds-left');
                    }
                }
            }
            if (feature.key === 'coins-to-go') {
                let cost = Carousel.charactCost - GameSave.GetCoins();
                if (cost < 10) {
                    cost = ` ${cost}`;
                }
                if (cost.toString().includes('1')) {
                    cost = ` ${cost}`;
                }
                var text = Localisation.GetString('coins-to-go').replace('XXX', cost);
                Interface.notificationBar(text, 'coinstogo');
            }
            if (feature.key === 'unlock-new') {
                GumballMachineScreen.showNotificationBar();
            }
        }
        PokiSDK.gameplayStop();
        CharacterTryouts.roundEnded();
        Carousel.roundEnded();
        Interface.setupEndScreenKeyboardNavigation();
        this.roundIdx++;
    }
    setCharacter(character, charName) {
        
        Game.scene.remove(this.player);
        this.currentCharacter = Game.characters[charName];
        this.currentCharacterName = charName;
        this.player = character;
        if (charName === 'space_chicken_carousel' || charName === 'space_chicken') {
            const glass = _ObjectPooler.importMesh('Carousel.characters[undefined][1', Carousel.characters[undefined][1]);
            glass.scale.set(1.01, 1.01, 1.01);
            glass.material.transparent = true;
            glass.material.uniforms.transparency.value = 0.7;
            glass.material.uniforms.saturation.value = 1.0;
            glass.material.uniforms.GREY_COLOR.value = this.vectorOne;
            this.player.add(glass);
        }
        if (charName === 'space_walker') {
            this.spaceWalkerAnimations[0].material.uniforms.saturation.value = 1;
            for (let i = 1; i < 9; ++i) {
                this.spaceWalkerAnimations.push(_ObjectPooler.importMesh(`Carousel.characters[undefined][${(i + 1).toString()}`));
                this.spaceWalkerAnimations[i].material.uniforms.saturation.value = 1;
            }
        }
        this.desiredMeshScale.set(1, 1, 1);
        this.desiredDirection.set(character.rotation);
        this.lerpingMeshScale.set(1, 1, 1);
        this.lerpingMeshOffset.set(1, 1, 1);
        this.lerpingMeshRotation.set(1, 1, 1);
        this.setUpCharacterParticles(charName);
        this.setUpLight(charName);
        Game.scene.add(this.player);
        this.player.position.set(this.targetPosition.x, this.targetPosition.y, this.targetPosition.z);
    }
    setUpLight(charName) {
        switch (charName) {
            case 'space_walker':
                {
                    Game.sun.castShadow = false;
                    for (var i = 0; i < Game.scene.children.length; ++i) {
                        if (Game.scene.children[i].material && Game.scene.children[i].material.uniforms) {
                            Game.scene.children[i].material.uniforms['dirLight'].value.y = -1;
                            Game.scene.children[i].material.uniforms['fillLight'].value.y = -1;
                        }
                    }
                    for (var i = 0; i < Object.keys(Game.objectPooler.items).length; ++i) {
                        if (Object.keys(Game.objectPooler.items)[i].includes('space') && !Object.keys(Game.objectPooler.items)[i].includes('space-blocking') && !Object.keys(Game.objectPooler.items)[i].includes('space-vehicle-car')) {
                            for (let j = 0; j < Game.objectPooler.items[Object.keys(Game.objectPooler.items)[i]].length; ++j) { }
                        }
                    }
                    break;
                }
            default:
                { }
        }
        switch (Game.currentWorld) {
            case 'original_cast':
                {
                    Game.ambientLight.color = new THREE.Color(0.5, 0.5, 0.7);
                    break;
                }
            case 'space':
                {
                    Game.ambientLight.color = new THREE.Color(0.3, 0.3, 0.6);
                    break;
                }
        }
    }
    setUpCharacterParticles(charName) {
        if (charName == 'chicken' && this.chickenParticles == null) {
            this.chickenParticles = new ParticleSystem(500, 0xFFFFFF, new THREE.Vector3(60, 60, 60), 0.4, 0.02, 1.6, new THREE.Vector3(3.5, 2, -3), new THREE.BoxGeometry(0.1, 0.0000001, 0.02), null, false, -1, 10.0, this.player, 0.001);
            this.chickenParticles.setRotationSpeed(3);
        }
        if (charName == 'robot' && this.robotParticles == null) {
            this.robotParticles = new ParticleSystem(20, 0x777777, new THREE.Vector3(60, 60, 60), 0.8, 0.2, 3.6, new THREE.Vector3(0, 6, -0.5), new THREE.BoxGeometry(0.2, 0.2, 0.2), null, true);
            this.robotParticles.setColourRange(0xFFFFFF, 0x000000);
            this.screenFlash = new ScreenFlash();
        }
        if (charName == 'space_chicken_carousel' || charName == 'astronaut' || charName === 'space_chicken') {
            this.spaceChickenParticles = new ParticleSystem(50, 0xFFFFFF, new THREE.Vector3(60, 60, 60), 1, -0.2, 1, new THREE.Vector3(0, 3, 3), new THREE.BoxGeometry(.1, 0.1, 0.1), null, true, -1, 0.6, this.player, 0.01);
        }
    }
    SetDesiredRotationForDirection(direction) {
        if (direction === "right") {
            this.desiredDirection.setFromEuler(this.directionRightEuler);
        }
        if (direction === "left") {
            this.desiredDirection.setFromEuler(this.directionLeftEuler);
        }
        if (direction === "forward") {
            this.desiredDirection.setFromEuler(this.directionForwardEuler);
        }
        if (direction === "back") {
            this.desiredDirection.setFromEuler(this.directionBackEuler);
        }
        this.rotatePasr.Reset();
    }
    Bumped() {
        KeyboardHint.switch('movement-hint');
        this.bumped++;
        if (this.bumped > 2) {
            Interface.ShowHint();
        }
    }
    Update(deltaTime) {
        if (Game.currentWorld === 'space' && Game.space_background) {
            Game.space_background.position.set(Game.space_background.position.x, Game.space_background.position.y, THREE.Math.lerp(Game.space_background.position.z, this.player.position.z - 10, deltaTime));
        }
        if (this.hopTimer > 0) {
            this.hopTimer -= deltaTime;
        } else {
            this.IsMoving = false;
            this.hopTimer = 0;
        }
        if (!this.hopPasr.isFinished()) {
            this.hopPasrEased = Easing.easeOutQuad(this.hopPasr.Tick(deltaTime));
            if (this.drownTest && this.hopPasr.isFinished()) {
                if (this.CheckWaterObjects(deltaTime)) {
                    this.kill("water");
                    return;
                }
                this.drownTest = false;
            }
        }
        this.drownPasr.Tick(deltaTime);
        this.dipPasr.Tick(deltaTime);
        if (this.startGameWobble) {
            this.cutePasr.Tick(deltaTime);
            if (this.cutePasr.isFinished()) {
                this.desiredMeshScale.set(1, 1, 1);
                this.cutePasr.Reset();
            }
            if (this.cutePasr.reachedSustain()) {
                this.desiredMeshScale.set(1.1, 0.9, 1.1);
            }
        }
        if (!this.Dead) {
            if (!this.rotatePasr.isFinished()) {
                this.player.quaternion.slerp(this.desiredDirection, 1 - Easing.easeOutQuad(this.rotatePasr.Tick(deltaTime * 5)));
            }
        }
        const midHopSquish = this.hopPasrEased / this.player.height * 0.5;
        this.scaleVector.set(midHopSquish * 0.1, -midHopSquish * 0.4, 0);
        this.desiredMeshScale = this.desiredMeshScale.multiply(this.lerpingMeshScale);
        this.scaleVector.add(this.desiredMeshScale);
        let dt = 15 * deltaTime;
        dt = Math.min(0.5, dt);
        if (deltaTime <= 0) {
            this.player.scale = this.scaleVector;
        } else {
            this.player.scale.lerp(this.scaleVector, dt);
        }
        this.targetPosition.y = this.hopPasrEased * this.hopHeight - this.dipPasr.GetValue() * 0.2;
        if (this.currentCharacter.mesh.charName == 'snail') {
            this.targetPosition.y = -(this.dipPasr.GetValue() * 0.2);
        } else if (this.currentCharacter.mesh.charName == 'rover' || this.currentCharacter.mesh.charName == 'robot_dog' || this.currentCharacter.mesh.charName == 'space_walker') {
            this.targetPosition.y = this.dipPasr.GetValue() * 0.2;
        }
        if (this.onLily != null) {
            const dy = this.onLily.shiftY();
            this.targetPosition.y += dy - 0.3;
        }
        if (this.currentCharacter.mesh.charName.includes('space_walker') && Game.currentWorld === 'space' && !this.Dead) {
            this.spaceWalkerTimer += deltaTime * 2;
            const h = this.player.height;
            Game.scene.remove(this.player);
            if (Math.floor(this.spaceWalkerTimer) === 8) {
                this.spaceWalkerTimer = 0;
            }
            this.player = this.spaceWalkerAnimations[Math.floor(this.spaceWalkerTimer)];
            this.player.height = h;
            Game.scene.add(this.player);
        }
        this.hasMoved = false;
        if (this.hopTimer <= 0 && !this.drownTest) {
            let dx = 0;
            let dz = 0;
            if (!this.Dead) {
                if (this.nextPlayerAction !== 'none') {
                    if (this.currentCharacter.mesh.charName === 'space_chicken_carousel' || this.currentCharacter.mesh.charName == 'astronaut' || this.currentCharacter.mesh.charName == 'space_chicken') {
                        this.spaceChickenParticles.emit(500);
                    }
                }
                if (this.nextPlayerAction === "Down") {
                    this.desiredMeshScale.set(this.deadScale.x, this.deadScale.y, this.deadScale.z);
                    this.startGameWobble = false;
                } else if (this.nextPlayerAction != "none") {
                    this.desiredMeshScale.set(1, 1, 1);
                    this.startGameWobble = false;
                    this.SetDesiredRotationForDirection(this.nextPlayerAction);
                }
                if (this.nextPlayerAction == "right") {
                    if (this.targetPosition.x < 3.5) {
                        Interface.HideHint();
                        if (this.CheckWalls(this.player.position.x + 1, -this.player.position.z)) {
                            dx = this.hopDistance;
                            this.nextPlayerAction = "none";
                            this.bumped = 0;
                        }
                    }
                } else if (this.nextPlayerAction == "left") {
                    if (this.targetPosition.x > -3.5) {
                        Interface.HideHint();
                        if (this.CheckWalls(this.player.position.x - 1, -this.player.position.z)) {
                            dx = -this.hopDistance;
                            this.nextPlayerAction = "none";
                            this.bumped = 0;
                        }
                    }
                } else if (this.nextPlayerAction == "forward") {
                    if (this.CheckWalls(this.player.position.x, -this.targetPosition.z + 1)) {
                        dz = -this.hopDistance;
                        this.heightOffset = this.GetRowHeight(this.targetPosition.z + dz);
                        this.nextPlayerAction = "none";
                        const targetLane = Game.levelGenerator.GetStripByNumber(-this.targetPosition.z + 1);
                        if (targetLane.carSpawner) {
                            targetLane.carSpawner.testPlayerCarSide(this.targetPosition.x);
                        }
                        this.bumped = 0;
                    } else if (this.checkBump) {
                        this.checkBump = false;
                        this.Bumped();
                    }
                } else if (this.nextPlayerAction == "back") {
                    Interface.HideHint();
                    if (this.targetPosition.z <= 4 && this.CheckWalls(this.player.position.x, -this.player.position.z - 1)) {
                        dz = this.hopDistance;
                        this.nextPlayerAction = "none";
                        this.heightOffset = this.GetRowHeight(this.targetPosition.z + dz);
                        this.bumped = 0;
                    }
                }
            }
            if (dx > 0 || dx < 0 || dz < 0 || dz > 0) {
                KeyboardHint.cancelReappearTimeout();
                this.hasMovedThisRound = true;
                this.hasMoved = true;
                this.previousPosition.set(this.targetPosition.x, this.heightOffset, this.targetPosition.z);
                this.targetPosition.x += dx;
                this.targetPosition.z += dz;
                this.Hop();
                if (this.currentLog != null && typeof this.currentLog !== 'undefined') {
                    if (this.currentLog.dipPasr.isFinished()) {
                        this.currentLog.Dip();
                    }
                }
                if (dz < 0) {
                    Game.eagle.advance();
                } else if (dz > 0) {
                    Game.eagle.time++;
                }
                this.CheckWaterObjects(dx);
            }
        }
        if (this.currentLog != null) {
            this.targetPosition.x += this.currentLog.GetVelocity() * deltaTime;
        } else {
            this.targetPosition.set(Math.round(this.targetPosition.x), this.targetPosition.y, this.targetPosition.z);
        }
        if (this.hasMoved) {
            this.CheckForCoins(this.targetPosition.x, this.targetPosition.z);
            this.CheckForRiverAmbience();
        }
        let y = this.GetRowHeight(Game.CurrentRow);
        if (typeof y === "undefined") {
            y = 0.375;
        }
        this.heightOffset = y;
        this.targetPosition.set(this.targetPosition.x, this.targetPosition.y + this.heightOffset, this.targetPosition.z);
        if (this.Dead) {
            if (this.deathType == "car" || this.deathType == "squash") {
                this.targetPosition.set(this.targetPosition.x, this.heightOffset, this.targetPosition.z);
                if (GameSave.GetCurrCharacter() == 'robot') {
                    this.desiredMeshScale.set(0, 0, 0);
                } else {
                    this.desiredMeshScale.set(1 + (1 - this.spreadPasr.Tick(deltaTime)), this.splatPasr.Tick(deltaTime) + 0.05, 1);
                }
                this.DeathCamPosition.set(this.player.position.x + 2.388232, this.player.position.y + 10.25858, this.player.position.z + 8);
            } else if (this.deathType == "carside") {
                this.targetPosition.set(this.player.position.x, this.heightOffset, this.player.position.z);
                if (GameSave.GetCurrCharacter() == 'robot') {
                    this.desiredMeshScale.set(0, 0, 0);
                } else {
                    this.desiredMeshScale.set(1, 1.3, this.splatPasr.Tick(deltaTime) + 0.15);
                }
                if (typeof this.killerCar !== 'undefined' && this.killerCar != null) {
                    const killerCarTransform = this.killerCar.object.position;
                    this.targetPosition.set(killerCarTransform.x - this.killerXOffset, killerCarTransform.y + 0.3, killerCarTransform.z + 0.6);
                    if (this.player.position.x > 12 || this.player.position.x < -12) {
                        this.killerCar = null;
                    }
                }
                if (this.player.position.x < 9 && this.player.position.x > -9) {
                    this.DeathCamPosition.set(this.player.position.x + 2.388232, this.DeathCamPosition.y, this.player.position.z + 8);
                }
            } else if (this.deathType == "train") {
                if (GameSave.GetCurrCharacter() == 'robot') {
                    this.desiredMeshScale.set(0, 0, 0);
                } else {
                    this.desiredMeshScale.set(1 + (1 - this.spreadPasr.Tick(deltaTime)), this.splatPasr.Tick(deltaTime) + 0.05, 1);
                }
                if (this.player.position.x > 12 || this.player.position.x < -12) {
                    this.killerTrain = null;
                }
                if (this.player.position.x < 3 && this.player.position.x > -3) {
                    this.DeathCamPosition.set(this.player.position.x, this.DeathCamPosition.y, this.player.position.z + 8);
                }
                if (Game.currentWorld === 'original_cast') {
                    if (this.killerTrain != null) {
                        this.player.position.x = this.killerTrain.front.position.x;
                    }
                } else if (this.deathType == "trainside") {
                    if (typeof this.killerTrain !== 'undefined' && this.killerTrain != null) {
                        const killerTrainTransform = this.killerTrain.object.position;
                        this.targetPosition.set(killerTrainTransform.x - this.killerXOffset, killerTrainTransform.y + 0.3, killerTrainTransform.z + 0.6);
                    }
                }
                if (this.player.position.x > 10 || this.player.position.x < -10) {
                    this.player.killerTrain = null;
                }
                if (this.player.position.x < 9 && this.player.position.x > -9) {
                    this.DeathCamPosition.set(this.player.position.x, this.DeathCamPosition.y, this.DeathCamPosition.z);
                }
            } else if (this.deathType == "water" || this.deathType == "croc") {
                let downScale = 1.4;
                if (this.drownPasr.isFinished()) {
                    downScale = 7.0;
                }
                this.targetPosition.set(this.player.position.x, 0.5 - Easing.easeOutQuint(1.0 - this.drownPasr.GetValue()) * downScale, this.player.position.z);
                if (this.drownPasr.reachedSustain()) {
                    if (Game.currentWorld === "original_cast") {
                        this.drownParticles.reset(this.player.position.x, 0.5, this.player.position.z);
                        this.drownParticles.play();
                    }
                }
                this.DeathCamPosition.set(this.player.position.x + 2.388232, 9.25858, this.player.position.z + 8);
            } else if (this.deathType == "log") {
                if (this.player.position.x > 12 || this.player.position.x < -12) {
                    this.currentLog = null;
                }
                if (this.player.position.x < 5 && this.player.position.x > -5) {
                    this.DeathCamPosition.set(this.player.position.x + 2.388232, 9.25858, this.player.position.z + 8);
                }
                if (GameSave.GetCurrCharacter() == 'robot') {
                    this.desiredMeshScale.set(0, 0, 0);
                }
            } else if (this.deathType == "tooslow") {
                if (this.waitingForEagle) {
                    this.targetPosition.set(this.player.position.x, this.heightOffset, this.player.position.z);
                    this.DeathCamPosition.set(this.player.position.x + 2.388232, 9.25858, this.player.position.z + 7);
                } else {
                    this.targetPosition.set(this.player.position.x, this.heightOffset, Game.eagle.object.position.z - Game.eagle.zShift);
                    if (this.player.position.z > -Game.CurrentRow + 26) {
                        this.DeathCamPosition.set(this.player.position.x + 2.388232, 9.25858, this.player.position.z + 7);
                    }
                }
            } else if (this.deathType === "ufo") {
                if (this.waitingForEagle) {
                    this.targetPosition.x = this.player.position.x;
                    this.targetPosition.z = this.player.position.z;
                    this.DeathCamPosition.set(this.player.position.x + 2.388232, 9.25858, this.player.position.z + 7);
                } else {
                    this.targetPosition.x = this.player.position.x;
                    this.targetPosition.z = this.player.position.z;
                    if (this.player.position.z > -Game.CurrentRow + 26) {
                        this.DeathCamPosition.set(this.player.position.x + 2.388232, 9.25858, this.player.position.z + 7);
                    }
                }
            }
        }
        const rowToConsider = Game.rows[this.GetRowIndex(-Math.round(this.targetPosition.z))];
        if (rowToConsider.Category === "holed") {
            this.CheckWaterObjects();
        }
        this.UpdatePlayerPosition(deltaTime);
    }
    EagleGotMe() {
        PokiSDK.roundEnd(Game.currentWorld === 'original_cast' ? 'original' : Game.currentWorld);
        this.waitingForEagle = false;
        this.Dead = true;
    }
    CheckWaterObjects(dx) {
        
        console.log("CHECK WATER");
        this.onLily = null;
        if (this.Dead) {
            return false;
        }
        const lastLog = this.currentLog;
        this.currentLog = null;
        const rowToConsider = Game.rows[this.GetRowIndex(-Math.round(this.targetPosition.z))];
        if (rowToConsider.Category === "holed") {
            console.log(`ROW: ${rowToConsider.stripName}`);
            for (let i = 0; i < rowToConsider.objects[0].holes.length; i++) {
                if (this.targetPosition.x === rowToConsider.objects[0].holes[i]) {
                    this.drownTest = true;
                    return true;
                }
            }
        }
        if (rowToConsider.Category !== "water") {
            this.drownTest = false;
            return false;
        }
        for (let iwater = 0; iwater < rowToConsider.objects.length; iwater++) {
            if (rowToConsider.objects[iwater].isLillypad == true && rowToConsider.objects[iwater].lillypadObject.position.x === this.targetPosition.x) {
                this.onLily = rowToConsider.objects[iwater];
                window.setTimeout(() => {
                    if (Game.currentWorld === 'space' && Game.barrierOn) {
                        Game.barrierOn = false;
                        Game.playSfx('Shield_button_leave');
                    }
                    rowToConsider.objects[iwater].Dip();
                    if (Game.currentWorld === 'original_cast') {
                        Game.playSfx('lilysplash');
                    }
                }, 150);
                return false;
            }
        }
        if (!this.Dead) {
            const raycastOriginX = this.targetPosition.x;
            for (let ilog = 0; ilog < Game.logs.length; ilog++) {
                const log = Game.logs[ilog];
                if (log.object.position.z === this.targetPosition.z) {
                    if (Physics.DoLinesIntersect(raycastOriginX, 0.05, log.object.position.x, log.HitBoxX)) {
                        this.currentLog = log;
                        this.currentLog.Dip();
                        this.dipPasr.Reset();
                        this.drownTest = false;
                        let diffx = this.targetPosition.x - this.currentLog.object.position.x + this.currentLog.GetSizeRoundedToInt;
                        diffx = diffx - Math.round(diffx);
                        this.targetPosition.x -= diffx;
                        const logPosition = Math.round(this.targetPosition.x - this.currentLog.object.position.x + this.currentLog.GetSizeRoundedToInt + 1);
                        if (logPosition < 0) {
                            this.targetPosition.x += -logPosition;
                        } else if (logPosition >= this.currentLog.SizeAsInt) {
                            this.targetPosition.x -= this.currentLog.SizeAsInt - logPosition + 1;
                        }
                        if (Game.currentWorld === 'original_cast') {
                            Game.playRandomSfx(['logjump', 'logjump2', 'logjump3', 'logjump4']);
                        }
                        return false;
                    }
                }
            }
        }
        this.drownTest = true;
        if (lastLog != null) {
            if (lastLog.GetVelocity() < 0 && dx < 0 || lastLog.GetVelocity() > 0 && dx > 0) {
                this.targetPosition.x += lastLog.GetVelocity() * this.hopPasr.TotalTime() * 2.0;
            }
        }
        return true;
    }
    PlayerRowIndex() {
        return this.GetRowIndex(-Math.round(this.player.position.z));
    }
    CheckForCoins(playerX, playerZ) {
        const r = this.GetRowIndex(-playerZ);
        const rowToConsider = Game.rows[r];
        if (rowToConsider.LogSpawner) {
            for (var itr = 0; itr < rowToConsider.LogSpawner.logs.length; itr++) {
                const log = rowToConsider.LogSpawner.logs[itr];
                if (log.coin) {
                    const coinDistance = Math.abs(playerX - log.coin.position.x);
                    if (coinDistance <= .5) {
                        window.setTimeout(() => {
                            log.poolCoin();
                            Game.playSfx('get-coin-79', true);
                            GameSave.ModifyCoins(name === "red-coin" + "red-coin" ? 5 : 1);
                        }, 150);
                        return;
                    }
                }
            }
        } else {
            for (var itr = 0; itr < rowToConsider.objects.length; itr++) {
                var name = rowToConsider.objects[itr].name;
                if ((name == "coin" + "coin" || name == "red-coin" + "red-coin") && rowToConsider.objects[itr].position.x === playerX) {
                    let obj = rowToConsider.objects[itr];
                    rowToConsider.objects.splice(itr, 1);
                    window.setTimeout(() => {
                        Game.objectPooler.EnterPool(obj.name, obj);
                        obj = null;
                        Game.playSfx('get-coin-79', true);
                        GameSave.ModifyCoins(name === "red-coin" + "red-coin" ? 5 : 1);
                    }, 150);
                    return;
                }
            }
        }
    }
    CheckForRiverAmbience() {
        
        if (this.Dead) {
            return;
        }
        if (Interface.CurrentScreen !== 'main' && Interface.CurrentScreen !== 'death') {
            return;
        }
        const playerRow = this.PlayerRowIndex();
        const minRow = playerRow - 2;
        const maxRow = playerRow + 2;
        this.riverNearby = false;
        for (let r = minRow; r <= maxRow; r++) {
            if (Game.rows[r] != null && Game.rows[r].Category === "water") {
                this.riverNearby = true;
                break;
            }
        }
        if (this.playingRiverAmbience != this.riverNearby) {
            this.playingRiverAmbience = this.riverNearby;
            if (this.riverNearby && Game.currentWorld === 'original_cast') {
                Game.playLoop('river');
            } else {
                Game.stopSfx('river');
            }
        }
    }
    ResetHop() {
        this.movePasr.Reset();
        this.hopPasr.Reset();
        this.IsMoving = true;
        this.UpdatePlayerPosition();
    }
    UpdatePlayerPosition(deltaTime) {
        if (this.deathType == "tooslow") {
            this.player.position.set(this.targetPosition.x, this.heightOffset, this.targetPosition.z);
        } else if (this.deathType === "ufo") {
            this.player.position.x = this.targetPosition.x;
            this.player.position.z = this.targetPosition.z;
            return;
        } else if (this.deathType === "water") {
            this.player.position.y -= 0.2;
            return;
        }
        if (this.hopPasr.isFinished()) {
            if (this.currentLog != null && typeof this.currentLog !== 'undefined') {
                const logOver = true;
            }
        }
        if (!this.movePasr.isFinished()) {
            this.movePasrVector.lerpVectors(this.previousPosition, this.targetPosition, 1 - Easing.easeInCubic(this.movePasr.Tick(deltaTime)));
            this.player.position.set(this.movePasrVector.x, this.movePasrVector.y, this.movePasrVector.z);
        } else {
            this.player.position.set(this.targetPosition.x, this.targetPosition.y, this.targetPosition.z);
        }
        if (!this.Dead && (this.player.position.x > 4.5 || this.player.position.x < -4.5)) {
            this.kill("log");
        }
    }
    CheckTriggers(x, row) { }
    CheckWalls(x, row) {
        x = Math.round(x);
        row = Math.round(row);
        const rowIndex = this.GetRowIndex(row);
        const block = Game.rows[rowIndex].cells[x + 4];
        if (block != "none") {
            return false;
        }
        return true;
    }
    GetRowIndex(row) {
        for (let i = 0; i < Game.rows.length; i++) {
            if (Game.rows[i].row == row) {
                return i;
            }
        }
        return 0;
    }
    GetRowHeight(row) {
        const rowindex = this.GetRowIndex(row);
        const y = Game.rows[rowindex].heightOffset;
        return y;
    }
    Hop() {
        this.hopTimer = this.hopDelay;
        this.hopPasr.Reset();
        this.movePasr.Reset();
        this.IsMoving = true;
        Game.AddTerrain();
        Game.playRandomSfx(this.currentCharacter.hop);
    }
    Reset() {
        Game.stopSfx('river');
        this.hasMovedThisRound = false;
        this.currentLog = null;
        this.deathType = "none";
        this.Dead = false;
        this.startGameWobble = true;
        this.nextPlayerAction = 'none';
        this.drownTest = false;
        this.cutePasr.Reset();
        this.drownPasr.Reset();
        this.splatPasr.Reset();
        this.spreadPasr.Reset();
        this.targetPosition.set(0, this.heightOffset, 2);
        this.desiredMeshScale.set(1, 1, 1);
        this.desiredDirection.set(0, 0, 0, 1);
        this.player.rotation.set(0, 0, 0);
        this.player.material.uniforms.saturation.value = 1;
        this.player.material.uniforms.GREY_COLOR.value = this.vectorOne;
        if (Game.currentWorld === 'space' && Game.space_background) {
            Game.space_background.position.set(Game.space_background.position.x, Game.space_background.position.y, 0);
        }
    }

}

export default PlayerController;