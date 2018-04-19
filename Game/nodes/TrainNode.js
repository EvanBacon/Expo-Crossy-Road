import Assets from '../../Assets';
import MultiObjectNode from './MultiObjectNode';
import TrainCarNode from './TrainCarNode';

class TrainNode extends CrossyNode {
  async loadAsync(scene) {
    let types = [
      new TrainCarNode({ type: 'front' }),
      new TrainCarNode({ type: 'back' }),
    ];

    for (let i = 0; i < Math.floor(Math.random() * 3 + 1); i++) {
      types.splice(1, 0, new TrainCarNode({ type: 'middle' }));
    }

    const promises = types.map(type => this.add(type));
    const nodes = await Promise.all(promises);
    nodes.forEach((node, index) => (node.column = index));

    return super.loadAsync(scene);
  }
}

export default TrainNode;
