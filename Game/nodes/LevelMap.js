import Exotic from 'expo-exotic';
import ExpoTHREE from 'expo-three';
import GrassFloorRow from './GrassFloorRow';

class LevelMap extends Exotic.GameObject {
  async loadAsync(scene, modelIndex) {
    const types = [
      new GrassFloorRow({ type: '0' }),
      new GrassFloorRow({ type: '1' }),
      new GrassFloorRow({ type: '0' }),
      new GrassFloorRow({ type: '1' }),
    ];
    const promises = types.map(type => this.add(type));
    const nodes = await Promise.all(promises);

    nodes.forEach((node, index) => (node.position.z = index));

    return super.loadAsync(scene);
  }
}

export default LevelMap;
