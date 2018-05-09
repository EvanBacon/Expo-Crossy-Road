import * as CANNON from 'cannon';
import Exotic from 'expo-exotic';
import ExpoTHREE, { THREE } from 'expo-three';

import Assets from '../../Assets';
// import Gem from '../nodes/Gem';
import Ground from '../nodes/Ground';
import Player from '../nodes/Player';
import Lighting from '../nodes/Lighting';
import GrassFloorRow from '../nodes/GrassFloorRow';
import LevelMap from '../nodes/LevelMap';
import Colors from '../../constants/Colors';
import MapSize from '../../constants/MapSize';
// import Train from '../nodes/Train';

require('three/examples/js/controls/OrbitControls');

const startingRow = 2;

class PlayingLevel extends Exotic.GameObject {
  raycaster = new THREE.Raycaster();

  /*
    We use loadAsync in a nested form because this helps the components know when to hide the loader.
  */
  loadAsync = async () => {
    await this.loadObjects();

    this.configureCamera();
    this.configureWorld();
    await this.configureScene();
    // this.game.debugPhysics = true;

    // new THREE.OrbitControls(this.game.camera);

    return await super.loadAsync();
  };

  configureScene = async () => {
    // this.game.scene.background = await ExpoTHREE.loadCubeTextureAsync({
    //   assetForDirection: ({ direction }) =>
    //     Assets.images.skybox[direction + '.jpg'],
    // });
    this.game.scene.fog = new THREE.Fog(Colors.blue, 100, 150);
  };

  configureCamera = () => {
    // this.game.camera.position.set(5, 3, -10);
    // this.game.camera.lookAt(0, 0, 0);
  };

  configureWorld = () => {
    // this.game.world.gravity.set(0, -5, 0);
    // this.game.world.defaultContactMaterial.contactEquationStiffness = 1e8;
    // this.game.world.defaultContactMaterial.contactEquationRelaxation = 10;
    // this.game.world.defaultContactMaterial.friction = 0;
  };

  camCount = 0;

  forwardScene = () => {
    const easing = 0.03;
    this.position.z -=
      (this.game.player.position.z - startingRow + this.position.z) * easing;

    const targetX = this.position.x; //- MapSize.initialPlayerRow;
    const bufferX = 2;
    this.position.x =
      this.position.x + (this.game.player.position.x - targetX) * easing;
    //  -Math.min(
    //   bufferX,
    //   Math.max(
    //     -bufferX,
    //     this.position.x + (this.game.player.position.x - targetX) * easing,
    //   ),
    // );

    // normal camera speed
    if (-this.position.z - this.camCount > 1.0) {
      this.camCount = -this.position.z;
      this.newRow();
    }
  };

  newRow = () => {};

  update(delta, time) {
    super.update(delta, time);
    // this.forwardScene();
  }

  loadObjects = async () => {
    /*
    When we add `GameObject`s to eachother, they call `loadAsync` so we initialize in a promise.
    */
    const types = [new Player(), new LevelMap(), new Lighting()];
    const promises = types.map(type => this.add(type));
    const [player, levelMap, lighting] = await Promise.all(promises);
    this.game.player = player;
    this.game.levelMap = levelMap;

    global.onSwipe = direction => {
      player.rotate(direction);
      if (levelMap.canMove(player, direction)) {
        player.move(direction);
      }
    };

    //s this.hero = hero;
    // this.ground = ground;

    // this.game.world.addContactMaterial(
    //   new CANNON.ContactMaterial(ground.body.material, hero.body.material, {
    //     friction: 0.0,
    //     restitution: 0.5,
    //   }),
    // );
    // this.game.world.addContactMaterial(
    //   new CANNON.ContactMaterial(ground.body.material, gem.body.material, {
    //     friction: 0.0,
    //     restitution: 0.9,
    //   }),
    // );
  };

  // onTouchesBegan = ({ locationX: x, locationY: y }) => {
  //   // this.hero.body.position.set(0, 0, 0);
  //   // this.hero.body.velocity.set(0, 0, 0);
  //   // this.runHitTest();
  // };

  runHitTest = () => {
    this.raycaster.setFromCamera(this.game.touch, this.game.camera);
    const intersects = this.raycaster.intersectObjects(this.ground.children);
    for (const intersect of intersects) {
      const { distance, face, faceIndex, object, point, uv } = intersect;

      this.hero.body.position.x = point.x;
      this.hero.body.position.z = point.z;
    }
  };
}

export default PlayingLevel;
