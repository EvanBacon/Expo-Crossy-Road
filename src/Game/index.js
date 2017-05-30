import Expo, {AppLoading} from 'expo';
import React, {Component} from 'react';
import {
  TouchableWithoutFeedback,
  Vibration,
  Animated,
  Dimensions,
  Text,
  InteractionManager,
  View,
} from 'react-native';

import GestureRecognizer, {swipeDirections} from '../GestureView';
import Water from '../Particles/Water';
import Feathers from '../Particles/Feathers';
import Foam from '../Particles/Foam';

import {TweenMax} from "gsap";
import State from '../../state';
import * as THREE from 'three';
import createTHREEViewClass from '../../utils/createTHREEViewClass';
import { NavigationActions } from 'react-navigation';

const THREEView = createTHREEViewClass(THREE);
const {width, height} = Dimensions.get('window');

import TextMesh from '../TextMesh';
import connectGameState from '../../utils/connectGameState';
import connectCharacter from '../../utils/connectCharacter';
import RetroText from '../RetroText';
import {modelLoader} from '../../main';
export const groundLevel = 0.4;
const sceneColor = 0x6dceea;
const startingRow = 8;

import Rows from '../Row';


const AnimatedGestureRecognizer = Animated.createAnimatedComponent(GestureRecognizer);

@connectGameState
@connectCharacter
class Game extends Component {
  /// Reserve State for UI related updates...
  state = { ready: false, score: 0,};

  maxRows = 20;
  sineCount = 0;
  sineInc = Math.PI / 50;

  currentLog = null;

  componentWillReceiveProps(nextProps) {

    if (nextProps.gameState !== this.props.gameState) {
      this.updateWithGameState(nextProps.gameState, this.props.gameState);
    }
    if (nextProps.character.id !== this.props.character.id) {
      (async () => {

        this.scene.remove(this._hero);
        this._hero = this.hero.getNode(nextProps.character.id);
        this.scene.add(this._hero);
        this._hero.position.set(0, groundLevel, startingRow);
        this._hero.scale.set(1,1,1);

      })()
    }
  }
  updateWithGameState = (gameState, previousGameState) => {
    if (gameState == this.gameState) {
      return;
    }
    this.gameState = gameState;
    const {playing, gameOver, paused, none} = State.Game;
    switch (gameState) {
      case playing:
      this.stopIdle();
      this.onSwipe(swipeDirections.SWIPE_UP, {});

      break;
      case gameOver:

      break;
      case paused:

      break;
      case none:
      this.newScore();

      break;
      default:
      break;
    }
  }

  componentWillMount() {
    this.scene = new THREE.Scene();

    this.camera = new THREE.OrthographicCamera(-width, width, height, -height, -30, 30);
    this.camera.position.set(-1, 2.8, -2.9); // Change -1 to -.02
    this.camera.zoom = 110; // for birds eye view
    this.camera.updateProjectionMatrix();
    this.camera.lookAt(this.scene.position);

    this.doGame();
    // this.props.setGameState(State.Game.none)
  }

  createParticles = () => {


    this.waterParticles = new Water(THREE);
    this.scene.add(this.waterParticles.mesh);

    this.featherParticles = new Feathers(THREE);
    this.scene.add(this.featherParticles.mesh);

  }

  useParticle = (model, type, direction) => {
    if (type === 'water') {
      this.waterParticles.mesh.position.copy(model.position);
      this.waterParticles.mesh.visible = true;
      this.waterParticles.run(type);
    } else if (type == 'feathers') {
      this.featherParticles.mesh.position.copy(model.position);
      // this.featherParticles.mesh.visible = true;
      this.featherParticles.run(type, direction);
    }
  }

  createLights = () => {
    let globalLight = new THREE.AmbientLight(0xffffff, .8);

    let shadowLight = new THREE.DirectionalLight(0xffffff, 0.3);
    shadowLight.position.set( 1, 1, 0 ); 			//default; light shining from top
    shadowLight.lookAt( 0, 0, 0 ); 			//default; light shining from top

    this.scene.add(globalLight);
    this.scene.add(shadowLight);
  }

  newScore = () => {
    Vibration.cancel();


    // this.props.setGameState(State.Game.playing);
    this.setState({score: 0})
    this.init();
  }

  doneMoving = () => {
    this.moving = false;
this._hero.moving = false;
    this.updateScore();

    // this._hero.position.set(Math.round(this._hero.position.x), this._hero.position.y, Math.round(this._hero.position.z))
  }

  getWidth = (mesh) => {
    let box3 = new THREE.Box3();
    box3.setFromObject(mesh);
    // console.log( box.min, box.max, box.size() );
    return Math.round(box3.max.x - box3.min.x);
  }
  getDepth = mesh => {
    let box3 = new THREE.Box3();
    box3.setFromObject(mesh);
    // console.log( box.min, box.max, box.size() );
    return Math.round(box3.max.z - box3.min.z);
  }


