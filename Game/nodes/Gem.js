import Exotic from 'expo-exotic';
import * as CANNON from 'cannon';
import ExpoTHREE, { THREE } from 'expo-three';
import Assets from '../../Assets';

class Gem extends Exotic.PhysicsObject {
  loadBody = () => {
    this.body = new CANNON.Body({
      mass: 0.5,
      material: new CANNON.Material(),
    });
    this.body.addShape(new CANNON.Sphere(1));
    this.body.linearDamping = 0.01;
  };

  get gemGeometry() {
    const geometry = new THREE.CylinderGeometry(0.6, 1, 0.3, 6, 1);
    geometry.vertices[geometry.vertices.length - 1].y = -1;
    geometry.verticesNeedUpdate = true;
    return geometry;
  }

  get outline() {
    const material = Exotic.Factory.shared.materials.white.clone();
    material.side = THREE.BackSide;
    const mesh = new THREE.Mesh(this.gemGeometry, material);
    mesh.scale.multiplyScalar(1.1);
    return mesh;
  }

  get gem() {
    const material = Exotic.Factory.shared.materials.green;
    const mesh = new THREE.Mesh(this.gemGeometry, material);
    return mesh;
  }

  loadGlow = async () => {
    const spriteMaterial = new THREE.SpriteMaterial({
      map: await ExpoTHREE.loadAsync(Assets.images['glow.png']),
      color: 0x00ff00,
      transparent: false,
      blending: THREE.AdditiveBlending,
    });
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.multiplyScalar(3);

    return sprite;
  };
  async loadAsync(scene) {
    const { gem } = this;
    this.add(gem);
    this.add(this.outline);

    const glow = await this.loadGlow();
    gem.add(glow);

    return super.loadAsync(scene);
  }
}

export default Gem;
