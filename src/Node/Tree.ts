import Generic from "./Generic";

export default class Grass extends Generic {
  setup = async () => {
    const tree = {
      0: {
        model: require("../../assets/models/environment/tree/0/0.obj"),
        texture: require("../../assets/models/environment/tree/0/0.png"),
      },
      1: {
        model: require("../../assets/models/environment/tree/1/0.obj"),
        texture: require("../../assets/models/environment/tree/1/0.png"),
      },
      2: {
        model: require("../../assets/models/environment/tree/2/0.obj"),
        texture: require("../../assets/models/environment/tree/2/0.png"),
      },
      3: {
        model: require("../../assets/models/environment/tree/3/0.obj"),
        texture: require("../../assets/models/environment/tree/3/0.png"),
      },
    };

    for (let i = 0; i < 4; i++) {
      await this._register(`${i}`, {
        ...tree[`${i}`],
        castShadow: true,
        receiveShadow: false,
      });
    }
    return this.models;
  };
}
