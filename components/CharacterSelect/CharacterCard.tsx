import { GLView } from "expo-gl";
import { alignMesh, scaleLongestSideToSize } from "expo-three/build/utils";
import React, { Component } from "react";
import { PixelRatio, StyleSheet, View } from "react-native";
import {
  AmbientLight,
  DirectionalLight,
  PerspectiveCamera,
  Scene,
} from "three";

import { CrossyRenderer } from "../../src/CrossyGame";
import ModelLoader from "../../src/ModelLoader";

const size = 200;

export default class CharacterCard extends Component {
  scale = 0.5;
  state = {
    setup: false,
  };

  UNSAFE_componentWillMount() {
    this.scene = new Scene();

    this.lights();
    this.camera();
    this.character();

    this.setState({ setup: true });
  }
  componentWillUnmount() {
    cancelAnimationFrame(this.raf);
  }

  lights = () => {
    this.scene.add(new AmbientLight(0xffffff, 0.9));
    let shadowLight = new DirectionalLight(0xffffff, 1);
    shadowLight.position.set(1, 1, 0); //default; light shining from top
    this.scene.add(shadowLight);
  };
  updateCameraScale = ({ width, height, scale }) => {
    const edge = 1.6;

    this.camera.left = -edge * this.camera.aspect;
    this.camera.right = edge * this.camera.aspect;
    this.camera.top = edge;
    this.camera.bottom = -edge;
    this.camera.near = -10;
    this.camera.far = 25;
    // this.camera.rotation.set(-Math.PI / 4, Math.PI / 9, 0, 'YXZ');

    // this.camera.zoom = 20;
    // this.camera.updateProjectionMatrix();
  };
  camera = () => {
    this.camera = new PerspectiveCamera();

    this.camera.position.z = 1.5;
    this.camera.position.y = 1;
    this.camera.lookAt(0, 0, 0);

    this.updateCameraScale({
      width: size,
      height: size,
      scale: PixelRatio.get(),
    });
  };

  character = () => {
    console.warn("ModelLoader not imp");
    this.character = ModelLoader._hero.getNode(this.props.id);
    scaleLongestSideToSize(this.character, 1);
    alignMesh(this.character);
    // this.character.scale.set(this.scale, this.scale, this.scale);
    this.scene.add(this.character);
  };

  tick = (dt) => {
    if (!this.state.setup) {
      return;
    }
    this.character.rotation.y -= 0.03;
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

  _onGLContextCreate = async (gl) => {
    const { drawingBufferWidth: width, drawingBufferHeight: height } = gl;

    this.renderer = new CrossyRenderer({
      gl,
      antialias: true,
      width,
      height,
      // clearColor: sceneColor,
    });

    this.unpause();
  };

  render() {
    if (this.state.setup) {
      return (
        <View
          pointerEvents={"none"}
          style={StyleSheet.flatten([styles.container, this.props.style])}
        >
          <View style={{ flex: 1 }}>
            <GLView
              style={{
                flex: 1,
                backgroundColor: "orange",
                height: "100%",
                overflow: "hidden",
              }}
              onContextCreate={this._onGLContextCreate}
            />
          </View>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 0,
    width: size,
    height: size,
    justifyContent: "center",
  },
});
