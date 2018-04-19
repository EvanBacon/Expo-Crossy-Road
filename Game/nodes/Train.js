import Assets from '../../Assets';
import MultiObjectNode from './MultiObjectNode';
import TrainCar from './TrainCar';

class Train extends CrossyNode {
  async loadAsync(scene) {
    let types = [
      new TrainCar({ type: 'front' }),
      new TrainCar({ type: 'back' }),
    ];

    for (let i = 0; i < Math.floor(Math.random() * 3 + 1); i++) {
      types.splice(1, 0, new TrainCar({ type: 'middle' }));
    }

    const promises = types.map(type => this.add(type));
    const nodes = await Promise.all(promises);
    nodes.forEach((node, index) => (node.column = index));

    return super.loadAsync(scene);
  }
}

export default Train;
