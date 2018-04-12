import Exotic from 'expo-exotic';
import * as CANNON from 'cannon';
import ExpoTHREE, { THREE } from 'expo-three';
import Assets from '../../Assets';

class Train extends Exotic.PhysicsObject {
  /*
    This is called right after loadAsync.
    We use this time to setup the physics.
  */
  loadBody = () => {
    this.body = new CANNON.Body({
      mass: 0.5,
      material: new CANNON.Material(),
    });
    const { size } = this;
    this.body.addShape(
      new CANNON.Box(new CANNON.Vec3(this.width / 2, this.height / 2, this.depth / 2))
    );
  };

  async loadAsync(scene) {
    const assetProvider = name => Assets.models.train[name];

    const model = await ExpoTHREE.loadAsync(
      [Assets.models.train['model.obj'], Assets.models.train['material.mtl']],
      null,
      assetProvider
    );
    ExpoTHREE.utils.computeMeshNormals(model);
    ExpoTHREE.utils.scaleLongestSideToSize(model, 2);
    ExpoTHREE.utils.alignMesh(model);

    this.add(model);

    return super.loadAsync(scene);
  }
}

export default Train;
