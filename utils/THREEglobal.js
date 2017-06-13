import * as THREE from 'three';

global.THREE = THREE;
export {THREE};


require('three/examples/js/shaders/CopyShader');
require('three/examples/js/shaders/DotScreenShader');
require('three/examples/js/shaders/RGBShiftShader');

require('three/examples/js/postprocessing/EffectComposer')
require('three/examples/js/postprocessing/RenderPass')
require('three/examples/js/postprocessing/ShaderPass')

require('three/examples/js/effects/ParallaxBarrierEffect');

require('three/examples/js/effects/OutlineEffect');
require('three/examples/js/loaders/OBJLoader');

// require('three/src/math/Vector3');
// require('three/src/loaders/FontLoader');
// require('three/src/geometries/TextGeometry');


if (!console.time) {
  console.time = () => {};
}
if (!console.timeEnd) {
  console.timeEnd = () => {};
}

console.ignoredYellowBox = [
  'THREE.WebGLRenderer',
  'THREE.WebGLProgram',
];
