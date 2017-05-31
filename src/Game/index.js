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
    this._hero.moving = false;
    this.updateScore();

    this.lastHeroZ = this._hero.position.z;
    this._hero.lastPosition = this._hero.position;


    // this._hero.position.set(Math.round(this._hero.position.x), this._hero.position.y, Math.round(this._hero.position.z))
  }

  getWidth = (mesh) => {
    let box3 = new THREE.Box3();
    box3.setFromObject(mesh);
    return Math.round(box3.max.x - box3.min.x);
  }
  getDepth = mesh => {
    let box3 = new THREE.Box3();
    box3.setFromObject(mesh);

    return Math.round(box3.max.z - box3.min.z);
  }


  loadModels = async () => {
    const {_grass, _boulder, _tree, _hero} = modelLoader;
    this._grass = _grass;
    this._boulder = _boulder;
    this._tree = _tree;

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
    this._hero.hitBy = null;
    this._hero.ridingOn = null;
    this._hero.ridingOnOffset = null;
    this.scene.add(this._hero);


    // Assign mesh to corresponding array
    // and add mesh to scene
    for (i = 0; i < this.maxRows; i++) {
      this.grass[i] = this._grass.getNode(`${i % 2}`);
      this.grass[i].receiveShadow = true;
      this.grass[i].castShadow = false;


      this.water[i] = new Rows.Water(this.heroWidth, this.onCollide); // this._railroad.getRandom();
      this.road[i] = new Rows.Road(this.heroWidth, this.onCollide); // this._railroad.getRandom();
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

    // // Repeat above for terrain objects
    // for (i = 0; i < 20; i++) {
    //   const mesh = this._lilyPad.getRandom();
    //
    //   TweenMax.to(mesh.rotation, (Math.random() * 2) + 2, {
    //     y: (Math.random() * 1.5) + 0.5,
    //     yoyo: true,
    //     repeat: -1,
    //     ease: Power1.easeInOut
    //   });
    //
    //   const width = this.getWidth(mesh);
    //   this.lilys[i] = {mesh, width, collisionBox: (this.heroWidth / 2 + width / 2 - .1) };
    //   this.scene.add(mesh);
    //
    //
    // }


    this.init();
  }

  onCollide = (obstacle, type = 'feathers') => {
    if (this.gameState != State.Game.playing) {
      return;
    }
    this._hero.isAlive = false;
    this.useParticle(this._hero, type, (obstacle || {}).speed || 0);
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
    this._hero.hitBy = null;
    this._hero.ridingOn = null;
    this._hero.ridingOnOffset = null;
    this.lastHeroZ = 8;
    this.floorMap = {};
    this._hero.isAlive = true;

    this.idle();

    for (i = 0; i < this.maxRows; i++) {
      this.grass[i].position.z = offset;


      this.water[i].position.z = offset;
      this.water[i].active = false;

      this.road[i].position.z = offset;
      this.road[i].active = false;
      this.railRoads[i].position.z = offset;
      this.railRoads[i].active = false;

    }

    // for (let lily of this.lilys) {
    //   lily.mesh.position.z = offset;
    // }
    for (let tree of this.trees) {
      tree.position.z = offset;
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


    let rk = rowKind || Math.floor(Math.random() * 3) + 1;



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
      {
        if (((Math.random() * 4)|0) == 0) {
          this.railRoads[this.railRoadCount].position.z = this.rowCount;
          this.railRoads[this.railRoadCount].active = true;
          this.floorMap[`${this.rowCount}`] = 'railRoad';
          this.railRoadCount++;
          this.lastRk = rk + 1000;
        } else {
          this.road[this.roadCount].position.z = this.rowCount;
          this.road[this.roadCount].active = true;
          this.floorMap[`${this.rowCount}`] = 'road';
          this.roadCount++;
          this.lastRk = rk;
        }
      }
      break;

      case 3:
      this.water[this.waterCount].position.z = this.rowCount;
      this.water[this.waterCount].active = true;
      this.water[this.waterCount].generate();
      this.floorMap[`${this.rowCount}`] = 'log';
      this.waterCount++;

      this.lastRk = rk;
      break;
    }
    // }
    this.rowCount++;

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



  // lilyGen = () => {
  //   // Speeds: .01 through .08
  //   // Number of cars: 1 through 3
  //   this.numLilys = Math.floor(Math.random() * (3 - 1)) + 1;
  //
  //   /// Screen Range = -4:4
  //   /// Item Range = -3:3
  //
  //   for (x = 0; x < this.numLilys; x++) {
  //     let xPos = ((Math.random() * (6 - x)) + (-3 + x)); /// 1 - 7;
  //
  //     if (this.lilyCount < 19) {
  //       this.lilyCount++;
  //     } else {
  //       this.lilyCount = 0;
  //     }
  //     this.lilys[this.lilyCount].mesh.position.set(xPos, 0.125, this.rowCount);
  //   }
  // }

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
  }

  // bounceLily = mesh => {
  //   let timing = 0.2;
  //   TweenMax.to(mesh.position, timing * 0.9, {
  //     y: 0.01,
  //   });
  //
  //   TweenMax.to(mesh.position, timing, {
  //     y: 0.125,
  //     delay: timing
  //   });
  //
  //   TweenMax.to(this._hero.position, timing * 0.9, {
  //     y: groundLevel + -0.125,
  //   });
  //
  //   TweenMax.to(this._hero.position, timing, {
  //     y: groundLevel,
  //     delay: timing
  //   });
  // }

  moveUserOnEntity = () => {
    if (!this._hero.ridingOn) {
      return;
    }

    // let target = this._hero.ridingOn.mesh.position.x + this._hero.ridingOnOffset;
    this._hero.position.x += this._hero.ridingOn.speed;
    this.initialPosition.x = this._hero.position.x;
  }

  moveUserOnCar = () => {
    if (!this._hero.hitBy) {
      return;
    }

    let target = this._hero.hitBy.mesh.position.x;
    this._hero.position.x += this._hero.hitBy.speed;
    if (this.initialPosition)
    this.initialPosition.x = target;
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
    // this.drive();

    for (let railRoad of this.railRoads) {
      railRoad.update(dt, this._hero)
    }

    for (let road of this.road) {
      road.update(dt, this._hero)
    }

    for (let water of this.water) {
      water.update(dt, this._hero)
    }


    if (!this._hero.moving) {
      this.moveUserOnEntity();
      this.moveUserOnCar();

      // this.waterCollision();
      // this.checkIfUserHasFallenOutOfFrame();
    }

    // this.carCollision();
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

    this._hero.ridingOn = null;

    if (!this.initialPosition) {
      this.initialPosition = this._hero.position;
      this.targetPosition = this.initialPosition;
    }

    if (this._hero.moving) {
      this._hero.position = this.targetPosition;
      // return
    };

    switch (direction) {
      case SWIPE_LEFT:
      this._hero.rotation.y = Math.PI/2
      if (!this.treeCollision("left")) {
        this.targetPosition = {x: this.initialPosition.x + 1, y: this.initialPosition.y, z: this.initialPosition.z};
        this._hero.moving = true;
      }
      break;
      case SWIPE_RIGHT:
      this._hero.rotation.y = -Math.PI/2
      if (!this.treeCollision("right")) {
        this.targetPosition = {x: this.initialPosition.x - 1, y: this.initialPosition.y, z: this.initialPosition.z};
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
          <TouchableWithoutFeedback
            onPressIn={_=> {
              this.beginMoveWithDirection();
            }}
            style={{flex: 1}}
            onPress={_=> {
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

          <Score score={this.state.score} gameOver={this.props.gameState === State.Game.gameOver}
          />
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
