import * as CANNON from 'cannon';
import ExpoTHREE, { THREE } from 'expo-three';

import Exotic from 'expo-exotic';

/*
  This is a general component and demonstrates a static physical object.
*/
class Land extends Exotic.PhysicsObject {
  loadBody = () => {
    /*
      setting mass to 0 makes this static. I just added the type key for no reason :)
    */
    this.body = new CANNON.Body({
      position: new CANNON.Vec3(0, -5, 0),
      mass: 0,
      type: CANNON.Body.STATIC,
      material: new CANNON.Material(),
    });
    this.body.addShape(new CANNON.Plane());

    /*
    We wait to rotate the plane because any manipulation on the mesh will be useless. Just manipulate the body
    */
    this.body.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
  };

  loadAsync = async scene => {
    const geometry = new THREE.PlaneGeometry(1000, 1000, 1, 1);

    const texture = await ExpoTHREE.loadAsync({
      uri:
        'http://fc06.deviantart.net/fs71/f/2012/185/9/2/tileable_futuristic_grid_by_ndugger-d55yz5h.png',
    });
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(70, 70);
    const material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });

    const mesh = new THREE.Mesh(geometry, material);

    this.add(mesh);
    await super.loadAsync(scene);
  };
}

export default Land;
