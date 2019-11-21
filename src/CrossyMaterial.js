import { TextureLoader } from 'expo-three';
import * as THREE from 'three';

const textureCache = {};

export function loadTexture(resource) {
    if (textureCache[resource]) {
        return textureCache[resource].clone();
    }

    const texture = new TextureLoader().load(resource);

    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;

    textureCache[resource] = texture;
    return texture;
}

const materialCache = {};

export default class CrossyMaterial extends THREE.MeshPhongMaterial {

    static loadTexture = loadTexture;

    static load(resource) {
        if (materialCache[resource]) {
            return materialCache[resource].clone();
        }
        materialCache[resource] = new THREE.MeshPhongMaterial({
            map: loadTexture(resource),
            flatShading: true,
            emissiveIntensity: 0,
            shininess: 0,
            reflectivity: 0,
        });

        return materialCache[resource];
    }
}