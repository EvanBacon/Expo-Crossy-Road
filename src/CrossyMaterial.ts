import { loadAsync } from "expo-three";
import { MeshPhongMaterial, NearestFilter, Texture } from "three";

const textureCache: Record<string, Texture> = {};
const materialCache: Record<string, MeshPhongMaterial> = {};

export async function loadTextureAsync(
  resource: string | number | { uri: string }
): Promise<Texture> {
  const cacheKey = String(resource);

  if (textureCache[cacheKey]) {
    return textureCache[cacheKey].clone();
  }

  const texture = (await loadAsync(resource)) as Texture;
  texture.magFilter = NearestFilter;
  texture.minFilter = NearestFilter;

  textureCache[cacheKey] = texture;
  return texture;
}

export default class CrossyMaterial extends MeshPhongMaterial {
  static loadTextureAsync = loadTextureAsync;

  static async loadAsync(
    resource: string | number | { uri: string }
  ): Promise<MeshPhongMaterial> {
    const cacheKey = String(resource);

    if (materialCache[cacheKey]) {
      return materialCache[cacheKey].clone();
    }

    const texture = await loadTextureAsync(resource);
    materialCache[cacheKey] = new MeshPhongMaterial({
      map: texture,
      flatShading: true,
      emissiveIntensity: 0,
      shininess: 0,
      reflectivity: 0,
    });

    return materialCache[cacheKey];
  }
}
