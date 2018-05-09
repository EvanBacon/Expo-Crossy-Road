import Assets from '../../Assets';
import CrossyNode from './CrossyNode';
import MapSize from '../../constants/MapSize';
import VelocitySettings from '../../constants/VelocitySettings';

import TWEEN from '../Tween';

class Player extends CrossyNode {
  constructor() {
    super();
    this.resetPosition();
  }

  resetPosition = () => {
    this.elevation = 0;
    this.row = MapSize.initialPlayerRow;
    this.column = MapSize.initialPlayerColumn;
  };

  name = 'characters.chicken';
  async loadAsync(scene) {
    const modelIndex = Assets.models.characters.chicken;
    let node = await super.loadAsync(scene, modelIndex, {
      x: 0.5,
      y: 1,
      z: 0.5,
    });
    node.position.x = 0.5;
    node.position.z = -0.5;
    this.characterNode = node;
    return node;
  }

  rotate = direction => {
    const { angle } = VelocitySettings[direction];
    this.characterNode.rotation.y = angle;
  };

  move = direction => {
    const moveSettings = VelocitySettings[direction];

    if (this.animations) {
      this.animations.forEach(animation => animation.stop());
      this.animations = null;
    }

    const target = {
      x: Math.round(this.position.x + moveSettings.x),
      y: 0,
      z: Math.round(this.position.z + moveSettings.z),
    };

    const onStopPosition = () => {
      this.position.set(target.x, target.y, target.z);
    };
    const onStopScale = () => {
      this.scale.set(1, 1, 1);
    };

    const timing = 100;
    const scaleTiming = timing * 2 / 3;
    let jump = new TWEEN.Tween(this.position)
      .to(
        {
          x: this.position.x + moveSettings.x * 0.75,
          y: 0.5,
          z: this.position.z + moveSettings.z * 0.75,
        },
        timing,
      )
      .onStop(onStopPosition);

    const fall = new TWEEN.Tween(this.position)
      .to(target, timing)
      .onStop(onStopPosition);

    jump.chain(fall);

    const jumpScale = new TWEEN.Tween(this.scale)
      .to(
        {
          x: 1,
          y: 1.2,
          z: 1,
        },
        scaleTiming,
      )
      .onStop(onStopScale);

    const fallScale = new TWEEN.Tween(this.scale)
      .to(
        {
          x: 1,
          y: 0.8,
          z: 1,
        },
        scaleTiming,
      )
      .onStop(onStopScale);

    const returnScale = new TWEEN.Tween(this.scale)
      .to(
        {
          x: 1,
          y: 1,
          z: 1,
        },
        scaleTiming,
      )
      .onStop(onStopScale);

    jumpScale.chain(fallScale);
    fallScale.chain(returnScale);

    jump.start();
    jumpScale.start();

    this.animations = [jump, jumpScale];
  };
}

export default Player;
