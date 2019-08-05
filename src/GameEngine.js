import { GLView } from 'expo-gl';
import * as ExpoTHREE from 'expo-three';
import { THREE } from 'expo-three';
import { Bounce, Power1, TimelineMax, TweenMax } from 'gsap';
import React, { Component } from 'react';
import {
  Animated,
  Dimensions,
  StyleSheet,
  Vibration,
  View,
} from 'react-native';

import AudioManager from '../AudioManager';
import Characters from '../Characters';
import GestureRecognizer, { swipeDirections } from '../components/GestureView';
import Score from '../components/ScoreText';
import ModelLoader from '../ModelLoader';
import { groundLevel, maxRows, sceneColor, startingRow } from './GameSettings';
import Feathers from './Particles/Feathers';
import Water from './Particles/Water';
import Rows from './Row';
import { Fill } from './Row/Grass';
import State from '../state';

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
const DEBUG_CAMERA_CONTROLS = false;

class CrossyScene extends THREE.Scene {
  constructor({ hideShadows }) {
    super();

    this.worldWithCamera = new THREE.Group();
    this.world = new CrossyWorld();
    this.worldWithCamera.add(this.world);
    this.add(this.worldWithCamera);

    const light = new THREE.DirectionalLight(0xdfebff, 1.75);
    light.position.set(20, 30, 0.05);
    light.castShadow = !hideShadows;
    light.shadow.mapSize.width = 1024 * 2;
    light.shadow.mapSize.height = 1024 * 2;

    const d = 15;
    const v = 6;
    light.shadow.camera.left = -d;
    light.shadow.camera.right = 9;
    light.shadow.camera.top = v;
    light.shadow.camera.bottom = -v;
    light.shadow.camera.far = 100;
    light.shadow.bias = 0.0001;

    this.add(light);

    this.light = light;

    // let helper = new THREE.CameraHelper(light.shadow.camera);
    // this.add(helper);
  }

  resetParticles = position => {
    this.featherParticles.mesh.position.copy(position);
    this.waterParticles.mesh.position.copy(position);
    this.featherParticles.mesh.position.y = 0;
    this.waterParticles.mesh.position.y = 0;
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

  createParticles = () => {
    this.waterParticles = new Water();
    this.world.add(this.waterParticles.mesh);

    this.featherParticles = new Feathers();
    this.world.add(this.featherParticles.mesh);
  };

  rumble = () => {
    Vibration.vibrate();

    TweenMax.to(this.position, 0.2, {
      x: 0,
      y: 0,
      z: 1,
    });
    TweenMax.to(this.position, 0.2, {
      x: 0,
      y: 0,
      z: 0,
      delay: 0.2,
    });
  };
}

class CrossyCamera extends THREE.OrthographicCamera {
  constructor() {
    super(-1, 1, 1, -1, -30, 30);
    this.position.set(-1, 2.8, -2.9); // Change -1 to -.02
    this.lookAt(0, 0, 0);
  }

  updateScale = ({ width, height, scale }) => {
    this.left = -(width * scale);
    this.right = width * scale;
    this.top = height * scale;
    this.bottom = -(height * scale);
    this.zoom = 300;
    this.updateProjectionMatrix();
  };
}

class CrossyWorld extends THREE.Group {
  constructor() {
    super();
    this.add(new THREE.AmbientLight(0x666666, 0.8));
  }

  createParticles = () => {
    this.waterParticles = new Water();
    this.add(this.waterParticles.mesh);

    this.featherParticles = new Feathers();
    this.add(this.featherParticles.mesh);
  };
}

class CrossyRenderer extends ExpoTHREE.Renderer {
  constructor(props) {
    super(props);
    this.gammaInput = true;
    this.gammaOutput = true;
    this.shadowMap.enabled = true;
  }
}

class GameMap {
  floorMap = {};

  reset() {
    this.floorMap = {};
  }

  getRow(index) {
    return this.floorMap[`${index}`];
  }
  setRow(index, value) {
    this.floorMap[`${index}`] = value;
  }

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
}

export default class Engine {
  targetRotation;
  audioFileMoveIndex = 0;
  gameMap = new GameMap();
  updateScale = () => {
    const { width, height, scale } = Dimensions.get('window');
    if (this.camera) {
      this.camera.updateScale({ width, height, scale });
    }
    if (this.renderer) {
      this.renderer.setSize(width * scale, height * scale);
    }
  };

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

