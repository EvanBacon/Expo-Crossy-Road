import * THREE from 'three';

import getShader from './getShader';
import WorldPieces from './WorldPieces';
import Game from './Game';
import CommonWorldPieces from './CommonWorldPieces';

export function importMesh(key, thingToImport, useUnlit, addBoundingCube) {
    if (typeof useUnlit === 'undefined') {
        useUnlit = false;
    }
    const shader = getShader();
    let geometry;
    const uniforms = THREE.UniformsUtils.merge([THREE.ShaderLib.shadow.uniforms, THREE.UniformsUtils.clone(shader.uniforms)]);
    if (geos[key]) {
        geometry = geos[key].geometry;
        vertices = geos[key].vertices;
        colours = geos[key].colours;
        material = geos[key].material;
    } else {
        if (thingToImport === undefined) {
            console.warn(`[DEBUG] Game is gonna crash, model ${key} not found.`);
        }
        var vertices = new Float32Array(thingToImport.vertices);
        var colours = new Float32Array(thingToImport.colors);
        geometry = new THREE.BufferGeometry();
        geometry.addAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        geometry.addAttribute('color', new THREE.Float32BufferAttribute(colours, colours.length !== vertices.length ? 4 : 3));
        geometry.setIndex(thingToImport.faces);
        geometry.computeVertexNormals();
        var material;
        if (useUnlit) {
            material = new THREE.MeshBasicMaterial({
                vertexColors: THREE.VertexColors
            });
        } else {
            material = new THREE.ShaderMaterial({
                uniforms,
                vertexColors: THREE.VertexColors,
                vertexShader: shader.vertexShader,
                fragmentShader: shader.fragmentShader,
                side: THREE.DoubleSide,
                flatShading: true,
                lights: true
            });
        }
        geos[key] = {
            vertices,
            colours,
            geometry,
            material
        };
    }
    const newObject = new THREE.Mesh(geometry, material);
    if (addBoundingCube) {
        var min = 0;
        var max = 0;
        for (var i = 2; i < vertices.length; i += 3) {
            if (vertices[i] < min) {
                min = vertices[i];
            }
            if (vertices[i] > max) {
                max = vertices[i];
            }
        }
        newObject.height = max - min;
        var min = 0;
        var max = 0;
        for (var i = 0; i < vertices.length; i += 3) {
            if (vertices[i] < min) {
                min = vertices[i];
            }
            if (vertices[i] > max) {
                max = vertices[i];
            }
        }
        newObject.width = max - min;
        var min = 0;
        var max = 0;
        for (var i = 1; i < vertices.length; i += 3) {
            if (vertices[i] < min) {
                min = vertices[i];
            }
            if (vertices[i] > max) {
                max = vertices[i];
            }
        }
        newObject.length = max - min;
    }
    if (key.indexOf('strip-') > 0) {
        newObject.receiveShadow = true;
    } else {
        newObject.castShadow = true;
    }
    return newObject;
}

export function GetRandomWorldPieceVariation(worldPiece) {
    let worldPieces = Game.currentWorldPieces;
    if (worldPiece === 'coin' || worldPiece === 'red-coin') {
        worldPieces = CommonWorldPieces.default;
    }
    if (worldPieces[worldPiece].Variations.length == 1) {
        return worldPieces[worldPiece].Variations[0];
    }
    let totalWeighting = 0;
    for (var i = 0; i < worldPieces[worldPiece].Variations.length; i++) {
        if (Game.CurrentRow >= worldPieces[worldPiece].Variations[i].scoreRequired) {
            totalWeighting += worldPieces[worldPiece].Variations[i].weight;
        }
    }
    const random = Math.random() * totalWeighting;
    let currentTotal = 0;
    for (var i = 0; i < worldPieces[worldPiece].Variations.length; i++) {
        if (Game.CurrentRow + 2 >= worldPieces[worldPiece].Variations[i].scoreRequired) {
            currentTotal += worldPieces[worldPiece].Variations[i].weight;
            if (currentTotal >= random) {
                return worldPieces[worldPiece].Variations[i];
            }
        }
    }
    return worldPieces[worldPiece].Variations[0];
}

