import { Dimensions } from "react-native";

import { swipeDirections } from "../components/GestureView";
import AudioManager from "../src/AudioManager";
import ModelLoader from "../src/ModelLoader";
import Characters from "./Characters";
import {
  CrossyCamera,
  CrossyGameMap,
  CrossyRenderer,
  CrossyScene,
} from "./CrossyGame";
import CrossyPlayer from "./CrossyPlayer";
import {
  CAMERA_EASING,
  DEBUG_CAMERA_CONTROLS,
  groundLevel,
  PI_2,
  sceneColor,
  startingRow,
} from "./GameSettings";

const initialState = {
  id: Characters.bacon.id,
  name: Characters.bacon.name,
  index: Characters.bacon.index,
};

const normalizeAngle = (angle) => {
  return Math.atan2(Math.sin(angle), Math.cos(angle));
};

export default class Engine {
  updateScale = () => {
    const { width, height, scale } = Dimensions.get("window");
    if (this.camera) {
      this.camera.updateScale({ width, height, scale });
    }
    if (this.renderer) {
      this.renderer.setSize(width * scale, height * scale);
    }
  };

  setupGame = (character) => {
    this.scene = new CrossyScene({});

    this.camera = new CrossyCamera();

    if (DEBUG_CAMERA_CONTROLS) {
      // this.debugControls = new THREE.OrbitControls(this.camera);
    }

    this.scene.worldWithCamera.position.z = -startingRow;

    this.updateScale();

    this.gameMap = new CrossyGameMap({
      heroWidth: 0.7,
      scene: this.scene,
      onCollide: this.onCollide,
    });

    this.camCount = 0;

    // Mesh
    this._hero = new CrossyPlayer(character);

    this.scene.world.add(this._hero);

    this.scene.createParticles();
  };

  isGameEnded() {
    return !this._hero.isAlive || this._isGameStateEnded();
  }

  onCollide = async (obstacle = {}, type = "feathers", collision) => {
    if (this.isGameEnded()) {
      return;
    }
    this._hero.isAlive = false;
    this._hero.stopIdle();
    if (collision === "car") {
      AudioManager.playCarHitSound();
      AudioManager.playDeathSound();
    } else if (collision === "train") {
      await AudioManager.playAsync(AudioManager.sounds.train.die[`0`]);
      AudioManager.playDeathSound();
    }
    this.scene.useParticle(this._hero, type, obstacle.speed);
    this.scene.rumble();
    this.gameOver();
  };

  // Setup initial scene
  init = () => {
    this.onGameInit();

    this.camera.position.z = 1;
    this._hero.reset();

    this.scene.resetParticles(this._hero.position);

    this.camCount = 0;

    this.gameMap.reset();

    this._hero.idle();
    this.gameMap.init();

    this.onGameReady();
  };

  // Move scene forward
  forwardScene = () => {
    this.scene.world.position.z -=
      (this._hero.position.z - startingRow + this.scene.world.position.z) *
      CAMERA_EASING;
    this.scene.world.position.x = -Math.min(
      2,
      Math.max(
        -2,
        this.scene.world.position.x +
          (this._hero.position.x - this.scene.world.position.x) * CAMERA_EASING
      )
    );

    // normal camera speed
    if (-this.scene.world.position.z - this.camCount > 1.0) {
      this.camCount = -this.scene.world.position.z;
      this.gameMap.newRow();
    }
  };

  // Reset variables, restart game
  gameOver = () => {
    this._hero.moving = false;
    // Stop player from finishing a movement
    this._hero.stopAnimations();
    this.onGameEnded();
    // this.gameState = State.Game.gameOver;

    // this.props.setGameState(this.gameState);
  };

  tick = (dt) => {
    // this.drive();

    this.gameMap.tick(dt, this._hero);

    if (!this._hero.moving) {
      this._hero.moveOnEntity();
      this._hero.moveOnCar();
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
      AudioManager.playDeathSound();
    }

    // Check if offscreen
    if (this._hero.position.x < -5 || this._hero.position.x > 5) {
      this.scene.rumble();
      this.gameOver();
      AudioManager.playDeathSound();
    }
  };

  pause() {
    cancelAnimationFrame(this.raf);
  }

  unpause() {
    const render = () => {
      this.raf = requestAnimationFrame(render);
      const time = Date.now();
      this.tick(time);
      this.renderer.render(this.scene, this.camera);

      // NOTE: At the end of each frame, notify `Expo.GLView` with the below
      this.renderer.__gl.endFrameEXP();
    };
    render();
  }

  updateScore = () => {
    const position = Math.max(Math.floor(this._hero.position.z) - 8, 0);
    this.onUpdateScore(position);
  };

