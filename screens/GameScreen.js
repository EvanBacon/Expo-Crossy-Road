import { GLView } from 'expo-gl';
import { Bounce, Power1, Power4, TimelineMax, TweenMax } from 'gsap';
import React, { Component } from 'react';
import {
  Dimensions,
  InteractionManager,
  StyleSheet,
  Animated,
  Vibration,
  View,
} from 'react-native';
import * as THREE from 'three';
import Characters from '../Characters';
import * as ExpoTHREE from 'expo-three';
import ModelLoader from '../ModelLoader';
import State from '../state';
import GameOverScreen from './GameOverScreen';
import GestureRecognizer, { swipeDirections } from '../components/GestureView';
import Feathers from '../src/Particles/Feathers';
import Water from '../src/Particles/Water';
import Rows from '../src/Row';
import { Fill } from '../src/Row/Grass';
import Score from '../components/ScoreText';
import HomeScreen from './HomeScreen';
const initialState = {
  id: Characters.chicken.id,
  name: Characters.chicken.name,
  index: Characters.chicken.index,
};

const IDLE_DURING_GAME_PLAY = false;
const { width, height } = Dimensions.get('window');

const normalizeAngle = angle => {
  return Math.atan2(Math.sin(angle), Math.cos(angle));
};

const PI_2 = Math.PI * 0.5;
import {
  groundLevel,
  maxRows,
  sceneColor,
  startingRow,
} from '../src/GameSettings';
import AudioManager from '../AudioManager';

const DEBUG_CAMERA_CONTROLS = false;
class Game extends Component {
  /// Reserve State for UI related updates...
  state = {
    ready: false,
    score: 0,
    viewKey: 0,
    gameState: State.Game.none,
    // gameState: State.Game.gameOver
  };

  floorMap = {};

  transitionScreensValue = new Animated.Value(1);

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
    const lastState = this.state.gameState;

