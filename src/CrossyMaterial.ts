import { TextureLoader } from "expo-three";
import { MeshPhongMaterial, NearestFilter } from "three";

const textureCache = {};

export function loadTexture(resource) {
  if (textureCache[resource]) {
    return textureCache[resource].clone();
  }

  const texture = new TextureLoader().load(resource);

  texture.magFilter = NearestFilter;
  texture.minFilter = NearestFilter;

  textureCache[resource] = texture;
  return texture;
}

const materialCache = {};

export default class CrossyMaterial extends MeshPhongMaterial {
  static loadTexture = loadTexture;

  static load(resource) {
    if (materialCache[resource]) {
      return materialCache[resource].clone();
    }
    materialCache[resource] = new MeshPhongMaterial({
      map: loadTexture(resource),
      flatShading: true,
      emissiveIntensity: 0,
      shininess: 0,
      reflectivity: 0,
    });

    return materialCache[resource];
  }
}
