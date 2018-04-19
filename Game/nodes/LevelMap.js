import Exotic from 'expo-exotic';
import ExpoTHREE from 'expo-three';
import GrassFloorRow from './GrassFloorRow';
import RiverFloorRow from './RiverFloorRow';
import RoadFloorRow from './RoadFloorNode';
import RailRoadFloorRow from './RailRoadFloorNode';
import MapSize from '../../constants/MapSize';

class LevelMap extends Exotic.GameObject {
  async loadAsync(scene, modelIndex) {
    let types = [];

    for (let i = 0; i < MapSize.visibleColumns - 2; i++) {
      if (i < MapSize.initialPlayerColumn - 2) {
        types.push(new GrassFloorRow({ type: `${i % 2}`, isFilled: true }));
      } else if (i < MapSize.initialPlayerColumn + 2) {
        types.push(new GrassFloorRow({ type: `${i % 2}`, isFilled: false }));
      } else {
        let node = (Math.random() * 3) | 0;

        switch (node) {
          case 0:
            types.push(new GrassFloorRow({ type: `${i % 2}` }));
            break;
          case 1:
            types.push(new RiverFloorRow({ index: i }));
            break;
          case 2:
            types.push(new RailRoadFloorRow());
            break;
        }
      }
    }

    const promises = types.map(type => this.add(type));
    const nodes = await Promise.all(promises);

    nodes.forEach((node, index) => (node.column = index));

    return super.loadAsync(scene);
  }
}

export default LevelMap;
