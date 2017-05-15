var ndarray = require("ndarray")

const {THREE} = global;

import Grass from './Grass';
import Tree from './Tree';
import Car from './Car';
import RailRoad from './RailRoad';

export class Direction {
  static Forward = 'Forward';
  static Backward = 'Backward';
  static Left = 'Left';
  static Right = 'Right';
}

export class MapItem {
  static Obstacle = 'Obstacle';
  static Invalid = 'Invalid';
  static Grass = 'Grass';
  static Road = 'Road';
}


/*
  Map Goals:

    • Starting Padding: 11
      1 Empty Layer
      4 layers of solid obstacles
      3 traversable layers behind spawn point
      1 spawn point
      1 safe layer in front of player

    • River
    • Road
      Single Lane
      Multi Lane
    • RailRoad

    Procedrually create world as the player moves.
    Deallocate unused layers.

*/
export default class Map {

  constructor({width, height}) {
    // Level data is stored in a 2D array
    this.data = ndarray(new Float64Array(Array(width * height).fill(MapItem.Obstacle)), [width, height]);

    // Create the level procedurally
    for (let row = 5; row < this.data.shape[0] - 6; row++) {
      var type = MapItem.Invalid

      // Determine if this should be a grass (0) or road (1)
      if (row < 8 || row > this.data.shape[0] - 10) {
        // The first and last four rows will be grass
        type = MapItem.Grass;
      } else {
        type = parseInt(2 * Math.random() << 0) > 0 ? MapItem.Grass : MapItem.Road;
      }

      this.fillLevelDataRowWithType({type, row})

    }

    // Always make sure the player spawn point is not an obstacle
    // TODO: Make sure this is not hardcoded
    this.data[7, 6] = MapItem.Grass
  }

  segmentSize = 0.2;
  maxObstaclesPerRow = 3;

  fillLevelDataRowWithType = ({type, row}) => {

    for (let column = 0; column < this.data.shape[1]; column += 1) {
     var obstacleCountInRow = 0
     if (column < 5 || column > this.data.shape[1] - 6) {
       // Always obstacles at borders
       this.data.set(column, row, MapItem.Obstacle);
     } else {
       if (type == MapItem.Grass && obstacleCountInRow < this.maxObstaclesPerRow) {
         // Determine if an obstacle should be added
         if (((100 * Math.random()) << 0) > 80) {
           // Add obstacle
           this.data.set(column, row, MapItem.Obstacle);
           obstacleCountInRow++
         } else {
           // Add grass
           this.data.set(column, row, type)
         }
       } else {
         this.data.set(column, row, type);
       }
     }
   }
console.log("FROG: Got that level data", this.data)
  }

  coordinatesForGridPosition = ({column, row}) => {
    // Raise an error is the column or row is out of bounds
    if (column < 0 || column > this.data.shape[1] - 1 || row < 0 || row > this.data.shape[0] - 1) {
      fatalError("The row or column is out of bounds")
    }

    const x = Math.floor(column - this.data.shape[1] / 2)
    const y = -row;
    return {x: x * 0.2, y: 0, z: y * 0.2};
  }


  gridColumnAndRowAfterMoveInDirection = ({direction, currentGridColumn, currentGridRow}) => {

    // Calculate the new grid position after the move
    var newGridColumn = currentGridColumn
    var newGridRow = currentGridRow

    switch (direction) {
    case Direction.Forward:
      newGridRow += 1
      break;
    case Direction.Backward:
      newGridRow -= 1
      break
    case Direction.Left:
      newGridColumn -= 1
      break
    case Direction.Right:
      newGridColumn += 1
    }

    // Determine the type of data at new position
    let type = this.gameLevelDataTypeForGridPosition({column: newGridColumn, row: newGridRow})

    switch (type) {
    case MapItem.Invalid:
    case MapItem.Obstacle:
      // Cannot move here, so return the column and row passed.
      return {didMove: false,newGridColumn: currentGridColumn,newGridRow: currentGridRow}
    default:
      // Move is valid, so return the new column and row
      return {didMove: true, newGridColumn: newGridColumn,newGridRow: newGridRow}
    }
  }


