import Assets from '../../Assets';
import MultiObjectNode from './MultiObjectNode';
import MapSize from '../../constants/MapSize';

class CyclingMultiObjectNode extends MultiObjectNode {
  velocity = 1;
  constructor({ velocity, ...props }) {
    super(props);
    this.velocity = velocity;
  }

  update(delta, time) {
    super.update();
    this.position.x += this.velocity * delta;
    if (this.position.x > MapSize.rows) {
      this.position.x = 0;
    } else if (this.position.x < 0) {
      this.position.x = MapSize.rows;
    }
  }
}

export default CyclingMultiObjectNode;