  loadModels = async () => {
    const {_grass, _road, _river,_lilyPad, _boulder, _tree, _car, _railroad, _train, _log, _hero} = modelLoader;
    this._grass = _grass;
    this._road = _road;
    this._river = _river;
    this._lilyPad = _lilyPad;
    this._boulder = _boulder;
    this._tree = _tree;
    this._car = _car;
    this._railroad = _railroad;
    this._train = _train;
    this._log = _log;
    this.hero = _hero;

    console.log("Done Extracting 3D Models! ");

    // let textMesh = new TextMesh('Harambe', {
    //   size: 50,
    //   height: 10,
    //   curveSegments: 12,
    //   bevelThickness: 1,
    //   bevelSize: 1,
    //   bevelEnabled: true
    // });
    //
    // console.warn("Load Text");
    // textMesh._updateMesh('../../assets/fonts/retro.ttf').then(mesh => {
    //   console.warn("Text Loaded");
    //
    //   mesh.position.set(5, 1, 9);
    //   this.scene.add(mesh);
    // }).catch(console.error);

  }



  doGame = async () => {

    this.moving = false;
    this.timing = 0.10;

    // Variables
    this.grass = [],
    this.grassCount = 0; //
    this.water = [],
    this.waterCount = 0; // Terrain tiles
    this.road = [],
    this.roadCount = 0; //
    this.railRoads = [],
    this.railRoadCount = 0; //
    this.trees = [],
    this.treeCount = 0; //
    this.logs = [],
    this.logCount = 0; // Terrain objects
    this.lilys = [],
    this.lilyCount = 0; // Terrain objects

    this.trains = [],
    this.trainsCount = 0; //

    this.cars = [],
    this.carCount = 0; //

    this.onLily = null;
    this.onLog = true;
    this.hitByCar = null;

    this.lastHeroZ = 8;

    this.rowCount = 0;
    this.camCount = 0,
    this.camSpeed = .02;
    this.heroWidth = .7;

    await this.loadModels()


    this.createParticles();
    this.createLights();




    // Mesh
    // console.warn(this.props.character.id)
    this._hero = this.hero.getNode(this.props.character.id);

    //Custom Params
    this._hero.moving = false;
    this._hero.hitByTrain = null;

    this.scene.add(this._hero);


    // this.railRoad[0] = this._railroad.getRandom();
    // this.road[0] = this._road.getRandom();

    let _carMesh = this._car.getRandom();
    let _carWidth = this.getDepth(_carMesh);
    this.cars[0] = {mesh: _carMesh, width: _carWidth, collisionBox: (this.heroWidth / 2 + _carWidth / 2 - .1) };


    let _logMesh = this._log.getRandom();
    let _logWidth = this.getWidth(_logMesh);
    this.logs[0] = {mesh: _logMesh, width: _logWidth, collisionBox: (this.heroWidth / 2 + _logWidth / 2 - .1) };


    this.cars[0].mesh.position.set(0, .25, -30);
    this.cars[0].mesh.rotation.set(0, 0,0);

    this.logs[0].mesh.position.set(0, -10.5, -30);

    // Assign mesh to corresponding array
    // and add mesh to scene
    for (i = 0; i < this.maxRows; i++) {
      this.grass[i] = this._grass.getNode(`${i % 2}`);
      this.grass[i].receiveShadow = true;
      this.grass[i].castShadow = false;

      this.water[i] = this._river.getNode();
      let foam = new Foam(THREE, 1);
      foam.mesh.position.set(4.5,0.2,-0.5);
      foam.mesh.visible = true;
      foam.run();
      this.water[i].add(foam.mesh);

      this.road[i] = this._road.getRandom();
      this.road[i].receiveShadow = true;
      this.road[i].castShadow = false;


      this.railRoads[i] = new Rows.RailRoad(this.heroWidth, this.onCollide); // this._railroad.getRandom();
      this.scene.add(this.grass[i]);
      this.scene.add(this.water[i]);
      this.scene.add(this.road[i]);
      this.scene.add(this.railRoads[i]);

    }

    // Repeat above for terrain objects
    for (i = 0; i < 100; i++) {
      this.trees[i] = ((Math.random() * 3)|0) == 0 ? this._boulder.getRandom() : this._tree.getRandom();
      this.scene.add(this.trees[i]);
    }

    // Repeat above for terrain objects
    for (i = 0; i < 20; i++) {
      const mesh = this._lilyPad.getRandom();

      TweenMax.to(mesh.rotation, (Math.random() * 2) + 2, {
        y: (Math.random() * 1.5) + 0.5,
        yoyo: true,
        repeat: -1,
        ease: Power1.easeInOut
      });

      const width = this.getWidth(mesh);
      this.lilys[i] = {mesh, width, collisionBox: (this.heroWidth / 2 + width / 2 - .1) };
      this.scene.add(mesh);


    }

    for (let i = 0; i < 10; i++) {
      let mesh = this._train.withSize(3);
      let width = this.getDepth(mesh);
      this.trains[i] = {mesh, width, collisionBox: (this.heroWidth / 2 + width / 2 - .1) };
      this.scene.add(mesh);

    }


    for (i = 0; i < 40; i++) {
      let _carMesh = this._car.getRandom();
      let _carWidth = this.getDepth(_carMesh);
      this.cars[i] = {mesh: _carMesh, width: _carWidth, collisionBox: (this.heroWidth / 2 + _carWidth / 2 - .1) };
      this.scene.add(_carMesh);
    }
    for (i = 0; i < 40; i++) {
      let _logMesh = this._log.getRandom();
      let _logWidth = this.getWidth(_logMesh);
      this.logs[i] = {mesh: _logMesh, width: _logWidth, collisionBox: (this.heroWidth / 2 + _logWidth / 2 - .1) };
      this.scene.add(_logMesh);
    }


    this.init();
  }

