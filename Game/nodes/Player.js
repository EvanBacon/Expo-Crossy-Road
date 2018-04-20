import Assets from '../../Assets';
import CrossyNode from './CrossyNode';
import MapSize from '../../constants/MapSize';
import VelocitySettings from '../../constants/VelocitySettings';

class Player extends CrossyNode {
  constructor() {
    super();
    this.resetPosition();
  }

  resetPosition = () => {
    this.elevation = 0;
    this.row = MapSize.initialPlayerRow;
    this.column = MapSize.initialPlayerColumn;
  };

  name = 'characters.chicken';
  async loadAsync(scene) {
    const modelIndex = Assets.models.characters.chicken;
    let node = await super.loadAsync(scene, modelIndex, {x: 0.5, y: 1, z: 0.5});
    node.position.x = 0.5
    node.position.z = -0.5
    this.characterNode = node
    return node
  }


  rotate = direction => {
    const { angle } = VelocitySettings[direction]
    this.characterNode.rotation.y = angle
  }

  move = direction => {
    let moveSettings = VelocitySettings[direction]
    this.position.x += moveSettings.x
    this.position.z += moveSettings.z
  }
}

export default Player;
