import { Audio, GLView } from 'expo';
import { Bounce, Power1, Power4, TimelineMax, TweenMax } from 'gsap';
import React, { Component } from 'react';
import {
  Dimensions,
  InteractionManager,
  StyleSheet,
  Vibration,
  View,
} from 'react-native';
import * as THREE from 'three';

import AudioFiles from '../Audio';
import Characters from '../Characters';
import ExpoTHREE from '../ExpoTHREE';
import ModelLoader from '../ModelLoader';
import State from '../state';
import GameOver from './GameOver';
import GestureRecognizer, { swipeDirections } from './GestureView';
import Feathers from './Particles/Feathers';
import Water from './Particles/Water';
import Rows from './Row';
import { Fill } from './Row/Grass';
import Score from './Score';

const initialState = {
  id: Characters.chicken.id,
  name: Characters.chicken.name,
  index: Characters.chicken.index,
};

const { width, height } = Dimensions.get('window');

console.ignoredYellowBox = [
  'WebGL',
  'THREE.WebGLRenderer',
  'THREE.WebGLProgram',
];

export const groundLevel = 0.4;
const sceneColor = 0x6dceea;
const startingRow = 8;

class Game extends Component {
  /// Reserve State for UI related updates...
  state = {
    ready: false,
    score: 0,
    viewKey: 0,
    gameState: State.Game.playing,
    // gameState: State.Game.gameOver
  };
  floorMap = {};

  maxRows = 20;
  sineCount = 0;
  sineInc = Math.PI / 50;

  componentWillReceiveProps(nextProps, nextState) {
    if (nextState.gameState !== this.state.gameState) {
      this.updateWithGameState(nextState.gameState, this.state.gameState);
    }
    // if (nextProps.character.id !== this.props.character.id) {
    //   (async () => {
    //     this.world.remove(this._hero);
    //     this._hero = this.hero.getNode(nextProps.character.id);
    //     this.world.add(this._hero);
    //     this._hero.position.set(0, groundLevel, startingRow);
    //     this._hero.scale.set(1, 1, 1);
    //     this.init();
    //   })();
    // }
  }
  updateWithGameState = (gameState, previousGameState) => {
    if (gameState === this.state.gameState) {
      return;
    }
    this.setState({ gameState });
    this.gameState = gameState;
    const { playing, gameOver, paused, none } = State.Game;
    switch (gameState) {
      case playing:
        this.setupGame();
        this.stopIdle();
        this.onSwipe(swipeDirections.SWIPE_UP);
        break;
      case gameOver:
        break;
      case paused:
        break;
      case none:
        this.newScore();

        break;
      default:
        break;
    }
  };

  audioFileMoveIndex = 0;
  playMoveSound = () => {
    // this.playSound(AudioFiles.chicken.move[`0`])
    this.playSound(AudioFiles.chicken.move[`${this.audioFileMoveIndex}`]);
    this.audioFileMoveIndex =
      (this.audioFileMoveIndex + 1) %
      Object.keys(AudioFiles.chicken.move).length;
  };

  playPassiveCarSound = () => {
    if (Math.floor(Math.random() * 2) === 0) {
      this.playSound(AudioFiles.car.passive['1']);
    }
  };

  playDeathSound = () => {
    this.playSound(AudioFiles.chicken.die[`${Math.floor(Math.random() * 2)}`]);
  };

  playCarHitSound = () => {
    this.playSound(AudioFiles.car.die[`${Math.floor(Math.random() * 2)}`]);
  };
  waterSoundObject = new Audio.Sound();
  playSound = async audioFile => {
    // return;

    const soundObject = new Audio.Sound();
    try {
      await soundObject.loadAsync(audioFile);
      await soundObject.playAsync();
      // Your sound is playing!
    } catch (error) {
      console.warn('sound error', { error });

      // An error occurred!
    }
  };

  async componentDidMount() {
    // const soundObject = new Audio.Sound();
    // try {
    //   await soundObject.loadAsync(AudioFiles.bg_music);
    //   await soundObject.setVolumeAsync(0.05);
    //   await soundObject.setIsLoopingAsync(true);
    //   await soundObject.playAsync();
    //   //unloadAsync
    // } catch (error) {
    //   console.warn('error', { error });
    // }
    // try {
    //   await this.waterSoundObject.loadAsync(AudioFiles.water);
    // } catch (error) {
    //   console.warn('sound error', { error });
    // }
  }
  componentWillMount() {
    this.setupGame();
  }

