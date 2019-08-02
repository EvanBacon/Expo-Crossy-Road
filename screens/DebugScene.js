import { GLView } from 'expo-gl';
import React, { Component } from 'react';
import * as THREE from 'three';

import ExpoTHREE from '../ExpoTHREE';
import { sceneColor } from '../src/GameSettings';
import Foam from '../src/Particles/Foam';

const DEBUG_CAMERA_CONTROLS = true;

class Game extends Component {
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
      this.update(time);
      this.renderer.render(this.scene, this.camera);

      // NOTE: At the end of each frame, notify `Expo.GLView` with the below
      gl.endFrameEXP();
    };
    render();

    this.setupAsync(this.renderer);
  };

  update = time => {
    if (this.foam) this.foam.update(time);
  };

  setupAsync = async renderer => {
    const camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      1,
      1000,
    );
    camera.position.z = 10;
    camera.position.y = 10;
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0xffffff, 1, 10000);

    this.scene = scene;
    this.camera = camera;
    if (DEBUG_CAMERA_CONTROLS) {
      this.debugControls = new THREE.OrbitControls(this.camera);
    }

    this.scene.add(new THREE.GridHelper(10, 10));

    var ambientLight = new THREE.AmbientLight(0x101010);
    scene.add(ambientLight);

    var pointLight = new THREE.PointLight(0xffffff, 2, 1000, 1);
    pointLight.position.set(0, 200, 200);
    scene.add(pointLight);

    var spotLight = new THREE.SpotLight(0xffffff, 0.5);
    spotLight.position.set(0, 500, 100);
    scene.add(spotLight);
    spotLight.lookAt(scene);

    this.foam = new Foam();
    await this.foam.loadAsync(this.scene);
  };

  render() {
    return (
      <GLView
        style={{ flex: 1, height: '100%', overflow: 'hidden' }}
        onContextCreate={this._onGLContextCreate}
      />
    );
  }
}

export default Game;
