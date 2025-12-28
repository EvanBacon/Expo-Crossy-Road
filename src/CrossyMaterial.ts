import { Asset } from "expo-asset";
import { loadAsync } from "expo-three";
import {
  MeshLambertMaterial,
  NearestFilter,
  SRGBColorSpace,
  Texture,
  TextureLoader,
} from "three";

const textureCache: Record<string, Texture> = {};
const materialCache: Record<string, MeshLambertMaterial> = {};

async function loadTextureAsync(
  resource: string | number | { uri: string }
): Promise<Texture> {
  const key = JSON.stringify(resource);
  const cacheKey = String(key);

  if (textureCache[cacheKey]) {
    return textureCache[cacheKey].clone();
  }

  if (process.env.EXPO_OS === "web") {
    const texture = await new TextureLoader().loadAsync(
      typeof resource === "string" ? resource : resource.uri
    );

    texture.magFilter = NearestFilter;
    texture.minFilter = NearestFilter;
    texture.colorSpace = SRGBColorSpace;

    textureCache[cacheKey] = texture;
    return texture;
  }
  const texture = (await loadAsync(resource)) as Texture;
  texture.magFilter = NearestFilter;
  texture.minFilter = NearestFilter;
  texture.colorSpace = SRGBColorSpace;

  textureCache[cacheKey] = texture;
  return texture;
}

export default class CrossyMaterial extends MeshLambertMaterial {
  static loadTextureAsync = loadTextureAsync;

  static async loadAsync(
    resource: string | number | { uri: string }
  ): Promise<MeshLambertMaterial> {
    const asset = Asset.fromModule(resource);

    const cacheKey = asset.uri;

    if (materialCache[cacheKey]) {
      return materialCache[cacheKey].clone();
    }

    const texture = await loadTextureAsync(asset.uri);
    materialCache[cacheKey] = new MeshLambertMaterial({
      map: texture,
    });

    return materialCache[cacheKey];
  }
}