  setupGame = () => {
    // if (!this.scene) {
    this.scene = new THREE.Scene();
    this.worldWithCamera = new THREE.Group();
    this.world = new THREE.Group();
    this.scene.add(this.worldWithCamera);
    this.worldWithCamera.add(this.world);
    this.camera = new THREE.OrthographicCamera(
      -width,
      width,
      height,
      -height,
      -30,
      30,
    );
    // }

    this.worldWithCamera.position.z = -startingRow;
    this.camera.position.set(-1, 2.8, -2.9); // Change -1 to -.02
    // this.camera.position.set(-1, 1, -2.9); // Change -1 to -.02
    this.camera.zoom = 110; // for birds eye view
    this.camera.updateProjectionMatrix();
    this.camera.lookAt(this.scene.position);

    this.doGame();
    // this.props.setGameState(State.Game.none)
  };

  createParticles = () => {
    this.waterParticles = new Water();
    this.world.add(this.waterParticles.mesh);

    this.featherParticles = new Feathers();
    this.world.add(this.featherParticles.mesh);
  };

  useParticle = (model, type, direction = 0) => {
    requestAnimationFrame(async () => {
      if (type === 'water') {
        this.waterParticles.mesh.position.copy(model.position);
        this.waterParticles.run(type);
        // await this.waterSoundObject.playAsync();
      } else if (type === 'feathers') {
        this.featherParticles.mesh.position.copy(model.position);

        this.featherParticles.run(type, direction);
      }
    });
  };

  createLights = () => {
    this.world.add(new THREE.AmbientLight(0x666666, 0.8));

    let light = new THREE.DirectionalLight(0xdfebff, 1.75);
    light.position.set(20, 30, 0.05);
    light.castShadow = !this.props.hideShadows;
    light.shadow.mapSize.width = 1024 * 2;
    light.shadow.mapSize.height = 1024 * 2;

    let d = 15;
    let v = 6;
    light.shadow.camera.left = -d;
    light.shadow.camera.right = 9;
    light.shadow.camera.top = v;
    light.shadow.camera.bottom = -v;
    light.shadow.camera.far = 100;
    light.shadow.bias = 0.0001;

    this.scene.add(light);

    this.light = light;

    // let helper = new THREE.CameraHelper(light.shadow.camera);
    // this.scene.add(helper);
  };

  newScore = () => {
    Vibration.cancel();

    // this.props.setGameState(State.Game.playing);
    this.setState({ score: 0 });
    this.init();
  };

  doneMoving = () => {
    this._hero.moving = false;
    this.updateScore();
    if (this.idleAnimation) {
      this.idleAnimation.play();
    } else {
      this.idle();
    }
    this.lastHeroZ = this._hero.position.z;
    this._hero.lastPosition = this._hero.position;

    // this._hero.position.set(Math.round(this._hero.position.x), this._hero.position.y, Math.round(this._hero.position.z))
  };

  getWidth = mesh => {
    let box3 = new THREE.Box3();
    box3.setFromObject(mesh);
    return Math.round(box3.max.x - box3.min.x);
  };

  getDepth = mesh => {
    const box3 = new THREE.Box3();
    box3.setFromObject(mesh);
    return Math.round(box3.max.z - box3.min.z);
  };

  loadModels = () => {
    const { _hero } = ModelLoader;

    this.hero = _hero;
  };

  doGame = async () => {
    this.timing = 0.1;

    this.grass = [];
    this.grassCount = 0;
    this.water = [];
    this.waterCount = 0;
    this.road = [];
    this.roadCount = 0;
    this.railRoads = [];
    this.railRoadCount = 0;
    this.lastHeroZ = 8;
    this.rowCount = 0;
    this.camCount = 0;
    this.camSpeed = 0.02;
    this.heroWidth = 0.7;

    this.loadModels();
    this.createParticles();
    this.createLights();

    // Mesh
    this._hero = this.hero.getNode(initialState.id);
    this._hero.moving = false;
    this._hero.hitBy = null;
    this._hero.ridingOn = null;
    this._hero.ridingOnOffset = null;
    this.world.add(this._hero);

    // Assign mesh to corresponding array
    // and add mesh to scene
    for (let i = 0; i < this.maxRows; i++) {
      this.grass[i] = new Rows.Grass(this.heroWidth);
      this.water[i] = new Rows.Water(this.heroWidth, this.onCollide);
      this.road[i] = new Rows.Road(this.heroWidth, this.onCollide);
      this.railRoads[i] = new Rows.RailRoad(this.heroWidth, this.onCollide);
      this.world.add(this.grass[i]);
      this.world.add(this.water[i]);
      this.world.add(this.road[i]);
      this.world.add(this.railRoads[i]);
    }

    this.init();
  };