  onCollide = (obstacle) => {
    if (this.gameState != State.Game.playing) {
      return;
    }
    this.useParticle(this._hero, 'feathers', (obstacle || {}).speed || 0);
    this.rumbleScreen()
    this.gameOver();
  }

  stopIdle = () => {
    if (this.idleAnimation) {
      this.idleAnimation.pause();
      this.idleAnimation = null;
      this._hero.scale.set(1,1,1);
    }
  }

  idle = () => {
    this.stopIdle();

    const s = 0.8;
    this.idleAnimation = new TimelineMax({repeat: -1});
    this.idleAnimation
    .to(this._hero.scale, 0.3, {x:1,y:s,z:0.9, ease:Power1.easeIn})
    .to(this._hero.scale, 0.6, {x:1,y:1,z:1, ease:Power1.easeOut})


  }

  // Setup initial scene
  init = () => {
    const offset = -30;
    this.setState({score: 0})
    this.camera.position.z = startingRow + 1;
    this._hero.position.set(0, groundLevel, startingRow);
    this._hero.scale.set(1,1,1);
    this._hero.rotation.set(0, Math.PI, 0);
    this.map = {};
    this.camCount = 0;
    this.map[`${0},${groundLevel|0},${startingRow|0}`] = 'player'
    this.initialPosition = null;
    this.targetPosition = null;
    this.grassCount = 0;
    this.waterCount = 0;
    this.roadCount = 0;
    this.railRoadCount = 0;
    this.treeCount = 0;
    this.rowCount = 0;
    this.hitByCar = null;
    this._hero.hitByTrain = null;
    this.lastHeroZ = 8;
    this.floorMap = {};

    this.idle();

    for (i = 0; i < this.maxRows; i++) {
      this.grass[i].position.z = offset;


      this.water[i].position.z = offset;
      this.road[i].position.z = offset;
      this.railRoads[i].position.z = offset;
      this.railRoads[i].active = false;

    }

    for (let lily of this.lilys) {
      lily.mesh.position.z = offset;
    }
    for (let tree of this.trees) {
      tree.position.z = offset;
    }

    this.trains.map(val => {
      val.mesh.position.z = offset;
      val.speed = 0.1;
    })

    for (i = 0; i < 40; i++) {
      this.cars[i].mesh.position.z = offset;
      this.cars[i].speed = 0;
      this.logs[i].mesh.position.z = offset;
      this.logs[i].speed = 0;
    }

    this.treeGen();
    this.grass[this.grassCount].position.z = this.rowCount;
    this.grassCount++;
    this.rowCount++;

    for (i = 0; i < 23; i++) {
      this.newRow();
    }

    this.setState({ ready: true });
  }
  floorMap = {};
  // Scene generators
  newRow = rowKind => {
    if (this.grassCount == this.maxRows) {
      this.grassCount = 0;
    }
    if (this.roadCount == this.maxRows) {
      this.roadCount = 0;
    }
    if (this.waterCount == this.maxRows) {
      this.waterCount = 0;
    }
    if (this.railRoadCount == this.maxRows) {
      this.railRoadCount = 0;
    }

    if (this.rowCount < 10) {
      rowKind = -2;

      if (this.rowCount < 5) {
        rowKind = -1;
      }

    }


    /// Special layers
    // if (this.rowCount <= 0) {
    //   this.grass[this.grassCount].position.z = this.rowCount;
    //   this.floorMap[`${this.rowCount}`] = 'grass';
    //   this.grassCount++;
    //
    // } else if (this.rowCount > 0 && this.rowCount <= 4) {
    //   this.grass[this.grassCount].position.z = this.rowCount;
    //   this.floorMap[`${this.rowCount}`] = 'grass';
    //   this.treeGen(true);
    //
    //   this.grassCount++;
    // } else if (this.rowCount > 4 && this.rowCount <= 10) {
    //   this.grass[this.grassCount].position.z = this.rowCount;
    //   this.floorMap[`${this.rowCount}`] = 'grass';
    //   this.treeGen();
    //
    //   this.grassCount++;
    // } else {


    let rk = rowKind || Math.floor(Math.random() * 5) + 1;



    switch (rk) {

      case -2:
      this.grass[this.grassCount].position.z = this.rowCount;
      this.floorMap[`${this.rowCount}`] = 'grass';
      this.treeGen(false, true);
      this.grassCount++;
      this.lastRk = rk;

      break;
      case -1:
      this.grass[this.grassCount].position.z = this.rowCount;
      this.floorMap[`${this.rowCount}`] = 'grass';
      this.treeGen(true);
      this.grassCount++;
      this.lastRk = rk;

      break;


      case 1:
      this.grass[this.grassCount].position.z = this.rowCount;
      this.floorMap[`${this.rowCount}`] = 'grass';
      this.treeGen();

      this.grassCount++;
      this.lastRk = rk;

      break;

      case 2:
      this.carGen();

      let isMultiLane = rowKind ? true : false;
      // if (Math.floor(Math.random() * (2 - 1)) == 1) {
      //   this.newRow(2);
      // }

      // let road = this._road.getNode(!isMultiLane ? "0" : "1");
      this.road[this.roadCount].position.z = this.rowCount;
      this.floorMap[`${this.rowCount}`] = 'road';

      // this.scene.add(road);
      this.roadCount++;
      this.lastRk = rk;

      break;

      case 3:
      this.generateLogRow();
      this.lastRk = rk;

      break;
      case 4:
      // this.trainGen();
      this.railRoads[this.railRoadCount].position.z = this.rowCount;
      this.railRoads[this.railRoadCount].active = true;
      this.floorMap[`${this.rowCount}`] = 'railRoad';
      this.railRoadCount++;
      this.lastRk = rk;

      break;

      case 5:
      if (this.lastRk === 5) {
          this.generateLogRow();
          this.lastRk = 3;
      } else {
        this.generateLilyRow();
        this.lastRk = rk;

      }

      break;
    }
    // }
    this.rowCount++;

  }

