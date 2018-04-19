import Assets from '../../Assets';
import CrossyNode from './CrossyNode';
import MapSize from '../../constants/MapSize';

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
    return super.loadAsync(scene, modelIndex);
  }
}

export default Player;