  onCollide = (obstacle = {}, type = 'feathers', collision) => {
    if (this.state.gameState !== State.Game.playing) {
      return;
    }
    this.stopIdle();
    if (collision === 'car') {
      this.playCarHitSound();
      this.playDeathSound();
    } else if (collision === 'train') {
      this.playSound(AudioFiles.train.die[`0`]);
      this.playDeathSound();
    }
    this._hero.isAlive = false;
    this.useParticle(this._hero, type, obstacle.speed);
    this.rumbleScreen();
    this.gameOver();
  };

  stopIdle = () => {
    if (!this.idleAnimation || !this.idleAnimation.pause) {
      return;
    }
    this.idleAnimation.pause();
    this.idleAnimation = null;
    this._hero.scale.set(1, 1, 1);
  };

  idle = () => {
    if (this.idleAnimation) {
      return;
    }
    this.stopIdle();

    const s = 0.8;
    this.idleAnimation = new TimelineMax({ repeat: -1 });
    this.idleAnimation
      .to(this._hero.scale, 0.3, { x: 1, y: s, z: 0.9, ease: Power1.easeIn })
      .to(this._hero.scale, 0.6, { x: 1, y: 1, z: 1, ease: Power1.easeOut });
  };

  // Setup initial scene
  init = () => {
    const offset = -30;
    this.setState({ score: 0 });
    this.camera.position.z = 1;
    this._hero.position.set(0, groundLevel, startingRow);
    this._hero.scale.set(1, 1, 1);
    this._hero.rotation.set(0, Math.PI, 0);

    this.featherParticles.mesh.position.copy(this._hero.position);
    this.waterParticles.mesh.position.copy(this._hero.position);
    this.featherParticles.mesh.position.y = 0;
    this.waterParticles.mesh.position.y = 0;

    this.map = {};
    this.camCount = 0;
    this.map[`${0},${groundLevel | 0},${startingRow | 0}`] = 'player';
    this.initialPosition = null;
    this.targetPosition = null;
    this.grassCount = 0;
    this.waterCount = 0;
    this.roadCount = 0;
    this.railRoadCount = 0;

    this.rowCount = 0;
    this._hero.hitBy = null;
    this._hero.ridingOn = null;
    this._hero.ridingOnOffset = null;
    this.lastHeroZ = startingRow;
    this.floorMap = {};
    this._hero.isAlive = true;

    this.idle();

    for (let i = 0; i < this.maxRows; i++) {
      this.grass[i].position.z = offset;

      this.water[i].position.z = offset;
      this.water[i].active = false;
      this.road[i].position.z = offset;
      this.road[i].active = false;
      this.railRoads[i].position.z = offset;
      this.railRoads[i].active = false;
    }

    this.grass[this.grassCount].position.z = this.rowCount;
    this.grass[this.grassCount].generate(this.mapRowToObstacle(this.rowCount));
    this.grassCount++;
    this.rowCount++;

    for (let i = 0; i < 23; i++) {
      this.newRow();
    }

    this.setState({ ready: true });
  };

  mapRowToObstacle = row => {
    if (this.rowCount < 5) {
      return Fill.solid;
    } else if (this.rowCount < 10) {
      return Fill.empty;
    }
    return Fill.random;
  };