    this.setState({ gameState });
    this.gameState = gameState;
    const { playing, gameOver, paused, none } = State.Game;
    switch (gameState) {
      case playing:
        if (lastState !== none) {
          Animated.timing(this.transitionScreensValue, {
            toValue: 0,
            duration: 200,
            onComplete: ({ finished }) => {
              this.setupGame();

              if (finished) {
                Animated.timing(this.transitionScreensValue, {
                  toValue: 1,
                  duration: 300,
                }).start();
              }
            },
          }).start();
        } else {
          // Coming straight from the menu.
          this.stopIdle();
          this.onSwipe(swipeDirections.SWIPE_UP);
        }

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

  playMoveSound = async () => {
    await AudioManager.playAsync(
      AudioManager.sounds.chicken.move[`${this.audioFileMoveIndex}`],
    );
    this.audioFileMoveIndex =
      (this.audioFileMoveIndex + 1) %
      Object.keys(AudioManager.sounds.chicken.move).length;
  };

  playPassiveCarSound = async () => {
    if (Math.floor(Math.random() * 2) === 0) {
      await AudioManager.playAsync(AudioManager.sounds.car.passive[`1`]);
    }
  };

  playDeathSound = async () => {
    await AudioManager.playAsync(
      AudioManager.sounds.chicken.die[`${Math.floor(Math.random() * 2)}`],
    );
  };

  playCarHitSound = async () => {
    await AudioManager.playAsync(
      AudioManager.sounds.car.die[`${Math.floor(Math.random() * 2)}`],
    );
  };

  async componentDidMount() {
    // AudioManager.sounds.bg_music.setVolumeAsync(0.05);
    // await AudioManager.playAsync(
    //   AudioManager.sounds.bg_music, true
    // );

    Dimensions.addEventListener('change', this.onScreenResize);
  }

  onScreenResize = ({ window }) => {
    this.updateScale();
  };

  componentWillUnmount() {
    Dimensions.removeEventListener('change', this.onScreenResize);
  }

  updateScale = () => {
    const { width, height, scale } = Dimensions.get('window');
    if (this.camera) {
      this.camera.left = -(width * scale);
      this.camera.right = width * scale;
      this.camera.top = height * scale;
      this.camera.bottom = -(height * scale);
      this.camera.zoom = 300;
      this.camera.updateProjectionMatrix();
    }
    if (this.scene) {
      // const scale = width / 400;
      // this.scene.scale.set(scale, scale, scale);
      // this.camera.lookAt(this.scene.position);
      // this.renderer.setPixelRatio(scale);
    }
    if (this.renderer) {
      this.renderer.setSize(width * scale, height * scale);
    }
  };

  componentWillMount() {
    this.setupGame();
  }

  setupGame = () => {
    this.scene = new THREE.Scene();
    this.worldWithCamera = new THREE.Group();
    this.world = new THREE.Group();
    this.scene.add(this.worldWithCamera);
    this.worldWithCamera.add(this.world);
    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -30, 30);

    if (DEBUG_CAMERA_CONTROLS) {
      // this.debugControls = new THREE.OrbitControls(this.camera);
    }

    this.worldWithCamera.position.z = -startingRow;
    this.camera.position.set(-1, 2.8, -2.9); // Change -1 to -.02
    this.camera.lookAt(this.scene.position);

    this.updateScale();

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
        await AudioManager.playAsync(AudioManager.sounds.water);
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
    if (IDLE_DURING_GAME_PLAY) {
      if (this.idleAnimation) {
        this.idleAnimation.play();
      } else {
        this.idle();
      }
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
    console.log('_hero', initialState.id);
    this._hero = this.hero.getNode(initialState.id);
    this._hero.moving = false;
    this._hero.hitBy = null;
    this._hero.ridingOn = null;
    this._hero.ridingOnOffset = null;
    this.world.add(this._hero);

    // Assign mesh to corresponding array
    // and add mesh to scene
    for (let i = 0; i < maxRows; i++) {
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

  onCollide = async (obstacle = {}, type = 'feathers', collision) => {
    if (this.state.gameState !== State.Game.playing) {
      return;
    }
    this.stopIdle();
    if (collision === 'car') {
      this.playCarHitSound();
      this.playDeathSound();
    } else if (collision === 'train') {
      await AudioManager.playAsync(AudioManager.sounds.train.die[`0`]);
      this.playDeathSound();
    }
    this._hero.isAlive = false;
    this.useParticle(this._hero, type, obstacle.speed);
    this.rumbleScreen();
    this.gameOver();
  };

  stopIdle = () => {
    if (this.idleAnimation && this.idleAnimation.pause) {
      this.idleAnimation.pause();
    }
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
      .to(this._hero.scale, 0.3, { y: s, ease: Power1.easeIn })
      .to(this._hero.scale, 0.3, { y: 1, ease: Power1.easeOut });
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

    for (let i = 0; i < maxRows; i++) {
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

    for (let i = 0; i < maxRows + 3; i++) {
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
    if (this.grassCount === maxRows) {
      this.grassCount = 0;
    }
    if (this.roadCount === maxRows) {
      this.roadCount = 0;
    }
    if (this.waterCount === maxRows) {
      this.waterCount = 0;
    }
    if (this.railRoadCount === maxRows) {
      this.railRoadCount = 0;
    }
    if (this.rowCount < 10) {
      rowKind = 'grass';
    }

    const ROW_TYPES = ['grass', 'roadtype', 'water'];
    if (rowKind == null) {
      rowKind = ROW_TYPES[Math.floor(Math.random() * ROW_TYPES.length)];
    }

    switch (rowKind) {
      case 'grass':
        this.grass[this.grassCount].position.z = this.rowCount;
        this.grass[this.grassCount].generate(
          this.mapRowToObstacle(this.rowCount),
        );
        this.floorMap[`${this.rowCount}`] = {
          type: 'grass',
          entity: this.grass[this.grassCount],
        };
        this.grassCount++;
        break;
      case 'roadtype':
        if (((Math.random() * 4) | 0) === 0) {
          this.railRoads[this.railRoadCount].position.z = this.rowCount;
          this.railRoads[this.railRoadCount].active = true;
          this.floorMap[`${this.rowCount}`] = {
            type: 'railRoad',
            entity: this.railRoads[this.railRoadCount],
          };
          this.railRoadCount++;
        } else {
          this.road[this.roadCount].position.z = this.rowCount;
          this.road[this.roadCount].active = true;
          this.floorMap[`${this.rowCount}`] = {
            type: 'road',
            entity: this.road[this.roadCount],
          };
          this.roadCount++;
        }
        break;
      case 'water':
        this.water[this.waterCount].position.z = this.rowCount;
        this.water[this.waterCount].active = true;
        this.water[this.waterCount].generate();
        this.floorMap[`${this.rowCount}`] = {
          type: 'water',
          entity: this.water[this.waterCount],
        };
        this.waterCount++;
        break;
    }

    this.rowCount++;
  };

  // Detect collisions with trees/cars
  treeCollision = position => {
    const targetZ = `${position.z | 0}`;
    if (targetZ in this.floorMap) {
      const { type, entity } = this.floorMap[targetZ];
      if (type === 'grass') {
        const key = `${position.x | 0}`;
        if (key in entity.obstacleMap) {
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
    setTimeout(() => {
      this.setState({ gameState: State.Game.gameOver });
    }, 300);
    // this.props.setGameState(this.gameState);

    // InteractionManager.runAfterInteractions(_ => {
    // this.props.navigation.dispatch(NavigationActions.navigate({ routeName: 'GameOver' }));
    // });
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
      this.checkIfUserHasFallenOutOfFrame();
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

  targetRotation;
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
      if (this.targetRotation) {
        this._hero.rotation.y = normalizeAngle(this.targetRotation);
      }
      // return
    }

    const calculateRotation = (currrent, target) => {
      if (target !== currrent) {
        let _target = target; //+ Math.PI;
        if (_target % currrent === 0) {
          _target = currrent;
        } else if (_target > 0) {
          _target += currrent / 2;
        } else {
          _target -= currrent / 2;
        }
        return _target; // - Math.PI;
      }
      return target;
    };

    let velocity = { x: 0, z: 0 };

    this.targetRotation = normalizeAngle(this._hero.rotation.y);
    // const normalizedRotation = normalizeAngle(this._hero.rotation.y)
    switch (direction) {
      case SWIPE_LEFT:
        {
          this.targetRotation = PI_2; // calculateRotation(targetRotation, Math.PI / 2);

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
        {
          if (this.targetPosition === 0) {
            this.targetPosition = -PI_2;
          } else if (
            (this.targetRotation | 0) !== -(PI_2 | 0) &&
            (this.targetRotation | 0) !== ((Math.PI + PI_2) | 0)
          ) {
            this.targetRotation = Math.PI + PI_2;
          }
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
        {
          this.targetRotation = 0;
          let rowObject = this.floorMap[`${this.initialPosition.z}`] || {};
          if (rowObject.type === 'road') {
            this.playPassiveCarSound();
          }

          let shouldRound = true; // rowObject.type !== 'water';
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
        {
          this.targetRotation = Math.PI;
          const row = (this.floorMap[`${this.initialPosition.z - 1}`] || {})
            .type;
          let shouldRound = true; //row !== 'water';
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

    // Check collision using the computed movement.
    if (this.treeCollision(this.targetPosition)) {
      // If we collide with an object, then reset the target position so the character just jumps up.
      this.targetPosition = {
        x: this.initialPosition.x,
        y: this.initialPosition.y,
        z: this.initialPosition.z,
      };
      this._hero.moving = false;
    }

    const targetRow =
      this.floorMap[`${this.initialPosition.z + velocity.z}`] || {};
    let finalY = targetRow.entity.top || groundLevel;
    // If the next move is into the river, then we want to jump into it.
    if (targetRow.type === 'water') {
      const ridable = targetRow.entity.getRidableForPosition(
        this.targetPosition,
      );
      if (!ridable) {
        finalY = targetRow.entity.getPlayerSunkenPosition();
      } else {
        finalY = targetRow.entity.getPlayerLowerBouncePositionForEntity(
          ridable,
        );
      }
    }

    this.targetPosition.y = finalY;

    let delta = {
      x: this.targetPosition.x - initialPosition.x,
      y: this.targetPosition.y,
      z: this.targetPosition.z - initialPosition.z,
    };

    this.playMoveSound();

    const { timing } = this;

    const inAirPosition = {
      x: this.initialPosition.x + delta.x * 0.75,
      y: this.targetPosition.y + 0.5,
      z: this.initialPosition.z + delta.z * 0.75,
    };

    const positionChangeAnimation = new TimelineMax({
      onComplete: () => {
        this.doneMoving();
      },
    });

    positionChangeAnimation
      .to(this._hero.position, timing, { ...inAirPosition })
      .to(this._hero.position, timing, {
        x: this.targetPosition.x,
        y: this.targetPosition.y,
        z: this.targetPosition.z,
      });

    const scaleChangeAnimation = new TimelineMax();
    scaleChangeAnimation
      .to(this._hero.scale, timing, {
        x: 1,
        y: 1.2,
        z: 1,
      })
      .to(this._hero.scale, timing, {
        x: 1.0,
        y: 0.8,
        z: 1,
      })
      .to(this._hero.scale, timing, {
        x: 1,
        y: 1,
        z: 1,
        ease: Bounce.easeOut,
      });

    this.heroAnimations = [
      positionChangeAnimation,
      scaleChangeAnimation,
      TweenMax.to(this._hero.rotation, timing, {
        y: this.targetRotation,
        ease: Power1.easeInOut,
        onComplete: () =>
          (this._hero.rotation.y = normalizeAngle(this._hero.rotation.y)),
      }),
    ];

    this.initialPosition = this.targetPosition;
  };

  beginMoveWithDirection = direction => {
    if (this.state.gameState !== State.Game.playing) {
      return;
    }
    this.stopIdle();

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

    return (
      <GestureView
        pointerEvents={DEBUG_CAMERA_CONTROLS ? 'none' : undefined}
        onStartGesture={this.beginMoveWithDirection}
        onSwipe={this.onSwipe}
      >
        <GLView
          style={{ flex: 1, height: '100%', overflow: 'hidden' }}
          onContextCreate={this._onGLContextCreate}
        />
      </GestureView>
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
        <GameOverScreen
          onRestart={() => {
            this.updateWithGameState(State.Game.playing);
          }}
        />
      </View>
    );
  };

  renderHomeScreen = () => {
    if (this.state.gameState !== State.Game.none) {
      return null;
    }

    return (
      <View style={StyleSheet.absoluteFillObject}>
        <HomeScreen
          onPlay={() => {
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
        style={[
          StyleSheet.absoluteFill,
          { flex: 1, position: 'fixed', backgroundColor: '#6dceea' },
          this.props.style,
        ]}
      >
        <Animated.View
          style={{ flex: 1, opacity: this.transitionScreensValue }}
        >
          {this.renderGame()}
        </Animated.View>
        <Score
          score={this.state.score}
          gameOver={this.state.gameState === State.Game.gameOver}
        />
        {this.renderGameOver()}

        {this.renderHomeScreen()}
      </View>
    );
  }
}

const GestureView = ({ onStartGesture, onSwipe, ...props }) => {
  const config = {
    velocityThreshold: 0.2,
    directionalOffsetThreshold: 80,
  };

  return (
    <GestureRecognizer
      onResponderGrant={() => {
        onStartGesture();
      }}
      onSwipe={direction => {
        onSwipe(direction);
      }}
      config={config}
      onTap={() => {
        onSwipe(swipeDirections.SWIPE_UP);
      }}
      style={{ flex: 1 }}
      {...props}
    />
  );
};

export default Game;