  generateLogRow = () => {
    this.logGen();
    this.water[this.waterCount].position.z = this.rowCount;
    this.floorMap[`${this.rowCount}`] = 'log';
    this.waterCount++;
  }

  generateLilyRow = () => {
    this.lilyGen();
    this.water[this.waterCount].position.z = this.rowCount;
    this.floorMap[`${this.rowCount}`] = 'lily';
    this.waterCount++;

  }


  treeGen = (isFull = false, isEmpty = false) => {
    // 0 - 8
    if (this.floorMap[`${this.rowCount}`] !== 'grass') {
      return;
    }

    let _rowCount = 0;
    for (let x = -3; x < 12; x++) {
      if (x >= 9 || x <= -1 || isFull) {

        this.addTree({x: x - 4, y: 0.4, z: this.rowCount});
        // const tree = this._tree.getRandom();
        // tree.position.set(x - 4, .4, this.rowCount);
        // this.scene.add(tree);
        // this.trees.push(tree);
        // this.treeCount ++;
        // this.trees[this.treeCount].position.set(x - 4, .4, this.rowCount);
      } else if (_rowCount < 2) {
        if (!isEmpty && (x !== 4 && Math.random() > .6) || isFull  ) {
          this.addTree({x: x - 4, y: 0.4, z: this.rowCount});
          _rowCount++;
        }
      }
    }
  }
  addTree = ({x,y,z}) => {
    this.treeCount++;
    const treeIndex = this.treeCount % this.trees.length;
    this.map[`${x|0},${0},${z|0}`] = {type:`tree`, index: treeIndex};

    this.trees[treeIndex].position.set(x, y, z);
  }


  trainGen = () => {
    // Speeds: .01 through .08
    // Number of cars: 1 through 3
    this.numTrains = Math.floor(Math.random() * (4 - 2)) + 2;
    xDir = 1;

    if (Math.random() > .5) {
      xDir = -1;
    }

    xPos = -6 * xDir;

    for (x = 0; x < this.numTrains; x++) {
      if (this.trainCount < 39) {
        this.trainCount++;
      } else {
        this.trainCount = 0;
      }

      this.trains[this.trainCount].mesh.position.set(xPos, .25, this.rowCount);
      this.trains[this.trainCount].speed *= xDir;
      this.trains[this.trainCount].mesh.rotation.y = (Math.PI) * xDir;

      xPos -= 5 * xDir;
    }
  }

  carGen = () => {
    // Speeds: .01 through .08
    // Number of cars: 1 through 3
    this.speed = (Math.floor(Math.random() * (6 - 2)) + 2) / 80;
    this.numCars = Math.floor(Math.random() * (4 - 2)) + 2;
    xDir = 1;

    if (Math.random() > .5) {
      xDir = -1;
    }

    xPos = -6 * xDir;

    for (x = 0; x < this.numCars; x++) {
      if (this.carCount < 39) {
        this.carCount++;
      } else {
        this.carCount = 0;
      }

      this.cars[this.carCount].mesh.position.set(xPos, .25, this.rowCount);
      this.cars[this.carCount].speed = this.speed * xDir;
      this.cars[this.carCount].mesh.rotation.y = (Math.PI / 2) * xDir;


      xPos -= 5 * xDir;
    }
  }

lilyGen = () => {
  // Speeds: .01 through .08
  // Number of cars: 1 through 3
  this.numLilys = Math.floor(Math.random() * (3 - 1)) + 1;

  /// Screen Range = -4:4
  /// Item Range = -3:3

  for (x = 0; x < this.numLilys; x++) {
    let xPos = ((Math.random() * (6 - x)) + (-3 + x)); /// 1 - 7;

    if (this.lilyCount < 19) {
      this.lilyCount++;
    } else {
      this.lilyCount = 0;
    }
    this.lilys[this.lilyCount].mesh.position.set(xPos, 0.125, this.rowCount);
  }
}

  logGen = () => {
    // Speeds: .01 through .08
    // Number of cars: 1 through 3
    this.speed = (Math.floor(Math.random() * (6 - 2)) + 2) / 80;
    this.numLogs = Math.floor(Math.random() * (4 - 3)) + 3;
    xDir = 1;

    if (Math.random() > .5) {
      xDir = -1;
    }
    if (this.logs[this.logCount].speed == this.speed * xDir) {
      this.speed /= 1.5;
    }

    xPos = -6 * xDir;

    for (x = 0; x < this.numLogs; x++) {
      if (this.logCount < 39) {
        this.logCount++;
      } else {
        this.logCount = 0;
      }

      this.logs[this.logCount].mesh.position.set(xPos, -0.1, this.rowCount);
      this.logs[this.logCount].speed = this.speed * xDir;

      xPos -= 5 * xDir;
    }
  }


