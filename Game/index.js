import Exotic from 'expo-exotic';
import ExpoTHREE, { THREE } from 'expo-three';
import { PixelRatio } from 'react-native';

import PlayingLevel from './levels/PlayingLevel';
import Colors from '../constants/Colors';
import Direction from './Direction';
import MapSize from '../constants/MapSize';
import TWEEN from './Tween';

class Game extends Exotic.Game {
  onContextCreate = async ({ gl, width, height, scale }) => {
    Exotic.Factory.shared.initMaterials(Colors);
    this.configureRenderer({ gl, width, height, scale });
    this.scene.size = { width: width, height: height };

    /// Standard Camera
    this.camera = new THREE.OrthographicCamera(
      -width,
      width,
      height,
      -height,
      -30,
      30,
    );
    this.camera.position.set(-1, 2.8, -2.9); // Change -1 to -.02
    this.camera.zoom = 110; // for birds eye view
    this.camera.updateProjectionMatrix();
    this.camera.lookAt(this.scene.position);

    // this.camera = new THREE.PerspectiveCamera(75, width / height, 0.01, 10000);
    await this.loadAsync(this.scene);
  };

  configureRenderer = ({ gl, width, height, scale }) => {
    const fastDevice = true;

    // renderer
    this.renderer = ExpoTHREE.createRenderer({
      gl,
      precision: fastDevice ? 'highp' : 'mediump',
      antialias: false,
      maxLights: fastDevice ? 4 : 2,
      stencil: false,
    });
    this.renderer.setPixelRatio(scale);
    this.renderer.setSize(width, height);
    this.renderer.setClearColor(0x000000);
  };

  onResize = ({ width, height, scale }) => {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setPixelRatio(scale);
    this.renderer.setSize(width, height);
    this.scene.size = { width, height };
  };

  loadAsync = async scene => {
    this.level = new PlayingLevel(this);
    await this.level.loadAsync(this.scene);
    this.scene.add(this.level);
    this.level.position.x = -MapSize.rows / 2;
    this.level.position.z = -8;
    return super.loadAsync(this.scene);
  };

  update = (delta, time) => {
    this.renderer.render(this.scene, this.camera);
    TWEEN.update();
    super.update(delta, time);
  };

  maxTapTime = 500;

  onTouchesBegan = () => {
    this.tapStart = Date.now();
  };
  onTouchesMoved = () => {};
  onTouchesEnded = ({ gestureState }) => {
    this.endTouches(gestureState);
  };
  onTouchesCancelled = ({ gestureState }) => {
    this.endTouches(gestureState);
  };

  endTouches = gestureState => {
    let swipeDirection = this._getSwipeDirection(gestureState);
    if (!swipeDirection) {
      if (Date.now() - this.tapStart < this.maxTapTime) {
        swipeDirection = Direction.UP;
      } else {
        return;
      }
    }
    console.log({ swipeDirection });
    this._triggerSwipeHandlers(swipeDirection, gestureState);
  };

  _triggerSwipeHandlers(swipeDirection, gestureState) {
    const { onSwipe } = global;
    onSwipe && onSwipe(swipeDirection, gestureState);
  }

  _getSwipeDirection(gestureState) {
    const { LEFT, RIGHT, UP, DOWN } = Direction;
    const { dx, dy } = gestureState;
    if (this._isValidHorizontalSwipe(gestureState)) {
      return dx > 0 ? RIGHT : LEFT;
    } else if (this._isValidVerticalSwipe(gestureState)) {
      return dy > 0 ? DOWN : UP;
    }
    return null;
  }

  _isValidHorizontalSwipe(gestureState) {
    const { vx, dy } = gestureState;
    return isValidSwipe(vx, dy);
  }

  _isValidVerticalSwipe(gestureState) {
    const { vy, dx } = gestureState;
    return isValidSwipe(vy, dx);
  }
}

const swipeConfig = {
  velocityThreshold: 0.3,
  directionalOffsetThreshold: 80,
};

function isValidSwipe(velocity, directionalOffset) {
  return (
    Math.abs(velocity) > swipeConfig.velocityThreshold &&
    Math.abs(directionalOffset) < swipeConfig.directionalOffsetThreshold
  );
}

export default Game;
