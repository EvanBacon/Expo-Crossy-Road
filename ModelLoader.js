import Hero from './src/Node/Hero';
import Car from './src/Node/Car';
import Log from './src/Node/Log';
import Road from './src/Node/Road';
import Grass from './src/Node/Grass';
import River from './src/Node/River';
import Tree from './src/Node/Tree';
import Train from './src/Node/Train';
import Boulder from './src/Node/Boulder';
import RailRoad from './src/Node/RailRoad';
import TrainLight from './src/Node/TrainLight';
import LilyPad from './src/Node/LilyPad';

class ModelLoader {
  loadModels = async () => {
    this._lilyPad = new LilyPad();
    this._grass = new Grass();
    this._road = new Road();
    this._river = new River();
    this._boulder = new Boulder();
    this._tree = new Tree();
    this._car = new Car();
    this._railroad = new RailRoad();
    this._train = new Train();
    this._trainLight = new TrainLight();
    this._log = new Log();
    this._hero = new Hero();

    // try {
    await Promise.all([
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
    console.log('Done Loading 3D Models!');
    // } catch (error) {
    //   console.warn(`:( We had a problem loading the 3D Models: ${error}`);
    // }
  };
}

export default new ModelLoader();
