import Exotic from 'expo-exotic';
import * as CANNON from 'cannon';
import { THREE } from 'expo-three';

class Hero extends Exotic.PhysicsObject {
  /*
    This is called right after loadAsync.
    We use this time to setup the physics.
  */
  loadBody = () => {
    this.body = new CANNON.Body({
      mass: 0.5,
      material: new CANNON.Material(),
    });
    this.body.addShape(new CANNON.Sphere(1));
  };

  /*
    I like to bubble out variables so you can always use the `geometry`, `material`, `mesh` variable names.
  */
  get ball() {
    const geometry = new THREE.SphereBufferGeometry(1, 20, 10);

    /*
      Use a recycled material!
    */
    const material = Exotic.Factory.shared.materials.white;
    const mesh = new THREE.Mesh(geometry, material);
    return mesh;
  }
  async loadAsync(scene) {
    this.add(this.ball);
    return super.loadAsync(scene);
  }
}

export default Hero;
