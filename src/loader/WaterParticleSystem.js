
import getShader from './getShader';
import Game from './Game';
import * as THREE from 'three';

class WaterParticleSystem {
    constructor(count, color, position, acceleration, gravity, size, direction, particleGeo, texture, stopAtGround) {
        this.acceleration = acceleration;
        this.gravity = gravity;
        this.position = position;
        this.particles = [];
        this.size = size;
        this.Timer = 0;
        this.direction = direction;
        if (this.direction == null) {
            this.direction = new THREE.Vector3(0, 0, 0);
        }
        this.stopAtGroundLevel = false || stopAtGround;
        this.rotationSpeed = 0;
        this.LastFrameTicked = Game.frameCount;
        this.colourA = color;
        this.colourB = color;
        if (particleGeo == null) {
            var particleGeo = new THREE.BoxBufferGeometry(0.15, 0.15, 0.15);
        }
        if (texture != null) { }
        const shader = getShader();
        const uniforms = THREE.UniformsUtils.clone(shader.uniforms);
        uniforms.dirLightColor.value = new THREE.Color(color);
        const pMaterial = new THREE.ShaderMaterial({
            uniforms,
            vertexColors: THREE.VertexColors,
            vertexShader: shader.vertexShader,
            fragmentShader: shader.fragmentShader,
            flatShading: true
        });
        for (let p = 0; p < count; p++) {
            const pX = (Math.random() - 0.5) * size;
            const pY = (Math.random() - 0.5) * size;
            const pZ = (Math.random() - 0.5) * size;
            const particle = new THREE.Mesh(particleGeo.clone(), pMaterial);
            const scale = Math.random() + 0.5;
            particle.position.set(pX + position.x, pY + 0.5 + position.y, pZ + position.z);
            particle.momentum = new THREE.Vector3((pX + direction.x) * acceleration / scale, (pY + 0.5 + direction.y) * acceleration / scale, (pZ + direction.z) * acceleration / scale);
            Game.scene.add(particle);
            particle.scale.multiplyScalar(scale);
            this.particles.push(particle);
        }
    }

    tick(deltaTime) {
        
        if (this.Timer > 5) {
            this.pool();
        }
        if (Game.frameCount == this.LastFrameTicked) {
            return;
        }
        this.LastFrameTicked = Game.frameCount;
        for (let i = 0; i < this.particles.length; i++) {
            const dx = Math.abs(this.particles[i].position.x - this.position.x);
            const dz = Math.abs(this.particles[i].position.z - this.position.z);
            this.particles[i].momentum.y -= this.gravity;
            if (this.particles[i].position.y < 0.3 && this.stopAtGroundLevel) {
                this.particles[i].momentum.y = 0;
                this.particles[i].momentum.x = 0;
                this.particles[i].momentum.z = 0;
            }
            this.particles[i].position.set(this.acceleration * (this.particles[i].momentum.x / dx) * deltaTime + this.particles[i].position.x, this.acceleration * this.particles[i].momentum.y * deltaTime + this.particles[i].position.y, this.acceleration * (this.particles[i].momentum.z / dz) * deltaTime + this.particles[i].position.z);
            if (this.rotationSpeed > 0) {
                this.particles[i].rotateY(this.rotationSpeed * deltaTime * Math.random());
                this.particles[i].rotateX(this.rotationSpeed * 0.1 * deltaTime * Math.random());
            }
        }
        this.Timer += deltaTime;
    }
    pool() {
        
        for (let i = 0; i < this.particles.length; i++) {
            this.particles[i].position.set(60, 60, 60);
        }
        Game.removefromPhysics(this);
    }
    reset(x, y, z) {
        
        this.position.set(x, y, z);
        this.Timer = 0;
        for (let p = 0; p < this.particles.length; p++) {
            const scale = Math.random() + 0.5;
            const pX = (Math.random() - 0.5) * this.size;
            const pY = (Math.random() - 0.5) * this.size;
            const pZ = (Math.random() - 0.5) * this.size;
            this.particles[p].position.set(pX + this.position.x, pY + this.position.y, pZ + this.position.z);
            this.particles[p].momentum.set((pX + this.direction.x) * this.acceleration / scale, (pY + this.direction.y) * this.acceleration / scale, (pZ + this.direction.z) * this.acceleration / scale);
            if (this.colourA !== this.colourB && this.particles[p].geometry.faces[0].color !== this.colourA) {
                const color = this.getColourInCurrentRange();
                for (let j = 0; j < this.particles[p].geometry.faces.length; j++) {
                    this.particles[p].geometry.faces[j].color.set(color);
                }
                this.particles[p].geometry.colorsNeedUpdate = true;
            }
        }
    }
    play() {
        Game.physicsObjects.push(this);
    }
    setRotationSpeed(speed) {
        this.rotationSpeed = speed;
    }
    setColourRange(colourA, colourB) {
        this.colourA = new THREE.Color(colourA);
        this.colourB = new THREE.Color(colourB);
    }
    getColourInCurrentRange() {
        const Colour = new THREE.Color(this.colourA);
        Colour.lerp(this.colourB, Math.random());
        return Colour;
    }

}

export default WaterParticleSystem;