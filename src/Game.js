import Expo from 'expo'

import React, {Component} from 'react';
import {TouchableWithoutFeedback, Dimensions,Text,View} from 'react-native'

import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';

import ModelLoader from '../utils/ModelLoader';

import {TweenMax, Power2, TimelineLite} from "gsap";

const {THREE} = global;

// import createTHREEViewClass from './createTHREEViewClass';
const THREEView = Expo.createTHREEViewClass(THREE);

import Map from './Map';
// Setup THREE//
const {width, height} = Dimensions.get('window');

import RetroText from './RetroText'
import Hero from './Hero'
import Car from './Car'
import Log from './Log'
import Road from './Road'
import Grass from './Grass'
import River from './River'
import Tree from './Tree'
// import Hero from './Hero'

function material(color) {

  return new THREE.MeshPhongMaterial({
    color: color,
    shading: THREE.FlatShading,
  });

}
let redMat = material(0xff0000);
let greenMat = material(0x00ff00);


export default class App extends React.Component {

  sineCount = 0;
  sineInc = Math.PI / 50;
  state = { ready: false, score: 0, pause: false };

  levelWidth = 19
  // levelHeight = 50 /// Crossy is infinite.

  levelHeight = 19 /// Crossy is infinite.

  componentWillMount() {
    this.scene = new THREE.Scene();
    console.log("FROG: Start settin' up the game")
    this.camera = new THREE.OrthographicCamera(-width, width, height, -height, -30, 30);
    // this.camera = new THREE.PerspectiveCamera(75, 1, 1, 10000);
    // this.camera.position.z = 1000;

    this.camera.position.set(-1, 2.8, -2.9); // Change -1 to -.02
    this.camera.zoom = 110; // for birds eye view
    this.camera.updateProjectionMatrix();
    this.camera.lookAt(this.scene.position);

    // this.map = new Map({width: this.levelWidth, height: this.levelHeight});

    const position = new THREE.Vector3( 0, 0, 0 );
    // this.map.buildLevel({position, parentNode: this.scene});

    this.doGame();
  }

  createBonusParticles = () => {
    this.bonusParticles = new BonusParticles();
    this.bonusParticles.mesh.visible = false;
    this.scene.add(this.bonusParticles.mesh);
  }

  useParticle = model => {
    this.bonusParticles.mesh.position.copy(model.position);
    this.bonusParticles.mesh.visible = true;
    this.bonusParticles.explose();
  }

  createLights = () => {
    let globalLight = new THREE.AmbientLight(0xffffff, .9);

    let shadowLight = new THREE.DirectionalLight(0xffffff, 1);
    shadowLight.position.set(-30, 40, 20);
    // shadowLight.shadowCameraVisible = true;

    // this.camera = new THREE.PerspectiveCamera(75, 1, 1, 10000);
    // this.camera.position.z = 1000;

    // shadowLight.position.set(-1, 22.8, -2.9); // Change -1 to -.02


    // shadowLight.shadow.camera.left = -5;
    // shadowLight.shadow.camera.right = 5;
    // shadowLight.shadow.camera.top = 50;
    // shadowLight.shadow.camera.bottom = -50;
    // shadowLight.shadow.mapSize.width = shadowLight.shadow.mapSize.height = 2048;

    shadowLight.shadow = new THREE.LightShadow( new THREE.PerspectiveCamera(-width, width, height, -height, -30, 30 ) );
    shadowLight.shadow.mapSize.width = width;
    shadowLight.shadow.mapSize.height = height;
    shadowLight.castShadow = true;

    shadowLight.shadowCameraHelper = new THREE.CameraHelper( shadowLight.shadow.camera );
    // this.scene.add( shadowLight.shadowCameraHelper );

    // shadowLight.shadow.camera.near = 1;
    // shadowLight.shadow.camera.far = 2000;
    // shadowLight.shadow.mapSize.width = shadowLight.shadow.mapSize.height = 2048 * 3;

    this.scene.add(globalLight);
    this.scene.add(shadowLight);

  }

  endScore = () => {
    // scoreDiv.style.transition = "top 2s, width 2s, left 2s, font-size 2s";
    // scoreDiv.style.top = "50%";
    // scoreDiv.style.width = "100%";
    // scoreDiv.style.left = "0px";
    // scoreDiv.style.fontSize = "300px";
    // resetDiv.style.visibility = "visible";
  }