  trainShouldCheckCollision = (train, speed) => {
    if (Math.round(this._hero.position.z) == train.mesh.position.z) {

      const {collisionBox} = train;

      if (this._hero.position.x < train.mesh.position.x + collisionBox && this._hero.position.x > train.mesh.position.x - collisionBox) {
        // console.log(this._hero.position.z, this.lastHeroZ);
        if (this._hero.position.z != this.lastHeroZ) {

          const forward = this._hero.position.z < this.lastHeroZ;
          // this._hero.scale.z = 0.2;
          // this._hero.scale.y = 1.5;
          // this._hero.rotation.z = (Math.random() * Math.PI) - Math.PI/2;
          this._hero.position.z = train.mesh.position.z + (forward ? 0.52 : -0.52);

          this._hero.hitByTrain = train;


          TweenMax.to(this._hero.scale, 0.3, {
            y: 1.5,
            z: 0.2,
          });
          TweenMax.to(this._hero.rotation, 0.3, {
            z: (Math.random() * Math.PI) - Math.PI/2,
          });

        } else {

          ///Run Over Hero. ///TODO: Add a side collide
          // this._hero.scale.y = 0.2;
          // this._hero.scale.x = 1.5;
          // this._hero.rotation.y = (Math.random() * Math.PI) - Math.PI/2;
          this._hero.position.y = groundLevel;


          TweenMax.to(this._hero.scale, 0.3, {
            y: 0.2,
            x: 1.5,
          });
          TweenMax.to(this._hero.rotation, 0.3, {
            y: (Math.random() * Math.PI) - Math.PI/2,
          });

        }
        this.useParticle(this._hero, 'feathers', speed);
        this.rumbleScreen()

        this.gameOver();
      }
    }

  }



  carShouldCheckCollision = (car, speed) => {
    if (Math.round(this._hero.position.z) == car.mesh.position.z) {

      const {collisionBox} = car;

      if (this._hero.position.x < car.mesh.position.x + collisionBox && this._hero.position.x > car.mesh.position.x - collisionBox) {
        // console.log(this._hero.position.z, this.lastHeroZ);
        if (this._hero.position.z != this.lastHeroZ) {

          const forward = this._hero.position.z < this.lastHeroZ;
          // this._hero.scale.z = 0.2;
          // this._hero.scale.y = 1.5;
          // this._hero.rotation.z = (Math.random() * Math.PI) - Math.PI/2;
          this._hero.position.z = car.mesh.position.z + (forward ? 0.52 : -0.52);

          this.hitByCar = car;


          TweenMax.to(this._hero.scale, 0.3, {
            y: 1.5,
            z: 0.2,
          });
          TweenMax.to(this._hero.rotation, 0.3, {
            z: (Math.random() * Math.PI) - Math.PI/2,
          });

        } else {

          ///Run Over Hero. ///TODO: Add a side collide
          // this._hero.scale.y = 0.2;
          // this._hero.scale.x = 1.5;
          // this._hero.rotation.y = (Math.random() * Math.PI) - Math.PI/2;
          this._hero.position.y = groundLevel;


          TweenMax.to(this._hero.scale, 0.3, {
            y: 0.2,
            x: 1.5,
          });
          TweenMax.to(this._hero.rotation, 0.3, {
            y: (Math.random() * Math.PI) - Math.PI/2,
          });

        }
        this.useParticle(this._hero, 'feathers', speed);
        this.rumbleScreen()

        this.gameOver();
      }
    }

  }

  // Animate cars/logs
  drive = () => {

    // for (let train of this.trains) {
    //   const offset = 11 * 5;
    //         if (this.floorMap[`${train.mesh.position.z|0}`] === 'railRoad') {
    //
    //           train.mesh.position.x += train.speed;
    //
    //           if (train.mesh.position.x > offset && train.speed > 0) {
    //             train.mesh.position.x = -offset;
    //             if (train === this._hero.hitByTrain) {
    //               this._hero.hitByTrain = null;
    //             }
    //           } else if (train.mesh.position.x < -offset && train.speed < 0) {
    //             train.mesh.position.x = offset;
    //             if (train === this._hero.hitByTrain) {
    //               this._hero.hitByTrain = null;
    //             }
    //           } else if (!this.moving && this.gameState == State.Game.playing) {
    //             this.trainShouldCheckCollision(train, train.speed)
    //           }
    //         }
    // }


    for (d = 0; d < this.cars.length; d++) {

      if (this.floorMap[`${this.cars[d].mesh.position.z|0}`] === 'road') {

        this.cars[d].mesh.position.x += this.cars[d].speed;

        if (this.cars[d].mesh.position.x > 11 && this.cars[d].speed > 0) {
          this.cars[d].mesh.position.x = -11;
          if (this.cars[d] === this.hitByCar) {
            this.hitByCar = null;
          }
        } else if (this.cars[d].mesh.position.x < -11 && this.cars[d].speed < 0) {
          this.cars[d].mesh.position.x = 11;
          if (this.cars[d] === this.hitByCar) {
            this.hitByCar = null;
          }
        } else if (!this.moving && this.gameState == State.Game.playing) {
          this.carShouldCheckCollision(this.cars[d], this.cars[d].speed)
        }
      }

      //Move Logs
      if (this.floorMap[`${this.logs[d].mesh.position.z|0}`] === 'log') {

        this.logs[d].mesh.position.x += this.logs[d].speed;

        if (this.logs[d].mesh.position.x > 11 && this.logs[d].speed > 0) {
          this.logs[d].mesh.position.x = -10;
        } else if (this.logs[d].mesh.position.x < -11 && this.logs[d].speed < 0) {
          this.logs[d].mesh.position.x = 10;
        }
      }

    }
  }