  gameLevelDataTypeForGridPosition = ({column, row}) => {
    // Raise an error is the column or row is out of bounds
    if (column < 0 || column > this.data.shape[1] - 1 || row < 0 || row > this.data.shape[0] - 1) {
      return MapItem.Invalid
    }

    let type = this.data[column, row];
    return type
  }

  gameLevelWidth = () => {
    return this.data.shape[1] * segmentSize
  }
  gameLevelHeight = () => {
    return this.data.shape[0] * segmentSize
  }

  buildLevel = async ({position, parentNode}) => {
    this._grass = new Grass();
    this._tree  = new Tree();
    this._car   = new Car();
    this._river   = new River();
    this._railroad = new RailRoad();
    await Promise.all([
      this._grass.setup(),
      this._tree.setup(),
      this._car.setup(),
      this._railroad.setup()
    ])

    this.setupLevelAtPosition({position, parentNode})
  }

  addCar = ({position, direction, parentNode}) => {
    let car = this._car.model.clone();
    car.position.set(position.x, position.y, position.z);

    parentNode.add(car);
  }

  setupLevelAtPosition = ({position, parentNode}) => {


    let levelNode = THREE.Object3D()

    // // Create light grass material
    // let lightGrassMaterial = SCNMaterial()
    // lightGrassMaterial.diffuse.contents = UIColor(red: 190.0/255.0, green: 244.0/255.0, blue: 104.0/255.0, alpha: 1.0)
    // lightGrassMaterial.locksAmbientWithDiffuse = false
    //
    // // Create dark grass material
    // let darkGrassMaterial = SCNMaterial()
    // darkGrassMaterial.diffuse.contents = UIColor(red: 183.0/255.0, green: 236.0/255.0, blue: 96.0/255.0, alpha: 1.0)
    // darkGrassMaterial.locksAmbientWithDiffuse = false
    //
    // // Create tree top material
    // let treeTopMaterial = SCNMaterial()
    // treeTopMaterial.diffuse.contents = UIColor(red: 118.0/255.0, green: 141.0/255.0, blue: 25.0/255.0, alpha: 1.0)
    // treeTopMaterial.locksAmbientWithDiffuse = false
    //
    // // Create tree trunk material
    // let treeTrunkMaterial = SCNMaterial()
    // treeTrunkMaterial.diffuse.contents = UIColor(red: 185.0/255.0, green: 122.0/255.0, blue: 87.0/255.0, alpha: 1.0)
    // treeTrunkMaterial.locksAmbientWithDiffuse = false
    //
    // // Create road material
    // let roadMaterial = SCNMaterial()
    // roadMaterial.diffuse.contents = UIColor.darkGrayColor()
    // roadMaterial.diffuse.wrapT = SCNWrapMode.Repeat
    // roadMaterial.locksAmbientWithDiffuse = false




    // First, create geometry for grass and roads
    for (let row = 0; row < this.data.shape[0]; row++) {

      // HACK: Check column 5 as column 0 to 4 will always be obstacles
      let type = this.gameLevelDataTypeForGridPosition({column: 5, row: row})
      switch (type) {
      case MapItem.Road:
{

        let road = this._road.model.clone();

        // // Create a road row
        // let roadGeometry = SCNPlane(width: this.gameLevelWidth(), height: segmentSize)
        // roadGeometry.widthSegmentCount = 1
        // roadGeometry.heightSegmentCount = 1
        // roadGeometry.firstMaterial = roadMaterial
        //
        // let roadNode = SCNNode(geometry: roadGeometry)
        const point = this.coordinatesForGridPosition({column: this.data.shape[1] / 2, row: row})
        road.position.set(point.x,point.y,point.z);
        // roadNode.rotation = SCNVector4(x: 1.0, y: 0.0, z: 0.0, w: -3.1415 / 2.0)
        parentNode.add(road);

        // Create a spawn node at one side of the road depending on whether the row is even or odd

        // Determine if the car should start from the left of the right
        // let startCol = row % 2 == 0 ? 0 : this.data.shape[1] - 1
        let moveDirection = row % 2 == 0 ? 1.0 : -1.0

        // Determine the position of the node
        var position = this.coordinatesForGridPosition({column: startCol, row: row})
        position = {x: position.x, y: 0.15, z: position.z};

        setTimeout(_=> {
          this.addCar({parentNode, position, direction});
        }, 5000);
        // // Create node
        // let spawnNode = SCNNode()
        // spawnNode.position = position

        // Create an action to make the node spawn cars
        // let spawnAction = SCNAction.runBlock({ node in
        //   self.spawnDelegate!.spawnCarAtPosition(node.position)
        // })

        // Will spawn a new car every 5 + (random time interval up to 5 seconds)
        // let delayAction = SCNAction.waitForDuration(5.0, withRange: 5.0)
        //
        // spawnNode.runAction(SCNAction.repeatActionForever(SCNAction.sequence([delayAction, spawnAction])))
        //
        // parentNode.add(spawnNode)
}
        break;
      default:

        const point = this.coordinatesForGridPosition({column: (this.data.shape[1] / 2), row: row});

        let grass = this._grass.models[row % 2].clone();
        grass.position.set(point.x, 0.05, point.z);
        parentNode.add(grass);

        //
        // // Create a grass row
        // let grassGeometry = SCNPlane(width: CGFloat(this.gameLevelWidth()), height: CGFloat(this.segmentSize))
        // grassGeometry.widthSegmentCount = 1
        // grassGeometry.heightSegmentCount = 1
        // grassGeometry.firstMaterial = row % 2 == 0 ? lightGrassMaterial : darkGrassMaterial
        //
        // let grassNode = SCNNode(geometry: grassGeometry)
        // grassNode.position = this.coordinatesForGridPosition(column: Int(this.data.shape[1] / 2), row: row)
        // // grassNode.rotation = SCNVector4(x: 1.0, y: 0.0, z: 0.0, w: -3.1415 / 2.0)
        // levelNode.addChild(grassNode)

        // Create obstacles
        for (let col = 0; col < this.data.shape[1]; col++) {
          let subType = this.gameLevelDataTypeForGridPosition({column: col, row: row})
          if (subType == MapItem.Obstacle) {
            // Height of tree top is random
            const treeHeight = ((Math.random(5) + 2 << 0)) / 10.0
            const treeTopPosition = (treeHeight / 2.0 + 0.1)

            // Create a tree
            // let treeTopGeomtery = SCNBox(width: 0.1, height: treeHeight, length: 0.1, chamferRadius: 0.0)
            // treeTopGeomtery.firstMaterial = treeTopMaterial
            // let treeTopNode = SCNNode(geometry: treeTopGeomtery)
            // let gridPosition = this.coordinatesForGridPosition({column: col, row: row})
            // treeTopNode.position.set(gridPosition.x, treeTopPosition, gridPosition.z);
            // levelNode.addChild(treeTopNode)

            // let treeTrunkGeometry = SCNBox(width: 0.05, height: 0.1, length: 0.05, chamferRadius: 0.0)
            // treeTrunkGeometry.firstMaterial = treeTrunkMaterial
            // let treeTrunkNode = SCNNode(geometry: treeTrunkGeometry);
            // treeTrunkNode.position.set(gridPosition.x, 0.05, gridPosition.z);
            // levelNode.addChild(treeTrunkNode);

            let tree = _tree.getRandomTree().clone();
            tree.position.set(gridPosition.x, 0.05, gridPosition.z);
            parentNode.add(tree);

          }
        }
        break
      }
    }

    // // Combine all the geometry into one - this will reduce the number of draw calls and improve performance
    // let flatLevelNode = levelNode.flattenedClone()
    // flatLevelNode.name = "Level"
    //
    // // Add the flattened node
    // // parentNode.position = position
    // parentNode.addChild(flatLevelNode)


  }



}
