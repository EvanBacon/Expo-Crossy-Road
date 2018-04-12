import Exotic from 'expo-exotic';
import ExpoTHREE, { THREE } from 'expo-three';
import { PixelRatio } from 'react-native';

import PlayingLevel from './levels/PlayingLevel';
import Colors from '../constants/Colors';

class Game extends Exotic.Game {
  onContextCreate = async ({ gl, width, height, scale }) => {
    Exotic.Factory.shared.initMaterials(Colors);
    this.configureRenderer({ gl, width, height, scale });
    this.scene.size = { width: width, height: height };

    /// Standard Camera
    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.01, 10000);
    await this.loadAsync(this.scene);
  };

  configureRenderer = ({ gl, width, height, scale }) => {
    const fastDevice = true;

    // renderer
    this.renderer = ExpoTHREE.createRenderer({
      gl,
      precision: fastDevice ? 'highp' : 'mediump',
      antialias: fastDevice ? true : false,
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
    return super.loadAsync(this.scene);
  };

  update = (delta, time) => {
    this.renderer.render(this.scene, this.camera);

    super.update(delta, time);
  };
}

export default Game;