  setupGame = () => {
    this.scene = new CrossyScene({ hideShadows: this.hideShadows });

    this.camera = new CrossyCamera();

    if (DEBUG_CAMERA_CONTROLS) {
      // this.debugControls = new THREE.OrbitControls(this.camera);
    }

    this.scene.worldWithCamera.position.z = -startingRow;

    this.updateScale();

    this.doGame();
    // this.props.setGameState(State.Game.none)
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
    this.scene.createParticles();

    // Mesh
    this._hero = this.hero.getNode(initialState.id);
    this._hero.moving = false;
    this._hero.hitBy = null;
    this._hero.ridingOn = null;
    this._hero.ridingOnOffset = null;
    this.scene.world.add(this._hero);

    // Assign mesh to corresponding array
    // and add mesh to scene
    for (let i = 0; i < maxRows; i++) {
      this.grass[i] = new Rows.Grass(this.heroWidth);
      this.water[i] = new Rows.Water(this.heroWidth, this.onCollide);
      this.road[i] = new Rows.Road(this.heroWidth, this.onCollide);
      this.railRoads[i] = new Rows.RailRoad(this.heroWidth, this.onCollide);
      this.scene.world.add(this.grass[i]);
      this.scene.world.add(this.water[i]);
      this.scene.world.add(this.road[i]);
      this.scene.world.add(this.railRoads[i]);
    }

    this.init();
  };

  onCollide = async (obstacle = {}, type = 'feathers', collision) => {
    if (this.isGameEnded()) {
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
    this.scene.useParticle(this._hero, type, obstacle.speed);
    this.scene.rumble();
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
    this.onGameInit();
    const offset = -30;

    this.camera.position.z = 1;
    this._hero.position.set(0, groundLevel, startingRow);
    this._hero.scale.set(1, 1, 1);
    this._hero.rotation.set(0, Math.PI, 0);

    this.scene.resetParticles(this._hero.position);

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
    this.gameMap.reset();
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

    this.onGameReady();
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
        this.gameMap.setRow(this.rowCount, {
          type: 'grass',
          entity: this.grass[this.grassCount],
        });
        this.grassCount++;
        break;
      case 'roadtype':
        if (((Math.random() * 4) | 0) === 0) {
          this.railRoads[this.railRoadCount].position.z = this.rowCount;
          this.railRoads[this.railRoadCount].active = true;
          this.gameMap.setRow(this.rowCount, {
            type: 'railRoad',
            entity: this.railRoads[this.railRoadCount],
          });
          this.railRoadCount++;
        } else {
          this.road[this.roadCount].position.z = this.rowCount;
          this.road[this.roadCount].active = true;
          this.gameMap.setRow(this.rowCount, {
            type: 'road',
            entity: this.road[this.roadCount],
          });
          this.roadCount++;
        }
        break;
      case 'water':
        this.water[this.waterCount].position.z = this.rowCount;
        this.water[this.waterCount].active = true;
        this.water[this.waterCount].generate();
        this.gameMap.setRow(this.rowCount, {
          type: 'water',
          entity: this.water[this.waterCount],
        });
        this.waterCount++;
        break;
    }

    this.rowCount++;
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

  // Move scene forward
  forwardScene = () => {
    const easing = 0.03;
    this.scene.world.position.z -=
      (this._hero.position.z - startingRow + this.scene.world.position.z) *
      easing;
    this.scene.world.position.x = -Math.min(
      2,
      Math.max(
        -2,
        this.scene.world.position.x +
          (this._hero.position.x - this.scene.world.position.x) * easing,
      ),
    );

    // normal camera speed
    if (-this.scene.world.position.z - this.camCount > 1.0) {
      this.camCount = -this.scene.world.position.z;
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
    this.onGameEnded();
    // this.gameState = State.Game.gameOver;

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
    if (this.isGameEnded()) {
      return;
    }
    if (this._hero.position.z < this.camera.position.z - 1) {
      this.scene.rumble();
      this.gameOver();
      this.playDeathSound();
    }

    // Check if offscreen
    if (this._hero.position.x < -5 || this._hero.position.x > 5) {
      this.scene.rumble();
      this.gameOver();
      this.playDeathSound();
    }
  };

  updateScore = () => {
    const position = Math.max(Math.floor(this._hero.position.z) - 8, 0);
    this.onUpdateScore(position);
  };

  moveWithDirection = direction => {
    if (this.isGameEnded()) {
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
          let rowObject = this.gameMap.getRow(this.initialPosition.z) || {};
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
          const row = (this.gameMap(this.initialPosition.z) || {}).type;
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
    if (this.gameMap.treeCollision(this.targetPosition)) {
      // If we collide with an object, then reset the target position so the character just jumps up.
      this.targetPosition = {
        x: this.initialPosition.x,
        y: this.initialPosition.y,
        z: this.initialPosition.z,
      };
      this._hero.moving = false;
    }

    const targetRow =
      this.gameMap.getRow(this.initialPosition.z + velocity.z) || {};
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
    if (this.isGameEnded()) {
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

  _onGLContextCreate = async gl => {
    const { drawingBufferWidth: width, drawingBufferHeight: height } = gl;

    // NOTE: How to create an `GLView`-compatible THREE renderer
    this.renderer = new CrossyRenderer({
      gl,
      antialias: true,
      width,
      height,
      clearColor: sceneColor,
    });

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
}