  newScore = () => {
    // scoreDiv.style.transition = "top 2s, width 2s,left 2s, font-size 2s";
    // scoreDiv.style.top = "40px";
    // scoreDiv.style.width = "0px";
    // scoreDiv.style.left = "10px";
    // scoreDiv.style.fontSize = "80px";
    // resetDiv.style.visibility = "hidden";

    this.setState({pause: false});
    this.init();
  }

  doneMoving = () => {
    this.moving = false;
    // this.hero.position.set(Math.round(this.hero.position.x), this.hero.position.y, Math.round(this.hero.position.z))
  }


  doGame = async () => {

    this.setState({score: 0, pause: false})

    // document.addEventListener("keyup", keyUp);
    this.moving = false;
    this.timing = 0.10;

    // Variables
    this.grass = [],
    this.grassCount = 0; //
    this.water = [],
    this.waterCount = 0; // Terrain tiles
    this.road = [],
    this.roadCount = 0; //


    this.trees = [],
    this.treeCount = 0; //
    this.logs = [],
    this.logCount = 0; // Terrain objects
    this.cars = [],
    this.carCount = 0; //
    this.logSpeed = [],
    this.carSpeed = []; //
    this.onLog = true;

    this.rowCount = 0;
    this.camCount = 0,
    this.camSpeed = .02;

    // Widths used also in carCollision()
    this.heroWidth = .7;
    this.carWidth = 1.5;
    this.logWidth = 2;
    this.cCollide = this.heroWidth / 2 + this.carWidth / 2 - .1;
    this.lCollide = (this.heroWidth / 4 + this.logWidth / 4) + .5;


    this.terrainGeo = new THREE.BoxGeometry(19, 1, 1);
    this.terrainGeo.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, -0.5));
    this.grassMat = material(0x55cc5f);
    this.grassDarkMat = material(0x3c9143);

    this.waterMat = material(0x71d7ff);

    this._road = new Road();
    this._grass = new Grass();
    this._river = new River();
    this._tree = new Tree();

    await Promise.all([
      this._road.setup(),
      this._grass.setup(),
      this._river.setup(),
      this._tree.setup(),

    ])


    this.roadMat = material(0x777777);

    this.shadeGeo = new THREE.PlaneGeometry(5, 500);
    this.shadeMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: .3
    });
    this.blindMat = material(0xADD8E6);

    this.carGeo = new THREE.BoxGeometry(this.carWidth, .5, .7);
    this.carMat = material(0x0077FF);


    this.logGeo = new THREE.BoxGeometry(this.logWidth, .25, .6);
    this.logMat = material(0x7F4D48);

    let bonusParticles;

    BonusParticles = function() {

      this.mesh = new THREE.Group();
      var bigParticleGeom = new THREE.CubeGeometry(10, 10, 10, 1);
      var smallParticleGeom = new THREE.CubeGeometry(0.1, 0.1, 0.1, 1);
      this.parts = [];
      for (var i = 0; i < 10; i++) {
        var partPink = new THREE.Mesh(bigParticleGeom, this.waterMat);
        var partGreen = new THREE.Mesh(smallParticleGeom, this.waterMat);
        // partGreen.scale.set(.005, .005, .005);
        // this.parts.push(partPink);
        this.parts.push(partGreen);
        // this.mesh.add(partPink);
        this.mesh.add(partGreen);
      }
    }

    BonusParticles.prototype.explose = function() {
      var explosionSpeed = 0.5;

      const removeParticle = (p) => {
        p.visible = false;
      }
      for (var i = 0; i < this.parts.length; i++) {

        var tx = -1.0 + Math.random() * 2.0;
        var ty = -1.0 + Math.random() * 2.0;
        var tz = -1.0 + Math.random() * 2.0;
        var p = this.parts[i];

        p.position.set(0, 0, 0);
        p.scale.set(1, 1, 1);
        p.visible = true;
        var s = explosionSpeed + Math.random() * .5;
        TweenMax.to(p.position, s, {
          x: tx,
          y: ty,
          z: tz,
          ease: Power4.easeOut
        });
        TweenMax.to(p.scale, s * 3, {
          x: .01,
          y: .01,
          z: .01,
          ease: Power4.easeOut,
          onComplete: removeParticle,
          onCompleteParams: [p]
        });
      }
    }

    this.createBonusParticles();


    this.createLights();


    // Mesh
    this.hero = new THREE.Object3D();
    // this.hero.receiveShadow = true;
    // this.hero.castShadow = true;
    // this.hero.position.y = .25;
    this.scene.add(this.hero);


    const _hero = new Hero();
    await _hero.setup();

    // const s = 0.05;
    // _heroMesh.scale.set(s, s, s);
    // _heroMesh.position.y = -0.25
    this.hero.add(_hero.getNode());




    this.leftShade = new THREE.Mesh(this.shadeGeo, this.shadeMat);
    this.rightShade = new THREE.Mesh(this.shadeGeo, this.shadeMat);
    this.leftBlind = new THREE.Mesh(this.shadeGeo, this.blindMat);
    this.rightBlind = new THREE.Mesh(this.shadeGeo, this.blindMat);

    this.grass[0] = new THREE.Mesh(this.terrainGeo, this.grassMat);
    this.grass[0].receiveShadow = true;

    this.grass[1] = new THREE.Mesh(this.terrainGeo, this.grassDarkMat);
    this.grass[1].receiveShadow = true;


    this.road[0] = this._road.getRandom();

    // this.road[0].applyMatrix(new THREE.Matrix4().makeTranslation(0, 0.1, 0));

    // this.road[0].receiveShadow = true;

    this.trees[0] = this._tree.getRandom();

    let _car = new Car();
    this.cars[0] = await _car.setup();

    let _log = new Log();

    await _log.setup();
    this.logs[0] = _log.getRandom();
    // Mesh orientation
    this.leftShade.rotation.x = 270 * Math.PI / 180;
    this.leftShade.position.set(6.65, 1, 248.47);
    this.rightShade.rotation.x = 270 * Math.PI / 180;
    this.rightShade.position.set(-7.35, 1, 248.47);
    this.leftBlind.rotation.x = 270 * Math.PI / 180;
    this.leftBlind.position.set(11.8, .6, 248.9);
    this.rightBlind.rotation.x = 270 * Math.PI / 180;
    this.rightBlind.position.set(-12.2, .6, 248.9);
    this.scene.add(this.leftShade);
    this.scene.add(this.rightShade);
    this.scene.add(this.leftBlind);
    this.scene.add(this.rightBlind);

    this.grass[0].rotation.x = 270 * Math.PI / 180;
    this.grass[1].rotation.x = 270 * Math.PI / 180;


    // this.road[0].rotation.x = 270 * Math.PI / 180;

    this.grass[0].position.z = -30;

    // this.road[0].position.z = -30;

    this.trees[0].position.set(0, .5, -30);
    this.cars[0].position.set(0, .25, -30);
    this.cars[0].rotation.set(0, 0,0);

    this.logs[0].position.set(0, -10.5, -30);

    // Assign mesh to corresponding array
    // and add mesh to scene
    for (i = 0; i < 15; i++) {
      this.grass[i] = this._grass.getNode(`${i % 2}`);
      this.grass[i].receiveShadow = true;

      this.water[i] = this._river.getNode();
      this.road[i] = this._road.getRandom();
      // this.road[i].receiveShadow = true;
      // this.water[i].receiveShadow = true;

      this.scene.add(this.grass[i]);
      this.scene.add(this.water[i]);
      this.scene.add(this.road[i]);
    }

    // Repeat above for terrain objects
    for (i = 0; i < 55; i++) {
      this.trees[i] = this._tree.getRandom();
      this.scene.add(this.trees[i]);
    }

    for (i = 0; i < 40; i++) {
      this.cars[i] = this.cars[0].clone();
      this.scene.add(this.cars[i]);
    }
    for (i = 0; i < 40; i++) {
      this.logs[i] = this.logs[0].clone();
      this.scene.add(this.logs[i]);
    }


    this.init();
  }


  // Setup initial scene
  init = () => {
    const startingRow = 8;
    this.setState({score: 0})
    this.camera.position.z = startingRow;
    this.hero.position.set(0, 0, startingRow);
    this.hero.scale.set(1,1,1);

    this.grassCount = 0;
    this.waterCount = 0;
    this.roadCount = 0;
    this.treeCount = 0;
    this.rowCount = 0;

    for (i = 0; i < 15; i++) {
      this.grass[i].position.z = -30;
      this.water[i].position.z = -30;
      this.road[i].position.z = -30;
    }
    for (i = 0; i < 55; i++) {
      this.trees[i].position.z = -30;
    }
    for (i = 0; i < 40; i++) {
      this.cars[i].position.z = -30;
      this.carSpeed[i] = 0;

      this.logs[i].position.z = -30;
      this.logSpeed[i] = 0;
    }

    this.treeGen();
    this.grass[this.grassCount].position.z = this.rowCount;
    this.grassCount++;
    this.rowCount++;
    for (i = 1; i < 15; i++) {
      this.newRow();
    }

    this.setState({ ready: true });

  }

  // Scene generators
  newRow = (rowKind) => {
    if (this.grassCount == 15) {
      this.grassCount = 0;
    }
    if (this.roadCount == 15) {
      this.roadCount = 0;
    }
    if (this.waterCount == 15) {
      this.waterCount = 0;
    }

    /// Special layers
    if (this.rowCount <= 0) {
      this.grass[this.grassCount].position.z = this.rowCount;
      this.grassCount++;

    } else if (this.rowCount > 0 && this.rowCount <= 4) {
      this.treeGen(true);
      this.grass[this.grassCount].position.z = this.rowCount;
      this.grassCount++;
    } else if (this.rowCount > 4 && this.rowCount <= 10) {
      this.treeGen();
      this.grass[this.grassCount].position.z = this.rowCount;
      this.grassCount++;
    } else {
      switch (rowKind || Math.floor(Math.random() * (4 - 1)) + 1) {
        case 1:
        this.treeGen();
        this.grass[this.grassCount].position.z = this.rowCount;
        this.grassCount++;
        break;

        case 2:
        this.carGen();

        let isMultiLane = rowKind ? true : false;
        if (Math.floor(Math.random() * (2 - 1)) == 1) {
          this.newRow(2);
        }

        let road = this._road.getNode(!isMultiLane ? "0" : "1");
        road.position.z = this.rowCount;
        this.scene.add(road);
        this.roadCount++;
        break;

        case 3:
        this.logGen();
        this.water[this.waterCount].position.z = this.rowCount;
        this.waterCount++;
        break;
      }
    }
    this.rowCount++;

  }

  treeGen = (isFull = false) => {
    // 0 - 8
    for (x = -3; x < 12; x++) {
      if (x == 9 || x == -1 || isFull) {
          if (this.treeCount < 54) {
            this.treeCount++;
          } else {
            this.treeCount = 0;
          }
          const tree = this._tree.getRandom();
          tree.position.set(x - 4, .4, this.rowCount);
          this.scene.add(tree);
          // this.trees[this.treeCount].position.set(x - 4, .4, this.rowCount);
      } else {
        // if ((x !== 4 && Math.random() > .6) || isFull) {
        //   if (this.treeCount < 54) {
        //     this.treeCount++;
        //   } else {
        //     this.treeCount = 0;
        //   }
        //   this.trees[this.treeCount].position.set(x - 4, .4, this.rowCount);
        // }
      }

    }
  }

  carGen = () => {
    // Speeds: .01 through .08
    // Number of cars: 1 through 3
    this.speed = (Math.floor(Math.random() * (5 - 1)) + 1) / 80;
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

      this.cars[this.carCount].position.set(xPos, .25, this.rowCount);
      this.carSpeed[this.carCount] = this.speed * xDir;

      this.cars[this.carCount].rotation.y = (Math.PI / 2) * xDir;


      xPos -= 5 * xDir;
    }
  }

  logGen = () => {
    // Speeds: .01 through .08
    // Number of cars: 1 through 3
    this.speed = (Math.floor(Math.random() * (3 - 1)) + 1) / 70;
    this.numLogs = Math.floor(Math.random() * (4 - 3)) + 3;
    xDir = 1;

    if (Math.random() > .5) {
      xDir = -1;
    }
    if (this.logSpeed[this.logCount] == this.speed * xDir) {
      this.speed /= 1.5;
    }

    xPos = -6 * xDir;

    for (x = 0; x < this.numLogs; x++) {
      if (this.logCount < 39) {
        this.logCount++;
      } else {
        this.logCount = 0;
      }

      this.logs[this.logCount].position.set(xPos, -0.3, this.rowCount);
      this.logSpeed[this.logCount] = this.speed * xDir;

      xPos -= 5 * xDir;
    }
  }

  // Animate cars/logs
  drive = () => {
    for (d = 0; d < this.cars.length; d++) {
      this.cars[d].position.x += this.carSpeed[d];
      this.logs[d].position.x += this.logSpeed[d];

      if (this.cars[d].position.x > 11 && this.carSpeed[d] > 0) {
        this.cars[d].position.x = -11;
      } else if (this.cars[d].position.x < -11 && this.carSpeed[d] < 0) {
        this.cars[d].position.x = 11;
      }
      if (this.logs[d].position.x > 11 && this.logSpeed[d] > 0) {
        this.logs[d].position.x = -10;
      } else if (this.logs[d].position.x < -11 && this.logSpeed[d] < 0) {
        this.logs[d].position.x = 10;
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

    for (x = 0; x < this.trees.length; x++) {
      if (this.hero.position.z + zPos == this.trees[x].position.z) {
        if (this.hero.position.x + xPos == this.trees[x].position.x) {
          return true;
        }
      }
    }
  }

  carCollision = () => {
    for (c = 0; c < this.cars.length; c++) {
      if (this.hero.position.z == this.cars[c].position.z) {
        if (this.hero.position.x < this.cars[c].position.x + this.cCollide &&
          this.hero.position.x > this.cars[c].position.x - this.cCollide) {

            this.hero.scale.y = 0.001;
            this.hero.position.y = .1;

            this.gameOver();
          }
        }
      }
    }

    currentLog = -1;

    logCollision = () => {
      for (l = 0; l < this.logs.length; l++) {
        if (this.hero.position.z == this.logs[l].position.z) {
          if (this.hero.position.x < this.logs[l].position.x + this.lCollide &&
            this.hero.position.x > this.logs[l].position.x - this.lCollide) {
              this.onLog = true;
              if (this.currentLog != l) {
                this.currentLog = l;
                let timing = 0.2;
                TweenMax.to(this.logs[l].position, timing * 0.9, {
                  y: -0.1,
                });

                TweenMax.to(this.logs[l].position, timing, {
                  y: 0,
                  delay: timing
                });

                TweenMax.to(this.hero.position, timing * 0.9, {
                  y: 0.4,
                });

                TweenMax.to(this.hero.position, timing, {
                  y: 0.5,
                  delay: timing
                });
              }

              // if (!this.moving) {


              if (this.hero.position.x > this.logs[l].position.x) {
                let target = (this.logs[l].position.x + .5);
                this.hero.position.x += ((target - this.hero.position.x)) ;
              } else {
                let target = (this.logs[l].position.x - .5);
                this.hero.position.x += ((target - this.hero.position.x));
              }
              // }
              if (this.hero.position.x > 5 || this.hero.position.x < -5) {
                this.gameOver();
              }
            }
          }
        }
      }

      waterCollision = () => {

        if (this.onLog === false) {
          for (w = 0; w < this.water.length; w++) {
            if (this.hero.position.z == this.water[w].position.z) {
              this.gameOver();

              let y = Math.sin(this.sineCount) * .08 - .2;
              this.sineCount += this.sineInc;
              this.hero.position.y = y;
              for (w = 0; w < this.logSpeed.length; w++) {
                if (this.hero.position.z == this.logs[w].position.z) {
                  this.hero.position.x += this.logSpeed[w] / 3;
                }
              }
            }
          }
        }
      }

      // Move scene forward
      forwardScene = () => {
        if (!this.state.pause) {
          if (Math.floor(this.camera.position.z) < this.hero.position.z - 4) {
            // speed up camera to follow player
            this.camera.position.z += .033;
            if (this.camCount > 1.8) {
              this.camCount = 0;
              this.newRow();
              this.newRow();
              this.newRow();
            } else {
              this.camCount += this.camSpeed;
            }

          } else {
            this.camera.position.z += .011;
            // normal camera speed
            if (this.camCount > 1.8) {
              this.camCount = 0;
              this.newRow();
            } else {
              this.camCount += this.camSpeed;
            }
          }

        }
      }

      // Reset variables, restart game
      gameOver = () => {
        if (!this.state.pause) {
          this.useParticle(this.hero);
        }
        this.setState({pause: true});

        this.endScore();
      }



      tick = (dt) => {
        this.drive();
        this.carCollision();
        this.logCollision();
        this.waterCollision();
        this.forwardScene();
        this.updateScore();
      }

      updateScore = () => {
        const position = Math.floor(this.hero.position.z);
        if (this.state.score < position) {
          this.setState({score: position})
        }
      }

      moveWithDirection = direction => {
        if (this.state.pause ) {
          this.newScore();
        }
        this.onLog = false;



        let timing = 0.5;

        TweenMax.to(this.hero.scale, timing, {
          x: 1.2,
          y: 0.8,
          z: 1,
          ease: Bounce.easeOut,
        });

        const {SWIPE_UP, SWIPE_DOWN, SWIPE_LEFT, SWIPE_RIGHT} = swipeDirections;

        switch (direction) {
          case SWIPE_LEFT:
          if (!this.treeCollision("left")) {
            if (this.hero.position.x !== 4) {

              // if (this.moving) {
              //   return
              // };
              this.moving = true

              TweenMax.to(this.hero.position, this.timing, {
                x: this.hero.position.x + 0.75,
                y: this.hero.position.y + 0.5,
                z: this.hero.position.z,
              });
              TweenMax.to(this.hero.scale, this.timing, {
                x: 1,
                y: 1.2,
                z: 1,
              });
              TweenMax.to(this.hero.scale, this.timing, {
                x: 1.0,
                y: 0.8,
                z: 1,
                delay: this.timing
              });
              TweenMax.to(this.hero.scale, this.timing, {
                x: 1,
                y: 1,
                z: 1,
                ease: Bounce.easeOut,
                delay: this.timing * 2

              });

              TweenMax.to(this.hero.position, this.timing, {
                x: this.hero.position.x + 1,
                y: this.hero.position.y,
                z: this.hero.position.z,
                ease: Power4.easeOut,
                delay: 0.151,
                onComplete: this.doneMoving,
                onCompleteParams: []
              });
            }
          }
          break;
          case SWIPE_RIGHT:
          if (!this.treeCollision("right")) {
            if (this.hero.position.x !== -4) {

              // if (this.moving) {
              //   return
              // };
              this.moving = true

              TweenMax.to(this.hero.position, this.timing, {
                x: this.hero.position.x - 0.75,
                y: this.hero.position.y + 0.5,
                z: this.hero.position.z,
              });
              TweenMax.to(this.hero.scale, this.timing, {
                x: 1,
                y: 1.2,
                z: 1,
              });
              TweenMax.to(this.hero.scale, this.timing, {
                x: 1.0,
                y: 0.8,
                z: 1,
                delay: this.timing
              });
              TweenMax.to(this.hero.scale, this.timing, {
                x: 1,
                y: 1,
                z: 1,
                ease: Bounce.easeOut,
                delay: this.timing * 2

              });

              TweenMax.to(this.hero.position, this.timing, {
                x: this.hero.position.x - 1,
                y: this.hero.position.y,
                z: this.hero.position.z,
                ease: Power4.easeOut,
                delay: 0.151,
                onComplete: this.doneMoving,
                onCompleteParams: []
              });
            }
          }
          break;
          case SWIPE_UP:
          let targetHorizontal = Math.round(this.hero.position.x);

          if (!this.treeCollision("up")) {
            // if (this.moving) {
            //   return
            // };
            this.moving = true

            TweenMax.to(this.hero.position, this.timing, {
              x: targetHorizontal,
              y: this.hero.position.y + 0.5,
              z: this.hero.position.z + 0.75,
            });
            TweenMax.to(this.hero.scale, this.timing, {
              x: 1,
              y: 1.2,
              z: 1,
            });
            TweenMax.to(this.hero.scale, this.timing, {
              x: 1.0,
              y: 0.8,
              z: 1,
              delay: this.timing
            });
            TweenMax.to(this.hero.scale, this.timing, {
              x: 1,
              y: 1,
              z: 1,
              ease: Bounce.easeOut,
              delay: this.timing * 2

            });

            TweenMax.to(this.hero.position, this.timing, {
              x: targetHorizontal,
              y: this.hero.position.y,
              z: this.hero.position.z + 1,
              ease: Power4.easeOut,
              delay: 0.151,
              onComplete: this.doneMoving,
              onCompleteParams: []
            });
          }
          break;
          case SWIPE_DOWN:
          this.hero.position.x = Math.round(this.hero.position.x);
          if (!this.treeCollision("down")) {

            // if (this.moving) {
            //   return
            // };
            this.moving = true

            TweenMax.to(this.hero.position, this.timing, {
              x: this.hero.position.x,
              y: this.hero.position.y + 0.5,
              z: this.hero.position.z - 0.75,
            });
            TweenMax.to(this.hero.scale, this.timing, {
              x: 1,
              y: 1.2,
              z: 1,
            });
            TweenMax.to(this.hero.scale, this.timing, {
              x: 1.0,
              y: 0.8,
              z: 1,
              delay: this.timing
            });
            TweenMax.to(this.hero.scale, this.timing, {
              x: 1,
              y: 1,
              z: 1,
              ease: Bounce.easeOut,
              delay: this.timing * 2
            });

            TweenMax.to(this.hero.position, this.timing, {
              x: this.hero.position.x,
              y: this.hero.position.y,
              z: this.hero.position.z - 1,
              ease: Power4.easeOut,
              delay: 0.151,
              onComplete: this.doneMoving,
              onCompleteParams: []
            });

          }
          break;
        }

      }

      beginMoveWithDirection = direction => {
        if (this.state.pause) {
          return;
        }

        let timing = 0.5;

        TweenMax.to(this.hero.scale, timing, {
          x: 1.2,
          y: 0.8,
          z: 1,
          ease: Bounce.easeOut,
        });


        let rotation;
        const {SWIPE_UP, SWIPE_DOWN, SWIPE_LEFT, SWIPE_RIGHT} = swipeDirections;

        switch (direction) {
          case SWIPE_LEFT:
          rotation = Math.PI / 2;

          break;
          case SWIPE_RIGHT:
          rotation = -Math.PI / 2;

          break;
          case SWIPE_UP:
          rotation = 0;

          break;
          case SWIPE_DOWN:
          rotation = Math.PI;

          break;
        }


        // if (rotation) {
        TweenMax.to(this.hero.rotation, timing * 0.5, {
          y: rotation,
        });


      }


      onSwipeBegin = (gestureName, gestureState) => {
        this.beginMoveWithDirection(gestureName);
        this.moveWithDirection(gestureName);

      }

      onSwipeEnd({ direction }) {
        this.moveWithDirection(direction);
      }


      render() {
        const config = {
          velocityThreshold: 0.3,
          directionalOffsetThreshold: 80
        };

        if (!this.state.ready) {
          return null;
        }
        return (

          <GestureRecognizer
            onSwipe={(direction, state) => this.onSwipeBegin(direction, state)}
            config={config}
            style={{
              flex: 1,
            }}
            >
              <TouchableWithoutFeedback style={{flex: 1}} onPress={_=> {
                  this.onSwipeBegin(swipeDirections.SWIPE_UP, {});
                }}>
                <THREEView
                  backgroundColor={0x6dceea}
                  shadowMapEnabled={true}
                  shadowMapRenderSingleSided={false}
                  style={{ flex: 1 }}
                  scene={this.scene}
                  camera={this.camera}
                  tick={this.tick}
                />
              </TouchableWithoutFeedback>

              { this.state.pause && (
                <View pointerEvents="none" style={{position: 'absolute', left: 0, top: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.2)', justifyContent: 'center', alignItems: 'center'}}>
                  <RetroText style={{color: 'white', fontSize: 48, backgroundColor: 'transparent',  textAlign: 'center'}}>Tap To Play!</RetroText>
              </View>
            )}

            <RetroText style={{color: 'white', fontSize: 48, backgroundColor: 'transparent', position: 'absolute', top: 32, left: 16}}>{this.state.score}</RetroText>


        </GestureRecognizer>
      );
    }
  }
