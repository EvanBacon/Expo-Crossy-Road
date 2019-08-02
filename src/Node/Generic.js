import { Asset } from 'expo-asset';
import { THREE, loadAsync } from 'expo-three';

import ExpoTHREE from '../../ExpoTHREE.web';
import Models from '../../Models';
// import createTHREEViewClass from '../../utils/createTHREEViewClass';

// const THREEView = createTHREEViewClass(THREE);

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

export default class Generic {
  models = {};

  globalModels = Models;

  getWidth = mesh => {
    var box = new THREE.Box3().setFromObject(mesh);
    // console.log( box.min, box.max, box.size() );
    return box.size().width;
  };

  _downloadAssets = async ({ model, texture, castShadow, receiveShadow }) => {
    if (!THREE.OBJLoader) {
      require('three/examples/js/loaders/OBJLoader');
    }
    const loader = new THREE.OBJLoader();
    let _model = await new Promise((resolve, reject) =>
      loader.load(Asset.fromModule(model).uri, resolve, () => {}, reject),
    );

    const _texture = await ExpoTHREE.loadAsync(texture);

    _texture.magFilter = THREE.NearestFilter;
    _texture.minFilter = THREE.NearestFilter;

    const material = new THREE.MeshPhongMaterial({
      map: _texture,
      flatShading: true,
      emissiveIntensity: 0,
      shininess: 0,
      reflectivity: 0,
    });

    _model.traverse(child => {
      if (child instanceof THREE.Mesh) {
        // child.material.flatShading = true;
        // child.material.emissive = 0x111111;
        child.material = material;
        child.castShadow = castShadow;
        child.receiveShadow = receiveShadow;
      }
    });

    _model.castShadow = castShadow;
    _model.receiveShadow = receiveShadow;

    return _model;
  };

  getRandom = () => {
    var keys = Object.keys(this.models);
    return this.models[keys[(keys.length * Math.random()) << 0]].clone();
  };

  getNode = (key = '0') => {
    if (key in this.models) {
      return this.models[key].clone();
    } else {
      throw new Error(
        `Generic: Node with Key ${key} does not exist in ${JSON.stringify(
          Object.keys(this.models),
          null,
          2,
        )}`,
      );
    }
  };

  _download = async props => {
    return await this._downloadAssets(props);
  };

  setup = async () => {};
}
