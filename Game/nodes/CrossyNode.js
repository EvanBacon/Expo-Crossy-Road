import Exotic from 'expo-exotic';
import ExpoTHREE from 'expo-three';
import MeshPool from '../MeshPool';

class CrossyNode extends Exotic.GameObject {
  name = '';

  get column() {
    return Math.floor(this.position.z);
  }

  set column(value) {
    this.position.z = value;
  }

  get row() {
    return Math.floor(this.position.x);
  }

  set row(value) {
    this.position.x = value;
  }

  get elevation() {
    return this.position.y;
  }

  set elevation(value) {
    this.position.y = value;
  }

  async loadAsync(scene, modelIndex, alignment = { x: 1, y: 1, z: 0 }) {
    if (modelIndex) {
      let mesh = MeshPool.shared.getCloneForMeshNamed(this.name);
      if (!mesh) {
        mesh = await this.loadStaticModelFromIndexAsync(modelIndex);
        mesh.traverse(child => {
          if (child instanceof THREE.Mesh) {
            if (child.material.map) {
              child.material.map.magFilter = THREE.LinearFilter;
              child.material.map.minFilter = THREE.LinearFilter;
            }
          }
        });
        MeshPool.shared.meshes[this.name] = mesh;
        ExpoTHREE.utils.alignMesh(mesh, alignment);
      }

      this.add(mesh);
    }
    return super.loadAsync(scene);
  }

  loadStaticModelFromIndexAsync = async modelIndex => {
    const assetProvider = name => modelIndex[name];
    const model = await ExpoTHREE.loadAsync(
      [modelIndex['0.obj'], modelIndex['0.mtl']],
      null,
      assetProvider,
    );
    return model;
  };
}

export default CrossyNode;
