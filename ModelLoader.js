
import Node from './src/Node';
const {
  Hero,
  Car,
  Log,
  Road,
  Grass,
  River,
  Tree,
  Train,
  Boulder,
  RailRoad
} = Node;

class ModelLoader {
  constructor() {
    // (async () => {
    //   await this.loadModels();
    // })()
  }

  loadModels = async () => {
    this._grass = new Grass();
    this._road = new Road();
    this._river = new River();
    this._boulder = new Boulder();
    this._tree = new Tree();
    this._car = new Car();
    this._railroad = new RailRoad();
    this._train = new Train();
    this._log = new Log();
    this._hero = new Hero();

    try {
      await Promise.all([
        this._road.setup(),
        this._grass.setup(),
        this._river.setup(),
        this._log.setup(),
        this._boulder.setup(),
        this._tree.setup(),
        this._car.setup(),
        this._railroad.setup(),
        this._train.setup(),
        this._hero.setup()
      ]);
      console.log("Done Loading 3D Models!");
    } catch(error) {
      console.warn(`:( We had a problem loading the 3D Models: ${error}`);
    } finally {
      //TODO: Add some complicated code so people think that I'm a really good programmer...
    }

  }

}

export default ModelLoader;
