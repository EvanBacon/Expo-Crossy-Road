'use strict';

import React from 'react';
import PropTypes from 'prop-types'; // ES6
import { View } from 'react-native';

import {GLView} from 'expo';

export default THREE => class THREEView extends React.Component {
  static propTypes = {
    // Parameters to http://threejs.org/docs/?q=webgl#Reference/Renderers/WebGLRenderer.render
    scene: PropTypes.object,
    camera: PropTypes.object,

    // Whether to automatically set the aspect ratio of the camera from
    // the viewport. Defaults to `true`.
    autoAspect: PropTypes.bool,

    // NOTE: 0x000000 is considered a PropType.number, while '#000000' is considered a PropType.string.
    backgroundColor: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    backgroundColorAlpha: PropTypes.number,

    //If set, use shadow maps in the scene.
    //Default Value: false
    shadowMapEnabled: PropTypes.bool,

    //Defines shadow map type (unfiltered, percentage close filtering, percentage close filtering with bilinear filtering in shader).
    //Default Value: THREE.PCFShadowMap
    // shadowMapType: PropTypes.oneOf([THREE.BasicShadowMap, THREE.PCFShadowMap, THREE.PCFSoftShadowMap]),

    //Whether to render the opposite side as specified by the material into the shadow map. When disabled, an appropriate shadow.bias must be set on the light source for surfaces that can both cast and receive shadows at the same time to render correctly.
    //Default Value: true
    shadowMapRenderReverseSided: PropTypes.bool,

    //Whether to treat materials specified as double-sided as if they were specified as front-sided when rendering the shadow map. When disabled, an appropriate shadow.bias must be set on the light source for surfaces that can both cast and receive shadows at the same time to render correctly.
    //Default Value: true
    shadowMapRenderSingleSided: PropTypes.bool,

    // Called every animation frame with one parameter `dt` which is the
    // time in seconds since the last animation frame
    tick: PropTypes.func,

  };

  static defaultProps = {
    autoAspect: true,
    backgroundColor: 0x000000,
    backgroundColorAlpha: 1,
    shadowMapEnabled: true,
    // shadowMapType: THREE.PCFShadowMap,
    shadowMapRenderReverseSided: true,
    shadowMapRenderSingleSided: true
  };

  // Get a three.js texture from an Exponent Asset
  static textureFromAsset(asset) {
    if (!asset.localUri) {
      throw new Error(
        `Asset '${asset.name}' needs to be downloaded before ` +
          `being used as an OpenGL texture.`
      );
    }
    const texture = new THREE.Texture();
    texture.image = {
      data: asset,
      width: asset.width,
      height: asset.height,
    };
    texture.needsUpdate = true;
    texture.isDataTexture = true; // send to gl.texImage2D() verbatim
    return texture;
  }

  _onContextCreate = gl => {

    gl.createFramebuffer = () => {
      return null;
    };
    gl.createRenderbuffer = () => {
      return null;
    };
    gl.bindRenderbuffer = (target, renderbuffer) => {};
    gl.renderbufferStorage = (target, internalFormat, width, height) => {};
    gl.framebufferTexture2D = (target, attachment, textarget, texture, level) => {};
    gl.framebufferRenderbuffer = (target, attachmebt, renderbuffertarget, renderbuffer) => {};


    var colorBuffer = gl.createRenderbuffer();
    gl.bindRenderbuffer(gl.RENDERBUFFER, colorBuffer);


    let threeRendererOptions = {
      canvas: {
        width: gl.drawingBufferWidth,
        height: gl.drawingBufferHeight,
        style: {},
        addEventListener: () => {},
        removeEventListener: () => {},
        clientHeight: gl.drawingBufferHeight,
      },
      context: gl,
      antialias: true,
    };


    const renderer = new THREE.WebGLRenderer(threeRendererOptions);

    // renderer.shadowMap.enabled = true;
    // renderer.shadowMap.type = THREE.PCFShadowMap; // default THREE.PCFShadowMap
    // renderer.shadowMap.cascade = true;
    //
    // renderer.gammaInput = true;
    // renderer.gammaOutput = true;

 //    let effect = new THREE.OutlineEffect( renderer,{
 // defaultThickNess: 0.1,
 //  	defaultColor: new THREE.Color( 0x888888 ),
 // 	defaultAlpha: 1,
 //  	defaultKeepAlive: true // keeps outline material in cache even if material is removed from scene
 // } );

    renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);
    renderer.setClearColor(
      this.props.backgroundColor,
      this.props.backgroundColorAlpha
    );

    // renderer.shadowMap.enabled = this.props.shadowMapEnabled;
    // // renderer.shadowMap.type = this.props.shadowMapType;
    // renderer.shadowMap.type = THREE.BasicShadowMap;
    // renderer.shadowMap.renderReverseSided = this.props.shadowMapRenderReverseSided;
    // renderer.shadowMap.renderSingleSided = this.props.shadowMapRenderSingleSided;
    // renderer.shadowMap.cascade = true;



    let lastFrameTime;
    const animate = () => {
      this._requestAnimationFrameID = requestAnimationFrame(animate);

      const now = 0.001 * global.nativePerformanceNow();
      const dt = typeof lastFrameTime !== 'undefined'
        ? now - lastFrameTime
        : 0.16666;

      if (this.props.tick) {
        this.props.tick(dt);
      }

      if (this.props.scene && this.props.camera) {
        const camera = this.props.camera;
        if (this.props.autoAspect && camera.aspect) {
          const desiredAspect = gl.drawingBufferWidth / gl.drawingBufferHeight;
          if (camera.aspect !== desiredAspect) {
            camera.aspect = desiredAspect;
            camera.updateProjectionMatrix();
          }
        }
        // effect.render( this.props.scene, camera );

        renderer.render(this.props.scene, camera);
      }
      gl.flush();
      gl.endFrameEXP();

      lastFrameTime = now;
    };
    animate();
  };

  componentWillUnmount() {
    if (this._requestAnimationFrameID) {
      cancelAnimationFrame(this._requestAnimationFrameID);
    }
  }

  render() {
    // eslint-disable-next-line no-unused-vars
    const { scene, camera, autoAspect, tick, ...viewProps } = this.props;
    return <GLView {...viewProps} onContextCreate={this._onContextCreate} />;
  }
};
