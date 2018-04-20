import Exotic from 'expo-exotic';
import ExpoTHREE from 'expo-three';
import GrassFloorRow from './GrassFloorRow';
import RiverFloorRow from './RiverFloorRow';
import RoadFloorRow from './RoadFloorNode';
import RailRoadFloorRow from './RailRoadFloorNode';
import MapSize from '../../constants/MapSize';
import VelocitySettings from '../../constants/VelocitySettings';
import Direction from '../Direction';

class LevelMap extends Exotic.GameObject {
  rows = []
  obstacleMap = {}
  async loadAsync(scene, modelIndex) {
    let types = [];

    for (let i = 0; i < MapSize.visibleColumns - 2; i++) {
      if (i < MapSize.initialPlayerColumn - 2) {
        let row = new GrassFloorRow({ type: `${i % 2}`, isFilled: true })
        row.rowIndex = i
        types.push(row);
      } else if (i < MapSize.initialPlayerColumn + 2) {
        let row = new GrassFloorRow({ type: `${i % 2}`, isFilled: false })
        row.rowIndex = i
        types.push(row);
      } else {
        let node = (Math.random() * 4) | 0;

        switch (node) {
          case 0:
            // types.push(new GrassFloorRow({ type: `${i % 2}` }));
            break;
          case 1:
            // types.push(new RiverFloorRow({ index: i }));
            break;
          case 2:
            // types.push(new RailRoadFloorRow());
            break;
          case 3:
          {
            let node = new RoadFloorRow({ type: `${i % 2}` })
            types.push(node);
            this.rows.push(node)
          }
            break;
        }
      }
    }

    const promises = types.map(type => this.add(type));
    const nodes = await Promise.all(promises);

    nodes.forEach((node, index) => (node.column = index));

    return super.loadAsync(scene);
  }

  canMove = (player, direction) => {
    const x = Math.floor(player.position.x)
    const z = Math.floor(player.position.z)
    let moveSettings = VelocitySettings[direction]
    let targetPosition = {
      x: x + moveSettings.x,
      z: z + moveSettings.z,
    }
    const obstacle = global.obstacleMap[`${targetPosition.x}|${targetPosition.z}`]
    if (obstacle) {
      return false
    }
    return true  
    // switch (direction) {
    //   case Direction.UP:
    //   {

    //   }
    //   break;
    //   case Direction.DOWN:
    //   {
        
    //   }
    //   break;
    //   case Direction.LEFT:
    //   {
        
    //   }
    //   break;
    //   case Direction.RIGHT:
    //   {
        
    //   }
    //   break;
    // }
  }

  update(delta, time) {
    super.update(delta, time)
  }
}

export default LevelMap;
