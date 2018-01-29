import Node from './src/Node';

//a
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
  RailRoad,
  TrainLight,
  LilyPad,
} = Node;

class ModelLoader {
  _lilyPad = new LilyPad();
  _grass = new Grass();
  _road = new Road();
  _river = new River();
  _boulder = new Boulder();
  _tree = new Tree();
  _car = new Car();
  _railroad = new RailRoad();
  _train = new Train();
  _trainLight = new TrainLight();
  _log = new Log();
  _hero = new Hero();
  load = () => {
    return new Promise.all([
      this._lilyPad.setup(),
      this._road.setup(),
      this._grass.setup(),
      this._river.setup(),
      this._log.setup(),
      this._boulder.setup(),
      this._tree.setup(),
      this._car.setup(),
      this._railroad.setup(),
      this._train.setup(),
      this._hero.setup(),
      this._trainLight.setup(),
    ]);
  };
}

ModelLoader.shared = new ModelLoader();

export default ModelLoader;