  // Detect collisions with trees/cars
  treeCollision = (dir) => {
    var zPos = 0;
    var xPos = 0;
    if (dir == "up") {
      zPos = 1;
    } else if (dir == "down") {
      zPos = -1;
    } else if (dir == "left") {
      xPos = 1;
    } else if (dir == "right") {
      xPos = -1;
    }
    const key = `${(this._hero.position.x + xPos)|0},${0},${(this._hero.position.z + zPos)|0}`;
    if (this.map.hasOwnProperty(key) && this.map[key].type === 'tree') {
      return true;
    }
    return false;
    // for (x = 0; x < this.trees.length; x++) {
    //   if (Math.round(this._hero.position.z + zPos) == this.trees[x].position.z) {
    //     if (Math.round(this._hero.position.x + xPos) == this.trees[x].position.x) {
    //       return true;
    //     }
    //   }
    // }
  }

  carCollision = () => {
    if (this.gameState != State.Game.playing || this.hitByCar) {
      return
    }
    for (let c = 0; c < this.cars.length; c++) {
      if (Math.round(this._hero.position.z) == this.cars[c].mesh.position.z) {
        let car = this.cars[c];

        const {collisionBox} = car;

        if (this._hero.position.x < this.cars[c].mesh.position.x + collisionBox && this._hero.position.x > this.cars[c].mesh.position.x - collisionBox) {
          // console.log(this._hero.position.z, this.lastHeroZ);
          if (this._hero.position.z != this.lastHeroZ) {

            const forward = this._hero.position.z < this.lastHeroZ;
            this._hero.scale.z = 0.2;
            this._hero.position.z = this.cars[c].mesh.position.z + (forward ? 0.52 : -0.52);
            this.hitByCar = this.cars[c];
          } else {

            ///Run Over Hero. ///TODO: Add a side collide
            this._hero.scale.y = 0.2;
            this._hero.position.y = groundLevel;

          }

          this.gameOver();
          this.useParticle(this._hero, 'feathers', this.cars[c].speed);
          this.rumbleScreen()


        }
      }
    }
    this.lastHeroZ = this._hero.position.z;

  }

  trainCollision = () => {
    if (this.gameState != State.Game.playing || this._hero.hitByTrain) {
      return
    }
    for (let c = 0; c < this.trains.length; c++) {
      if (Math.round(this._hero.position.z) == this.trains[c].mesh.position.z) {
        let train = this.trains[c];

        const {collisionBox} = train;

        if (this._hero.position.x < this.trains[c].mesh.position.x + collisionBox && this._hero.position.x > this.trains[c].mesh.position.x - collisionBox) {
          // console.log(this._hero.position.z, this.lastHeroZ);
          if (this._hero.position.z != this.lastHeroZ) {

            const forward = this._hero.position.z < this.lastHeroZ;
            this._hero.scale.z = 0.2;
            this._hero.position.z = this.trains[c].mesh.position.z + (forward ? 0.52 : -0.52);
            this._hero.hitByTrain = this.trains[c];
          } else {

            ///Run Over Hero. ///TODO: Add a side collide
            this._hero.scale.y = 0.2;
            this._hero.position.y = groundLevel;

          }

          this.gameOver();
          this.useParticle(this._hero, 'feathers', this.trains[c].speed);
          this.rumbleScreen()


        }
      }
    }
    this.lastHeroZ = this._hero.position.z;

  }

  bounceLily = mesh => {
    let timing = 0.2;
    TweenMax.to(mesh.position, timing * 0.9, {
      y: 0.01,
    });

    TweenMax.to(mesh.position, timing, {
      y: 0.125,
      delay: timing
    });

    TweenMax.to(this._hero.position, timing * 0.9, {
      y: groundLevel + -0.125,
    });

    TweenMax.to(this._hero.position, timing, {
      y: groundLevel,
      delay: timing
    });
  }

  bounceLog = mesh => {
    let timing = 0.2;
    TweenMax.to(mesh.position, timing * 0.9, {
      y: -0.3,
    });

    TweenMax.to(mesh.position, timing, {
      y: -0.1,
      delay: timing
    });

    TweenMax.to(this._hero.position, timing * 0.9, {
      y: groundLevel + -0.1,
    });

    TweenMax.to(this._hero.position, timing, {
      y: groundLevel,
      delay: timing
    });
  }

  moveUserOnLog = () => {
    if (!this.currentLog) {
      return;
    }

    let target = this.logs[this.currentLog].mesh.position.x + this.currentLogSubIndex;
    this._hero.position.x = target;
    this.initialPosition.x = target;
  }

  moveUserOnCar = () => {
    if (!this.hitByCar) {
      return;
    }
    let target = this.hitByCar.mesh.position.x;
    this._hero.position.x += this.hitByCar.speed;
    if (this.initialPosition)
    this.initialPosition.x = target;
  }

lilyCollision = () => {
  if (this.gameState != State.Game.playing) {
    this.onLily = null;
    return
  }
  for (let l = 0; l < this.lilys.length; l++) {
    let lily = this.lilys[l];
    if (this._hero.position.z == lily.mesh.position.z) {
      const {collisionBox, mesh} = lily;
      const lilyX = mesh.position.x;
      const heroX = this._hero.position.x;

      if (heroX < lilyX + collisionBox && heroX > lilyX - collisionBox) {
        this.onLily = lily;
        this.bounceLily(mesh);
        return;
      }
    }
  }
}

