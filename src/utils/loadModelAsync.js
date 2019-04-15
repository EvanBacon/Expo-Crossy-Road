import { Asset } from 'expo';
import * as THREE from 'three';

import ExpoTHREE from '../../ExpoTHREE.web';

function textureFromAsset(asset) {
  if (!asset.localUri) {
    throw new Error(
      `Asset '${asset.name}' needs to be downloaded before ` +
        `being used as an OpenGL texture.`,
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

async function loadOBJAsync(resource) {
  const asset = Asset.fromModule(resource);
  if (!asset.localUri) {
    await asset.downloadAsync();
  }
  if (!THREE.OBJLoader) {
    require('three/examples/js/loaders/OBJLoader');
  }
  const loader = new THREE.OBJLoader();
  return await new Promise((resolve, reject) =>
    loader.load(asset.localUri, resolve, () => {}, reject),
  );
}

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
  const _model = await loadOBJAsync(model);
  const _texture = await loadTextureAsync(texture);

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