  // Scene generators
  newRow = rowKind => {
    if (this.grassCount === this.maxRows) {
      this.grassCount = 0;
    }
    if (this.roadCount === this.maxRows) {
      this.roadCount = 0;
    }
    if (this.waterCount === this.maxRows) {
      this.waterCount = 0;
    }
    if (this.railRoadCount === this.maxRows) {
      this.railRoadCount = 0;
    }
    if (this.rowCount < 10) {
      rowKind = 1;
    }

    let rk = rowKind || Math.floor(Math.random() * 3) + 1;
    switch (rk) {
      case 1:
        this.grass[this.grassCount].position.z = this.rowCount;
        this.grass[this.grassCount].generate(
          this.mapRowToObstacle(this.rowCount),
        );
        this.floorMap[`${this.rowCount}`] = {
          type: 'grass',
          entity: this.grass[this.grassCount],
        };
        this.grassCount++;
        this.lastRk = rk;
        break;
      case 2:
        if (((Math.random() * 4) | 0) === 0) {
          this.railRoads[this.railRoadCount].position.z = this.rowCount;
          this.railRoads[this.railRoadCount].active = true;
          this.floorMap[`${this.rowCount}`] = {
            type: 'railRoad',
            entity: this.railRoads[this.railRoadCount],
          };
          this.railRoadCount++;
          this.lastRk = rk + 1000;
        } else {
          this.road[this.roadCount].position.z = this.rowCount;
          this.road[this.roadCount].active = true;
          this.floorMap[`${this.rowCount}`] = {
            type: 'road',
            entity: this.road[this.roadCount],
          };
          this.roadCount++;
          this.lastRk = rk;
        }
        break;

      case 3:
        this.water[this.waterCount].position.z = this.rowCount;
        this.water[this.waterCount].active = true;
        this.water[this.waterCount].generate();
        this.floorMap[`${this.rowCount}`] = {
          type: 'water',
          entity: this.water[this.waterCount],
        };
        this.waterCount++;

        this.lastRk = rk;
        break;
    }

    this.rowCount++;
  };

  // Detect collisions with trees/cars
  treeCollision = dir => {
    let zPos = 0;
    let xPos = 0;
    if (dir == 'up') {
      zPos = 1;
    } else if (dir == 'down') {
      zPos = -1;
    } else if (dir == 'left') {
      xPos = 1;
    } else if (dir == 'right') {
      xPos = -1;
    }

    if (this.floorMap.hasOwnProperty(`${(this._hero.position.z + zPos) | 0}`)) {
      const { type, entity } = this.floorMap[
        `${(this._hero.position.z + zPos) | 0}`
      ];
      if (type === 'grass') {
        const key = `${(this._hero.position.x + xPos) | 0}`;
        if (entity.obstacleMap.hasOwnProperty(key)) {
          return true;
        }
      }
    }

    return false;
  };

  moveUserOnEntity = () => {
    if (!this._hero.ridingOn) {
      return;
    }

    // let target = this._hero.ridingOn.mesh.position.x + this._hero.ridingOnOffset;
    this._hero.position.x += this._hero.ridingOn.speed;
    this.initialPosition.x = this._hero.position.x;
  };

  moveUserOnCar = () => {
    if (!this._hero.hitBy) {
      return;
    }

    let target = this._hero.hitBy.mesh.position.x;
    this._hero.position.x += this._hero.hitBy.speed;
    if (this.initialPosition) this.initialPosition.x = target;
  };

  rumbleScreen = () => {
    Vibration.vibrate();

    TweenMax.to(this.scene.position, 0.2, {
      x: 0,
      y: 0,
      z: 1,
    });
    TweenMax.to(this.scene.position, 0.2, {
      x: 0,
      y: 0,
      z: 0,
      delay: 0.2,
    });
  };

  // Move scene forward
  forwardScene = () => {
    const easing = 0.03;
    this.world.position.z -=
      (this._hero.position.z - startingRow + this.world.position.z) * easing;
    this.world.position.x = -Math.min(
      2,
      Math.max(
        -2,
        this.world.position.x +
          (this._hero.position.x - this.world.position.x) * easing,
      ),
    );

    // normal camera speed
    if (-this.world.position.z - this.camCount > 1.0) {
      this.camCount = -this.world.position.z;
      this.newRow();
    }
  };

  // Reset variables, restart game
  gameOver = () => {
    this._hero.moving = false;
    /// Stop player from finishing a movement
    this.heroAnimations.map(val => {
      if (val.pause) {
        val.pause();
      }
      val = null;
    });
    this.heroAnimations = [];
    // this.gameState = State.Game.gameOver;
    this.setState({ gameState: State.Game.gameOver });
    // this.props.setGameState(this.gameState);

    InteractionManager.runAfterInteractions(_ => {
      // this.props.navigation.dispatch(NavigationActions.navigate({ routeName: 'GameOver' }));
    });
    // this.props.nav.navigation.navigate('GameOver', {})
  };

  tick = dt => {
    // this.drive();

    for (const railRoad of this.railRoads) {
      railRoad.update(dt, this._hero);
    }
    for (const road of this.road) {
      road.update(dt, this._hero);
    }
    for (const water of this.water) {
      water.update(dt, this._hero);
    }

    if (!this._hero.moving) {
      this.moveUserOnEntity();
      this.moveUserOnCar();
    }
    this.forwardScene();
  };

