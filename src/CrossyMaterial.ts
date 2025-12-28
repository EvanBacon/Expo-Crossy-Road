import { Asset } from "expo-asset";
import {
  MeshLambertMaterial,
  NearestFilter,
  SRGBColorSpace,
  Texture,
  ImageLoader,
  TextureLoader,
} from "three";
import { Image } from "react-native";
import { loadAsync, loadTextureAsync as hack } from "expo-three";
// import { loadAsync } from "expo-three";

const textureCache: Record<string, Texture> = {};
const materialCache: Record<string, MeshLambertMaterial> = {};

// class ExpoTextureLoader extends TextureLoader {
//   load(
//     asset: string,
//     onLoad?: (texture: Texture) => void,
//     onProgress?: (event: ProgressEvent) => void,
//     onError?: (event: unknown) => void
//   ): Texture {
//     if (!asset) {
//       throw new Error(
//         "ExpoTHREE.TextureLoader.load(): Cannot parse a null asset"
//       );
//     }

//     const texture = new Texture();

//     const loader = new ImageLoader(this.manager);
//     // loader.setCrossOrigin(this.crossOrigin);
//     // loader.setPath(this.path);

//     (async () => {
//       // const nativeAsset = await resolveAsync(asset);

//       function parseAsset(image) {
//         texture.image = image;
//         texture.needsUpdate = true;

//         if (onLoad !== undefined) {
//           onLoad(texture);
//         }
//       }

//       if (process.env.EXPO_OS === "web") {
//         loader.load(
//           asset,
//           (image) => {
//             parseAsset(image);
//           },
//           onProgress,
//           onError
//         );
//       } else {
//         const { width, height } = await new Promise<{
//           width: number;
//           height: number;
//         }>((res, rej) => {
//           Image.getSize(
//             asset,
//             (width: number, height: number) => res({ width, height }),
//             rej
//           );
//         });

//         texture["isDataTexture"] = true; // Forces passing to `gl.texImage2D(...)` verbatim

//         parseAsset({
//           data: asset,
//           width: width,
//           height: height,
//         });
//       }
//     })();

//     return texture;
//   }
// }

// async function loadExpoNativeTextureAsync(asset: string): Promise<any> {
//   return new Promise((resolve, reject) =>
//     new ExpoTextureLoader().load(asset, resolve, undefined, reject)
//   );
// }

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

  const texture = await hack({ asset: resource });
  // const { width, height } = await Image.getSize(resource);
  // const texture = new Texture(
  //   {
  //     data: resource,
  //     width: width,
  //     height: height,
  //   },
  //   undefined,
  //   undefined,
  //   undefined,
  //   NearestFilter,
  //   NearestFilter
  // );
  // texture["isDataTexture"] = true; // Forces passing to `gl.texImage2D(...)` verbatim
  // // texture.magFilter = NearestFilter;
  // // texture.minFilter = NearestFilter;
  // texture.colorSpace = SRGBColorSpace;
  // texture.needsUpdate = true;

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
