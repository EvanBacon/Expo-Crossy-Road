import Direction from "../Game/Direction";

export default {
    [Direction.UP]: {x: 0, z: 1, angle: 0 },
    [Direction.DOWN]: {x: 0, z: -1, angle: Math.PI },
    [Direction.RIGHT]: {x: -1, z: 0, angle: -Math.PI / 2 },
    [Direction.LEFT]: {x: 1, z: 0, angle: Math.PI / 2 },
  }