class ObjectPooler {
    constructor() { }
    items = {};

    EnterPool(type, item) {
        if (this.items[type] == null) {
            this.items[type] = [];
        }
        if (typeof item.position != "undefined") {
            item.position.set(-60, -60, -60);
            item.visible = false;
        }
        Game.scene.remove(item);
        this.items[type].push(item);
    }

    PoolItemVariation(type, variation) {
        const item = this.GetItemVariation(type, variation, true);
        this.EnterPool(type + variation.name, item);
    }

    GetPieceFrames({ name }) {
        for (let i = 0; i < Object.keys(Game.worlds).length; ++i) {
            if (AssetLoader.loadedAssets[`models/${Object.keys(Game.worlds)[i]}-world.json`] && AssetLoader.loadedAssets[`models/${Object.keys(Game.worlds)[i]}-world.json`]['models'] && AssetLoader.loadedAssets[`models/${Object.keys(Game.worlds)[i]}-world.json`]['models'][`${name.replace(/-/g, '_')}_optimised`]) {
                return [AssetLoader.loadedAssets[`models/${Object.keys(Game.worlds)[i]}-world.json`]['models'][`${name.replace(/-/g, '_')}_optimised`]];
            }
        }
        return [AssetLoader.loadedAssets['models/common-world.json']['models'][`${name.replace(/-/g, '_')}_optimised`]];
    }

    GetItemVariation(type, variation, forceNew) {
        if (typeof forceNew === 'undefined') {
            forceNew = false;
        }
        let object;
        if (this.items[type + variation.name] == null || this.items[type + variation.name].length == 0 || forceNew) {
            if (!variation.frames) {
                for (let i = 0; i < Game.currentWorldPieces[type].Variations.length; ++i) {
                    if (Game.currentWorldPieces[type].Variations[i].name === variation.name) {
                        Game.currentWorldPieces[type].Variations[i].frames = variation.frames = this.GetPieceFrames(variation);
                        break;
                    }
                }
            }
            object = importMesh(`items[${type}${variation.name}`, variation.frames[0]);
            object.name = type + variation.name;
            object.poolName = type + variation.name;
            if (variation.name === 'moon_blockingbarrier') {
                object.material.transparent = true;
                object.material.uniforms.transparency.value = 0.85;
            }
        } else {
            object = this.items[type + variation.name].pop();
            object.visible = true;
        }
        Game.scene.add(object);
        object.position.set(0, 0, 0);
        return object;
    }

    GetItemOfType(type) {
        let worldPieces = Game.currentWorldPieces;
        if (type === 'coin' || type === 'red-coin') {
            worldPieces = CommonWorldPieces.default;
        }
        const randomVariation = GetRandomWorldPieceVariation(type);
        let object;
        if (this.items[type + randomVariation.name] == null || this.items[type + randomVariation.name].length == 0) {
            if (!randomVariation.frames) {
                for (var i = 0; i < worldPieces[type].Variations.length; ++i) {
                    if (worldPieces[type].Variations[i].name === randomVariation.name) {
                        worldPieces[type].Variations[i].frames = randomVariation.frames = this.GetPieceFrames(randomVariation);
                        break;
                    }
                }
            }
            object = importMesh(`items[${type}${randomVariation.name}`, randomVariation.frames[0]);
            object.name = type + randomVariation.name;
            object.poolName = type + randomVariation.name;
            if (type.includes('space') && !type.includes('space-blocking') && !type.includes('space-vehicle-car')) { }
            if (randomVariation.name === 'moon_blockingbarrier') {
                object.material.transparent = true;
                object.material.uniforms.transparency.value = 0.85;
            }
        } else {
            object = this.items[type + randomVariation.name].shift();
            object.visible = true;
        }
        Game.scene.add(object);
        object.position.set(0, 0, 0);
        for (var i = 0; i < worldPieces[type].Variations.length; ++i) {
            if (worldPieces[type].Variations[i].holes) {
                object.holes = worldPieces[type].Variations[i].holes;
            }
        }
        return object;
    }
}

var geos = [];

export default ObjectPooler;