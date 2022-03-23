import { Asset } from "expo-asset";
import { loadObjAsync } from "expo-three";
import { Box3, Mesh } from "three";

import Models from "../../src/Models";
import CrossyMaterial from "../CrossyMaterial";

function setShadows(mesh, { castShadow, receiveShadow }) {
  mesh.traverse((child) => {
    if (child instanceof Mesh) {
      child.castShadow = castShadow;
      child.receiveShadow = receiveShadow;
    }
  });

  mesh.castShadow = castShadow;
  mesh.receiveShadow = receiveShadow;
}
export default class Generic {
  models = {};

  globalModels = Models;

  getSize = (mesh) => {
    let box = new Box3().setFromObject(mesh);
    // console.log( box.min, box.max, box.size() );
    return box.size();
  };
  getWidth = (mesh) => {
    let box = new Box3().setFromObject(mesh);
    // console.log( box.min, box.max, box.size() );
    return box.size().width;
  };

  _downloadAssets = async ({
    name,
    model,
    texture,
    castShadow,
    receiveShadow,
  }) => {
    const material = CrossyMaterial.load(texture);

    const _model = await loadObjAsync({ asset: model });

    _model.traverse((child) => {
      if (child instanceof Mesh) {
        child.material = material;
      }
    });

    setShadows(_model, { castShadow, receiveShadow });
    return _model;
  };

  getRandom = () => {
    let keys = Object.keys(this.models);
    const key = keys[(keys.length * Math.random()) << 0];
    return this.models[key].clone();
  };

  getNode(key = "0") {
    if (key in this.models) {
      return this.models[key].clone();
    } else {
      throw new Error(
        `Generic: Node with Key ${key} does not exist in ${JSON.stringify(
          Object.keys(this.models),
          null,
          2
        )}`
      );
    }
  }

  _register = async (key, props) => {
    return (this.models[key] = await this._download(props));
  };

  _download = async (props) => {
    return await this._downloadAssets(props);
  };

  setup = async () => {};
}
