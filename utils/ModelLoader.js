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

export default (async name => {
  if (!Models.hasOwnProperty(name)) {
    return null;
  }
  let asset = Models[name];

  const loader = new THREE.OBJLoader();
  let model = await new Promise((resolve, reject) =>
  loader.load(
    Expo.Asset.fromModule(asset.model).uri,
    resolve,
    () => {},
    reject)
  );
  const textureAsset = Expo.Asset.fromModule(asset.texture);

  await textureAsset.downloadAsync();
  const texture = THREEView.textureFromAsset(textureAsset);
  texture.magFilter = THREE.LinearFilter;
  texture.minFilter = THREE.LinearFilter;
  model.traverse(child => {
    if (child instanceof THREE.Mesh) {
      // child.material.color = 0x00ff00;
      child.material.map = texture;
    }
  });

  return model;
});
