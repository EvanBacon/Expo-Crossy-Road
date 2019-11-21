import { loadObjAsync, loadTextureAsync, THREE } from 'expo-three';
import CrossyMaterial from '../CrossyMaterial';
import Models from '../../src/Models';

export default class Generic {
  models = {};

  globalModels = Models;

  getWidth = mesh => {
    var box = new THREE.Box3().setFromObject(mesh);
    // console.log( box.min, box.max, box.size() );
    return box.size().width;
  };

  _downloadAssets = async ({ model, texture, castShadow, receiveShadow }) => {
    // if (!THREE.OBJLoader) {
    //   require('three/examples/js/loaders/OBJLoader');
    // }
    // const loader = new THREE.OBJLoader();
    // let _model = await new Promise((resolve, reject) =>
    //   loader.load(Asset.fromModule(model).uri, resolve, () => {}, reject),
    // );

    const _model = await loadObjAsync({ asset: model });
    const material = CrossyMaterial.load(texture)

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

  getNode(key = '0') {
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
  }

  _download = async props => {
    return await this._downloadAssets(props);
  };

  setup = async () => { };
}
