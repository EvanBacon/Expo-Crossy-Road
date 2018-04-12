import Exotic from 'expo-exotic';
import { THREE } from 'expo-three';

/*
  We structure the general lighting like this, this makes it easy to forget about :)
*/
class Lighting extends Exotic.GameObject {
  get hemisphere() {
    return new THREE.HemisphereLight(0xaaaaaa, 0x000000, 0.9);
  }

  get point() {
    const light = new THREE.PointLight(0xffffff);
    light.position.set(20, 20, 20);
    return light;
  }

  get shadow() {
    let light = new THREE.DirectionalLight(0xffffff, 0.9);

    light.position.set(0, -100, 10);
    light.castShadow = true;

    light.shadow.camera.left = -650;
    light.shadow.camera.right = 650;
    light.shadow.camera.top = 650;
    light.shadow.camera.bottom = -650;
    light.shadow.camera.near = 1;
    light.shadow.camera.far = 1000;

    light.shadow.mapSize.width = 2048;
    light.shadow.mapSize.height = 2048;

    return light;
  }

  get ambient() {
    return new THREE.AmbientLight(0x666666);
  }

  loadAsync = async scene => {
    this.add(this.ambient);
    this.add(this.shadow);
    this.add(this.point);
    await super.loadAsync(scene);
  };
}

export default Lighting;
