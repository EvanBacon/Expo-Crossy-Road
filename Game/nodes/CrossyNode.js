import Exotic from 'expo-exotic';
import ExpoTHREE from 'expo-three';

class CrossyNode extends Exotic.GameObject {
  async loadAsync(scene, modelIndex) {
    if (modelIndex) {
      const model = await this.loadStaticModelFromIndexAsync(modelIndex);
      this.add(model);
    }
    return super.loadAsync(scene);
  }

  loadStaticModelFromIndexAsync = async modelIndex => {
    const assetProvider = name => modelIndex[name];
    const model = await ExpoTHREE.loadAsync(
      [modelIndex['0.obj'], modelIndex['0.mtl']],
      null,
      assetProvider,
    );
    return model;
  };
}

export default CrossyNode;