  moveWithDirection = (direction) => {
    if (this.isGameEnded()) {
      return;
    }

    const { SWIPE_UP, SWIPE_DOWN, SWIPE_LEFT, SWIPE_RIGHT } = swipeDirections;

    this._hero.ridingOn = null;

    if (!this._hero.initialPosition) {
      this._hero.initialPosition = this._hero.position;
      this._hero.targetPosition = this._hero.initialPosition;
    }

    this._hero.skipPendingMovement();

    let velocity = { x: 0, z: 0 };

    this._hero.targetRotation = normalizeAngle(this._hero.rotation.y);
    // const normalizedRotation = normalizeAngle(this._hero.rotation.y)
    switch (direction) {
      case SWIPE_LEFT:
        {
          this._hero.targetRotation = PI_2; // calculateRotation(targetRotation, Math.PI / 2);

          velocity = { x: 1, z: 0 };

          this._hero.targetPosition = {
            x: this._hero.initialPosition.x + 1,
            y: this._hero.initialPosition.y,
            z: this._hero.initialPosition.z,
          };
          this._hero.moving = true;
        }
        break;
      case SWIPE_RIGHT:
        {
          if (this._hero.targetPosition === 0) {
            this._hero.targetPosition = -PI_2;
          } else if (
            (this._hero.targetRotation | 0) !== -(PI_2 | 0) &&
            (this._hero.targetRotation | 0) !== ((Math.PI + PI_2) | 0)
          ) {
            this._hero.targetRotation = Math.PI + PI_2;
          }
          velocity = { x: -1, z: 0 };

          this._hero.targetPosition = {
            x: this._hero.initialPosition.x - 1,
            y: this._hero.initialPosition.y,
            z: this._hero.initialPosition.z,
          };
          this._hero.moving = true;
        }
        break;
      case SWIPE_UP:
        {
          this._hero.targetRotation = 0;
          let rowObject =
            this.gameMap.getRow(this._hero.initialPosition.z) || {};
          if (rowObject.type === "road") {
            AudioManager.playPassiveCarSound();
          }

          let shouldRound = true; // rowObject.type !== 'water';
          velocity = { x: 0, z: 1 };

          this._hero.targetPosition = {
            x: this._hero.initialPosition.x,
            y: this._hero.initialPosition.y,
            z: this._hero.initialPosition.z + 1,
          };

          if (shouldRound) {
            this._hero.targetPosition.x = Math.round(
              this._hero.targetPosition.x
            );
            const { ridingOn } = this._hero;
            if (ridingOn && ridingOn.dir) {
              if (ridingOn.dir < 0) {
                this._hero.targetPosition.x = Math.floor(
                  this._hero.targetPosition.x
                );
              } else if (ridingOn.dir > 0) {
                this._hero.targetPosition.x = Math.ceil(
                  this._hero.targetPosition.x
                );
              } else {
                this._hero.targetPosition.x = Math.round(
                  this._hero.targetPosition.x
                );
              }
            }
          }

          this._hero.moving = true;
        }
        break;
      case SWIPE_DOWN:
        {
          this._hero.targetRotation = Math.PI;
          const row = (this.gameMap.getRow(this._hero.initialPosition.z) || {})
            .type;
          let shouldRound = true; //row !== 'water';
          velocity = { x: 0, z: -1 };

          this._hero.targetPosition = {
            x: this._hero.initialPosition.x,
            y: this._hero.initialPosition.y,
            z: this._hero.initialPosition.z - 1,
          };
          if (shouldRound) {
            this._hero.targetPosition.x = Math.round(
              this._hero.targetPosition.x
            );
            const { ridingOn } = this._hero;
            if (ridingOn && ridingOn.dir) {
              if (ridingOn.dir < 0) {
                this._hero.targetPosition.x = Math.floor(
                  this._hero.targetPosition.x
                );
              } else if (ridingOn.dir > 0) {
                this._hero.targetPosition.x = Math.ceil(
                  this._hero.targetPosition.x
                );
              } else {
                this._hero.targetPosition.x = Math.round(
                  this._hero.targetPosition.x
                );
              }
            }
          }
          this._hero.moving = true;
        }
        break;
    }

    // Check collision using the computed movement.
    if (this.gameMap.treeCollision(this._hero.targetPosition)) {
      // If we collide with an object, then reset the target position so the character just jumps up.
      this._hero.targetPosition = {
        x: this._hero.initialPosition.x,
        y: this._hero.initialPosition.y,
        z: this._hero.initialPosition.z,
      };
      this._hero.moving = false;
    }

    const targetRow =
      this.gameMap.getRow(this._hero.initialPosition.z + velocity.z) || {};
    let finalY = targetRow.entity.top || groundLevel;
    // If the next move is into the river, then we want to jump into it.
    if (targetRow.type === "water") {
      const ridable = targetRow.entity.getRidableForPosition(
        this._hero.targetPosition
      );
      if (!ridable) {
        finalY = targetRow.entity.getPlayerSunkenPosition();
      } else {
        finalY =
          targetRow.entity.getPlayerLowerBouncePositionForEntity(ridable);
      }
    }

    AudioManager.playMoveSound();

    this._hero.targetPosition.y = finalY;

    this._hero.commitMovementAnimations({
      onComplete: () => this.updateScore(),
    });
  };

  beginMoveWithDirection = () => {
    if (this.isGameEnded()) {
      return;
    }
    this._hero.runPosieAnimation();
  };

  _onGLContextCreate = async (gl) => {
    const { drawingBufferWidth: width, drawingBufferHeight: height } = gl;

    this.renderer = new CrossyRenderer({
      gl,
      antialias: true,
      width,
      height,
      clearColor: sceneColor,
    });

    this.unpause();
  };
}