  checkIfUserHasFallenOutOfFrame = () => {
    if (this.state.gameState !== State.Game.playing) {
      return;
    }
    if (this._hero.position.z < this.camera.position.z - 1) {
      this.rumbleScreen();
      this.gameOver();
      this.playDeathSound();
    }

    // Check if offscreen
    if (this._hero.position.x < -5 || this._hero.position.x > 5) {
      this.rumbleScreen();
      this.gameOver();
      this.playDeathSound();
    }
  };

  updateScore = () => {
    const position = Math.max(Math.floor(this._hero.position.z) - 8, 0);
    if (this.state.score < position) {
      this.setState({ score: position });
    }
  };

  moveWithDirection = direction => {
    if (this.state.gameState !== State.Game.playing) {
      return;
    }

    const { SWIPE_UP, SWIPE_DOWN, SWIPE_LEFT, SWIPE_RIGHT } = swipeDirections;

    this._hero.ridingOn = null;

    if (!this.initialPosition) {
      this.initialPosition = this._hero.position;
      this.targetPosition = this.initialPosition;
    }

    if (this._hero.moving) {
      this._hero.position.set(
        this.targetPosition.x,
        this.targetPosition.y,
        this.targetPosition.z,
      );
      // return
    }

    let velocity = { x: 0, z: 0 };
    switch (direction) {
      case SWIPE_LEFT:
        this._hero.rotation.y = Math.PI / 2;
        if (!this.treeCollision('left')) {
          velocity = { x: 1, z: 0 };

          this.targetPosition = {
            x: this.initialPosition.x + 1,
            y: this.initialPosition.y,
            z: this.initialPosition.z,
          };
          this._hero.moving = true;
        }
        break;
      case SWIPE_RIGHT:
        this._hero.rotation.y = -Math.PI / 2;
        if (!this.treeCollision('right')) {
          velocity = { x: -1, z: 0 };

          this.targetPosition = {
            x: this.initialPosition.x - 1,
            y: this.initialPosition.y,
            z: this.initialPosition.z,
          };
          this._hero.moving = true;
        }
        break;
      case SWIPE_UP:
        this._hero.rotation.y = 0;
        if (!this.treeCollision('up')) {
          let rowObject = this.floorMap[`${this.initialPosition.z}`] || {};
          if (rowObject.type === 'road') {
            this.playPassiveCarSound();
          }

          let shouldRound = rowObject.type !== 'water';
          velocity = { x: 0, z: 1 };

          this.targetPosition = {
            x: this.initialPosition.x,
            y: this.initialPosition.y,
            z: this.initialPosition.z + 1,
          };
          if (shouldRound) {
            this.targetPosition.x = Math.round(this.targetPosition.x);
            const { ridingOn } = this._hero;
            if (ridingOn && ridingOn.dir) {
              if (ridingOn.dir < 0) {
                this.targetPosition.x = Math.floor(this.targetPosition.x);
              } else if (ridingOn.dir > 0) {
                this.targetPosition.x = Math.ceil(this.targetPosition.x);
              } else {
                this.targetPosition.x = Math.round(this.targetPosition.x);
              }
            }
          }

          this._hero.moving = true;
        }
        break;
      case SWIPE_DOWN:
        this._hero.rotation.y = Math.PI;
        if (!this.treeCollision('down')) {
          const row = (this.floorMap[`${this.initialPosition.z - 1}`] || {})
            .type;
          let shouldRound = row !== 'water';
          velocity = { x: 0, z: -1 };

          this.targetPosition = {
            x: this.initialPosition.x,
            y: this.initialPosition.y,
            z: this.initialPosition.z - 1,
          };
          if (shouldRound) {
            this.targetPosition.x = Math.round(this.targetPosition.x);
            const { ridingOn } = this._hero;
            if (ridingOn && ridingOn.dir) {
              if (ridingOn.dir < 0) {
                this.targetPosition.x = Math.floor(this.targetPosition.x);
              } else if (ridingOn.dir > 0) {
                this.targetPosition.x = Math.ceil(this.targetPosition.x);
              } else {
                this.targetPosition.x = Math.round(this.targetPosition.x);
              }
            }
          }
          this._hero.moving = true;
        }
        break;
    }
    let { targetPosition, initialPosition } = this;

    let rowObject =
      this.floorMap[`${this.initialPosition.z + velocity.z}`] || {};
    let finalY = rowObject.entity.top || groundLevel;

    console.log('MOVE TO: ', rowObject.type, finalY, rowObject.entity.top);

    let delta = {
      x: targetPosition.x - initialPosition.x,
      y: finalY,
      z: targetPosition.z - initialPosition.z,
    };

    this.playMoveSound();

    this.heroAnimations = [];

    this.heroAnimations.push(
      TweenMax.to(this._hero.position, this.timing, {
        x: this.initialPosition.x + delta.x * 0.75,
        y: finalY + 0.5,
        z: this.initialPosition.z + delta.z * 0.75,
      }),
    );

    this.heroAnimations.push(
      TweenMax.to(this._hero.scale, this.timing, {
        x: 1,
        y: 1.2,
        z: 1,
      }),
    );
    this.heroAnimations.push(
      TweenMax.to(this._hero.scale, this.timing, {
        x: 1.0,
        y: 0.8,
        z: 1,
        delay: this.timing,
      }),
    );
    this.heroAnimations.push(
      TweenMax.to(this._hero.scale, this.timing, {
        x: 1,
        y: 1,
        z: 1,
        ease: Bounce.easeOut,
        delay: this.timing * 2,
      }),
    );

    this.heroAnimations.push(
      TweenMax.to(this._hero.position, this.timing, {
        x: this.targetPosition.x,
        y: finalY,
        z: this.targetPosition.z,
        ease: Power4.easeOut,
        delay: 0.151,
        onComplete: () => {
          console.log('Done', this._hero.position);
          this.doneMoving();
        },
        onCompleteParams: [],
      }),
    );

    this.initialPosition = this.targetPosition;
  };

