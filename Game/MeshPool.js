import ExpoTHREE from 'expo-three'; // Version can be specified in package.json

class MeshPool {
  meshes = {};
  constructor() {}

  getCloneForMeshNamed(name) {
    if (!(name in this.meshes)) {
      return null;
    }
    const mesh = this.meshes[name];
    return mesh.clone();
  }

  static loadStaticObjModelAsync = async ({ obj, mtl, assets }) => {
    const assetProvider = name => assets[name];
    const model = await ExpoTHREE.loadAsync([obj, mtl], null, assetProvider);
    return model;
  };
}
MeshPool.shared = new MeshPool();

export default MeshPool;
