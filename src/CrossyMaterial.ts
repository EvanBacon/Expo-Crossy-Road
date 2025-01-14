import { TextureLoader } from "expo-three";
import { MeshPhongMaterial, NearestFilter } from "three";

const textureCache = {};

export function loadTexture(resource) {
  const resKey = typeof resource === "string" ? resource : resource.uri;
  if (textureCache[resKey]) {
    return textureCache[resKey].clone();
  }
  const texture = new TextureLoader().load(resKey);

  texture.magFilter = NearestFilter;
  texture.minFilter = NearestFilter;

  textureCache[resKey] = texture;
  return texture;
}

const materialCache = {};

export default class CrossyMaterial extends MeshPhongMaterial {
  static loadTexture = loadTexture;

  static load(resource) {
    const resKey = typeof resource === "string" ? resource : resource.uri;

    if (materialCache[resKey]) {
      return materialCache[resKey].clone();
    }
    materialCache[resKey] = new MeshPhongMaterial({
      map: loadTexture(resKey),
      flatShading: true,
      emissiveIntensity: 0,
      shininess: 0,
      reflectivity: 0,
    });

    return materialCache[resKey];
  }
}