  beginMoveWithDirection = direction => {
    if (this.state.gameState !== State.Game.playing) {
      return;
    }
    this.idleAnimation.pause();

    TweenMax.to(this._hero.scale, 0.2, {
      x: 1.2,
      y: 0.75,
      z: 1,
      // ease: Bounce.easeOut,
    });
  };

  onSwipe = gestureName => this.moveWithDirection(gestureName);

  renderGame = () => {
    if (!this.state.ready) {
      return;
    }

    const config = {
      velocityThreshold: 0.2,
      directionalOffsetThreshold: 80,
    };

    return (
      <GestureRecognizer
        onResponderGrant={() => {
          this.beginMoveWithDirection();
        }}
        onSwipe={direction => {
          this.onSwipe(direction);
        }}
        config={config}
        onTap={() => {
          this.onSwipe(swipeDirections.SWIPE_UP);
        }}
        style={{ flex: 1 }}
      >
        <GLView
          style={{ flex: 1, height: '100%', overflow: 'hidden' }}
          onContextCreate={this._onGLContextCreate}
        />
      </GestureRecognizer>
    );
  };

  _onGLContextCreate = async gl => {
    const { drawingBufferWidth: width, drawingBufferHeight: height } = gl;

    // NOTE: How to create an `GLView`-compatible THREE renderer
    this.renderer = new ExpoTHREE.Renderer({ gl, antialias: true });
    this.renderer.setSize(width, height);
    this.renderer.setClearColor(sceneColor);
    this.renderer.gammaInput = true;
    this.renderer.gammaOutput = true;
    this.renderer.shadowMap.enabled = true;

    const render = () => {
      requestAnimationFrame(render);
      const time = Date.now();
      this.tick(time);
      this.renderer.render(this.scene, this.camera);

      // NOTE: At the end of each frame, notify `Expo.GLView` with the below
      gl.endFrameEXP();
    };
    render();
  };

  renderGameOver = () => {
    if (this.state.gameState !== State.Game.gameOver) {
      return null;
    }

    return (
      <View style={StyleSheet.absoluteFillObject}>
        <GameOver
          onRestart={() => {
            this.updateWithGameState(State.Game.playing);
          }}
        />
      </View>
    );
  };
  render() {
    return (
      <View
        pointerEvents="box-none"
        style={[{ flex: 1, backgroundColor: '#6dceea' }, this.props.style]}
      >
        {this.renderGame()}
        <Score
          score={this.state.score}
          gameOver={this.state.gameState === State.Game.gameOver}
        />
        {this.renderGameOver()}
      </View>
    );
  }
}

export default Game;
