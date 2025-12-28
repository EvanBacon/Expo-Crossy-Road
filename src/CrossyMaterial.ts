import { Asset } from "expo-asset";
import {
  MeshLambertMaterial,
  NearestFilter,
  SRGBColorSpace,
  Texture,
  TextureLoader,
} from "three";
import { Image } from "react-native";

const textureCache: Record<string, Texture> = {};
const materialCache: Record<string, MeshLambertMaterial> = {};

async function loadTextureAsync(resource: Asset): Promise<Texture> {
  const key = JSON.stringify(resource.uri);
  const cacheKey = String(key);

  if (textureCache[cacheKey]) {
    return textureCache[cacheKey].clone();
  }

  if (process.env.EXPO_OS === "web") {
    const texture = await new TextureLoader().loadAsync(resource.uri);

    texture.magFilter = NearestFilter;
    texture.minFilter = NearestFilter;
    texture.colorSpace = SRGBColorSpace;

    textureCache[cacheKey] = texture;
    return texture;
  }
  //

  const { width, height } = await Image.getSize(resource.uri);
  const texture = new Texture(
    {
      data: resource,
      width: width,
      height: height,
    },
    undefined,
    undefined,
    undefined,
    NearestFilter,
    NearestFilter
  );
  texture["isDataTexture"] = true; // Forces passing to `gl.texImage2D(...)` verbatim
  texture.colorSpace = SRGBColorSpace;
  texture.needsUpdate = true;

  textureCache[cacheKey] = texture;
  return texture;
}

export default class CrossyMaterial extends MeshLambertMaterial {
  static async loadAsync(
    resource: string | number | { uri: string }
  ): Promise<MeshLambertMaterial> {
    const asset = Asset.fromModule(resource);
    await asset.downloadAsync();

    const cacheKey = asset.uri;

    if (materialCache[cacheKey]) {
      return materialCache[cacheKey].clone();
    }

    const texture = await loadTextureAsync(asset);
    materialCache[cacheKey] = new MeshLambertMaterial({
      map: texture,
    });

    return materialCache[cacheKey];
  }
}
