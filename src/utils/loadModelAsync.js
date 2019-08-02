import { Asset } from 'expo-asset';
import * as ExpoTHREE, { THREE, loadOBJAsync } from 'expo-three';
// import ExpoTHREE from '../../ExpoTHREE.web';

// async function loadOBJAsync(resource) {
//   const asset = Asset.fromModule(resource);
//   if (!asset.localUri) {
//     await asset.downloadAsync();
//   }
//   if (!THREE.OBJLoader) {
//     require('three/examples/js/loaders/OBJLoader');
//   }
//   const loader = new THREE.OBJLoader();
//   return await new Promise((resolve, reject) =>
//     loader.load(asset.localUri, resolve, () => {}, reject),
//   );
// }

async function loadTextureAsync(resource) {
  const asset = Asset.fromModule(resource);
  if (!asset.localUri) {
    await asset.downloadAsync();
  }
  const texture = ExpoTHREE.loadAsync(asset);

  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.NearestFilter;
  return texture;
}

export default async function loadModelAsync({
  model,
  texture,
  castShadow,
  receiveShadow,
}) {
  const _model = await ExpoTHREE.loadObjAsync({ asset: model });
  console.log({texture});
  const _texture = new THREE.TextureLoader().load(texture) // await ExpoTHREE.load loadTextureAsync(texture);

  _model.traverse(child => {
    if (child instanceof THREE.Mesh) {
      child.material.map = _texture;
      child.castShadow = castShadow;
      child.receiveShadow = receiveShadow;
    }
  });

  _model.castShadow = castShadow;
  _model.receiveShadow = receiveShadow;

  return _model;
}