  logCollision = () => {
    if (this.gameState != State.Game.playing) {
      this.onLog = false;
      this.currentLog = null;
      return
    }
    for (let l = 0; l < this.logs.length; l++) {
      let log = this.logs[l];
      if (this._hero.position.z == log.mesh.position.z) {
        const {collisionBox, mesh} = log;
        const logX = mesh.position.x;
        const heroX = this._hero.position.x;

        if (heroX < logX + collisionBox && heroX > logX - collisionBox) {
          this.onLog = true;
          if (this.currentLog != l) {
            this.currentLog = l;
            this.currentLogSubIndex = (heroX - logX);
            this.bounceLog(mesh);
          }
          return;
        }
      }
    }
  }

  waterCollision = () => {
    let currentRow = this.floorMap[`${this._hero.position.z|0}`];
    if (currentRow === 'log' && this.onLog === false) {
      if (this.gameState == State.Game.playing) {
        this.useParticle(this._hero, 'water');
        this.rumbleScreen()
        this.gameOver();
      } else {
        let y = Math.sin(this.sineCount) * .08 - .2;
        this.sineCount += this.sineInc;
        this._hero.position.y = y;

        for (w = 0; w < this.logs.length; w++) {
          if (this._hero.position.z == this.logs[w].mesh.position.z) {
            this._hero.position.x += this.logs[w].speed / 3;
          }
        }
      }
    }
    if (currentRow === 'lily' && !this.onLily) {

      if (this.gameState == State.Game.playing) {
        this.useParticle(this._hero, 'water');
        this.rumbleScreen()
        this.gameOver();
      } else {

        // let y = Math.sin(this.sineCount) * .08 - .2;
        // this.sineCount += this.sineInc;
        this._hero.position.y -= 0.001;

        // for (w = 0; w < this.logs.length; w++) {
        //   if (this._hero.position.z == this.logs[w].mesh.position.z) {
        //     this._hero.position.x += this.logs[w].speed / 3;
        //   }
        // }
      }

    }


  }

  rumbleScreen = () => {
    Vibration.vibrate();

    TweenMax.to(this.scene.position, 0.2, {
      x: 0,
      y: 0,
      z: 1,
    })
    TweenMax.to(this.scene.position, 0.2, {
      x: 0,
      y: 0,
      z: 0,
      delay: 0.2,
    })
  }

  // Move scene forward
  forwardScene = () => {
    const easing = 0.03;
    this.camera.position.z += (((this._hero.position.z + 1) - this.camera.position.z) * easing);
    this.camera.position.x =  Math.min(2, Math.max(-2, this.camera.position.x + (((this._hero.position.x) - this.camera.position.x) * easing)));

    // normal camera speed
    if (this.camera.position.z - this.camCount > 1.0) {
      this.camCount = this.camera.position.z;
      this.newRow();
    }
  }

  // Reset variables, restart game
  gameOver = () => {
    // this.trees.map(val => this.scene.remove(val) );
    this.moving = false;
    this._hero.moving = false;

    /// Stop player from finishing a movement
    this.heroAnimations.map(val => {val.pause(); val = null;} );
    this.heroAnimations = [];
    this.gameState = State.Game.gameOver;
    this.props.setGameState(this.gameState)

    InteractionManager.runAfterInteractions(_=> {
      this.props.navigation.dispatch(NavigationActions.navigate({ routeName: 'GameOver' }))
    });
    // this.props.nav.navigation.navigate('GameOver', {})
  }

  tick = dt => {
    this.drive();

    for (let railRoad of this.railRoads) {
      railRoad.update(dt, this._hero)
    }

    if (!this.moving) {
      this.moveUserOnLog();
      this.moveUserOnCar();
      this.logCollision();
      this.lilyCollision();

      this.waterCollision();

      // this.checkIfUserHasFallenOutOfFrame();
      this.lastHeroZ = this._hero.position.z;
      this._hero.lastPosition = this._hero.position;

    }

    this.carCollision();
    // this.trainCollision();
    this.forwardScene();
  }


  checkIfUserHasFallenOutOfFrame = () => {
    if (this.gameState !== State.Game.playing) {
      return
    }
    if (this._hero.position.z < this.camera.position.z - 8) {

      ///TODO: rumble
      this.rumbleScreen()

      this.gameOver();
    }

    /// Check if offscreen
    if (this._hero.position.x < -5 || this._hero.position.x > 5) {

      ///TODO: Rumble death
      this.rumbleScreen()

      this.gameOver();
    }
  }

  updateScore = () => {
    const position = Math.max(Math.floor(this._hero.position.z) - 8, 0);
    if (this.state.score < position) {
      this.setState({score: position})
    }
  }

