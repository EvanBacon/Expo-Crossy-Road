import * as THREE from 'three';

import Game from './Game';

class RapidsParticle {
    static pool = [];
    static getRapidsParticle = (x, y, z, rotation) => {
        let particle;
        if (RapidsParticle.pool.length <= 0) {
            particle = new RapidsParticle();
        } else {
            particle = RapidsParticle.pool.pop();
        }
        Game.scene.add(particle.movieMesh);
        particle.movieMesh.position.set(x, y, z);
        particle.movieMesh.rotation.set(Math.PI * 3 / 2, 0, Math.PI * rotation / 2, 'XYZ');
        Game.physicsObjects.push(particle);
        return particle;
    };
    constructor() {
        const texLoader = new THREE.TextureLoader();
        this.spriteSheet = texLoader.load('sprites/particles.png');
        this.texOffset = Math.random();
        const rapidsUV = [new THREE.Vector2(0, 1), new THREE.Vector2(0.5, 1), new THREE.Vector2(0.5, 0.75), new THREE.Vector2(0, 0.75)];
        const geo = new THREE.PlaneGeometry(1.1, 2.2, 1, 1);
        geo.faceVertexUvs[0][0] = [rapidsUV[0], rapidsUV[1], rapidsUV[3]];
        geo.faceVertexUvs[0][1] = [rapidsUV[1], rapidsUV[2], rapidsUV[3]];
        geo.uvsNeedUpdate = true;
        this.textureCanvas = new THREE.Texture(this.spriteSheet, THREE.UVMapping, THREE.RepeatWrapping, THREE.RepeatWrapping);
        this.textureCanvas.uvsNeedUpdate = true;
        this.movieMaterial = new THREE.MeshBasicMaterial({
            alphaMap: this.spriteSheet,
            transparent: true,
            color: 0xFFFFFFFF,
            side: THREE.DoubleSide
        });
        this.movieMesh = new THREE.Mesh(geo, this.movieMaterial);
        this.movieMesh.name = "rapids";
    }
    tick(deltaTime) {
        this.texOffset += deltaTime * 5;
        this.movieMesh.material.alphaMap.offset.set(Math.sin(this.texOffset) * 0.01, 0);
    }
    pool() {
        Game.removefromPhysics(this);
        RapidsParticle.pool.push(this);
        Game.scene.remove(this.movieMesh);
    }
    reset(x, y, z) {
        this.movieMesh.position.set(x, y, z);
    }
}

export default RapidsParticle;