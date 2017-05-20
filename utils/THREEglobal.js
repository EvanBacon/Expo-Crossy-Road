import * as THREE from 'three';

global.THREE = THREE;
export {THREE};
require('three/examples/js/effects/OutlineEffect');
require('three/examples/js/loaders/OBJLoader');

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