  moveWithDirection = direction => {
    if (this.gameState != State.Game.playing ) {
      return;
    }

    const {SWIPE_UP, SWIPE_DOWN, SWIPE_LEFT, SWIPE_RIGHT} = swipeDirections;


    if (!this.initialPosition) {
      this.initialPosition = this._hero.position;
      this.targetPosition = this.initialPosition;
    }

    if (this.moving) {
      this._hero.position = this.targetPosition;
      // return
    };

    switch (direction) {
      case SWIPE_LEFT:
      this._hero.rotation.y = Math.PI/2
      if (!this.treeCollision("left")) {
        this.targetPosition = {x: this.initialPosition.x + 1, y: this.initialPosition.y, z: this.initialPosition.z};
        this.moving = true
        this._hero.moving = true;
      }
      break;
      case SWIPE_RIGHT:
      this._hero.rotation.y = -Math.PI/2
      if (!this.treeCollision("right")) {
        this.targetPosition = {x: this.initialPosition.x - 1, y: this.initialPosition.y, z: this.initialPosition.z};
        this.moving = true
        this._hero.moving = true;

      }
      break;
      case SWIPE_UP:
      this._hero.rotation.y = 0;
      if (!this.treeCollision("up")) {
        const row = this.floorMap[`${this.targetPosition.z + 1}`]
        let shouldRound = row !== "log" || row !== "lily"
        this.targetPosition = {x: this.initialPosition.x, y: this.initialPosition.y, z: this.initialPosition.z + 1};
        if (shouldRound) {
          // this.targetPosition.x = Math.floor(this.targetPosition.x);
        }
        this.moving = true
        this._hero.moving = true;

      }
      break;
      case SWIPE_DOWN:
      this._hero.rotation.y = Math.PI
      if (!this.treeCollision("down")) {
        const row = this.floorMap[`${this.targetPosition.z - 1}`]
        let shouldRound = row !== "log" || row !== "lily"
        this.targetPosition = {x: this.initialPosition.x, y: this.initialPosition.y, z: this.initialPosition.z - 1};
        if (shouldRound) {
          // this.targetPosition.x = Math.floor(this.targetPosition.x);
        }
        this.moving = true
        this._hero.moving = true;

      }
      break;
    }



    let {targetPosition, initialPosition} = this;


    // if (Math.abs(targetPosition.x - initialPosition.x) > 0 && this.onLog && this.currentLog && this.currentLog >= 0) {
    //   const {speed} = this.logs[this.currentLog];
    //   // delta.x = (targetPosition.x - Math.round(initialPosition.x))
    //   // delta.z += (speed < 0) ? -1 : 1;
    //   if (speed > 0) {
    //   targetPosition.x = Math.ceil(targetPosition.x)
    // } else {
    //   targetPosition.x = Math.floor(targetPosition.x)
    // }
    //
    // }
    let delta = {x: (targetPosition.x - initialPosition.x), y: targetPosition.y - initialPosition.y, z: targetPosition.z - initialPosition.z}

    this.onLily = null;

    this.onLog = false;
    this.currentLog = null;
    let timing = 0.5;

    this.heroAnimations = [];

    this.heroAnimations.push(TweenMax.to(this._hero.position, this.timing, {
      x: this.initialPosition.x + (delta.x * 0.75),
      y: groundLevel + 0.5,
      z: this.initialPosition.z + (delta.z * 0.75),
    }));

    this.heroAnimations.push(TweenMax.to(this._hero.scale, this.timing, {
      x: 1,
      y: 1.2,
      z: 1,
    }));
    this.heroAnimations.push(TweenMax.to(this._hero.scale, this.timing, {
      x: 1.0,
      y: 0.8,
      z: 1,
      delay: this.timing
    }));
    this.heroAnimations.push(TweenMax.to(this._hero.scale, this.timing, {
      x: 1,
      y: 1,
      z: 1,
      ease: Bounce.easeOut,
      delay: this.timing * 2
    }));

    this.heroAnimations.push(TweenMax.to(this._hero.position, this.timing, {
      x: this.targetPosition.x,
      y: this.targetPosition.y,
      z: this.targetPosition.z,
      ease: Power4.easeOut,
      delay: 0.151,
      onComplete: this.doneMoving,
      onCompleteParams: []
    }));


    this.initialPosition = this.targetPosition;

  }

  beginMoveWithDirection = direction => {
    if (this.gameState != State.Game.playing) {
      return;
    }

    let timing = 0.2;

    TweenMax.to(this._hero.scale, timing, {
      x: 1.2,
      y: 0.75,
      z: 1,
      // ease: Bounce.easeOut,
    });
  }

  onSwipe = (gestureName, gestureState) => {
    this.moveWithDirection(gestureName);
  }


  renderGame = () => {

    if (!this.state.ready) {
      return;
    }

    const config = {
      velocityThreshold: 0.3,
      directionalOffsetThreshold: 80
    };

    return (
      <AnimatedGestureRecognizer
        onResponderGrant={_=> {
          this.beginMoveWithDirection();
        }}
        onSwipe={(direction, state) => this.onSwipe(direction, state)}
        config={config}
        style={{
          flex: 1,
        }}
        >
          <TouchableWithoutFeedback onPressIn={_=> {
              this.beginMoveWithDirection();

            }} style={{flex: 1}} onPress={_=> {
              this.onSwipe(swipeDirections.SWIPE_UP, {});
            }}>
            {Expo.Constants.isDevice && <THREEView
              backgroundColor={sceneColor}
              shadowMapEnabled={true}
              shadowMapRenderSingleSided={true}
              style={{ flex: 1 }}
              scene={this.scene}
              camera={this.camera}
              tick={this.tick}
            />}
          </TouchableWithoutFeedback>
        </AnimatedGestureRecognizer>
      );
    }

    render() {

      return (
        <View style={[{flex: 1, backgroundColor: '#6dceea'}, this.props.style]}>

          {this.renderGame()}

          <Score score={this.state.score} gameOver={this.props.gameState === State.Game.gameOver}/>
      </View>
    );
  }
}

import Score from './Score';
import {connect} from 'react-redux';
export default connect(
  state => ({
    nav: state.nav
  }),
  {
  }
)(Game);
