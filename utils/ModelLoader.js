import Expo from 'expo'
import * as THREE from 'three';
import Models from '../Models';

global.THREE = THREE;
require('three/examples/js/loaders/OBJLoader');
const THREEView = Expo.createTHREEViewClass(THREE);

if (!console.time) {
  console.time = () => {};
}
if (!console.timeEnd) {
  console.timeEnd = () => {};
}

export default (async ({model, texture}) => {


  const loader = new THREE.OBJLoader();
  let _model = await new Promise((resolve, reject) =>
  loader.load(
    Expo.Asset.fromModule(model).uri,
    resolve,
    () => {},
    reject)
  );
  const textureAsset = Expo.Asset.fromModule(texture);

  await textureAsset.downloadAsync();
  const _texture = THREEView.textureFromAsset(textureAsset);
  _texture.magFilter = THREE.LinearFilter;
  _texture.minFilter = THREE.LinearFilter;
  _model.traverse(child => {
    if (child instanceof THREE.Mesh) {
      // child.material.color = 0x00ff00;
      child.material.map = _texture;
    }
  });

  return _model;
});
