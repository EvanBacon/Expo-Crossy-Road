import * as THREE from 'three';

import Game from './Game';
import getShader from './getShader';

class ParticleSystem {

    constructor(count, color, position, acceleration, gravity, size, direction, particleGeo, texture, stopAtGround, loops, lifetime, parent, rate) {

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
        this.loops = loops ? loops : 0;
        this.lifetime = lifetime ? lifetime : 5;
        this.rate = rate ? rate : 0;
        this.enabled = false;
        this.parent = parent;
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
            particle.position.set(position.x, pY + 0.5 + position.y, position.z);
            particle.momentum = new THREE.Vector3((pX + direction.x) * acceleration / scale, (pY + 0.5 + direction.y) * acceleration / scale, (pZ + direction.z) * acceleration / scale);
            particle.alive = false;
            particle.loops = this.loops;
            particle.lifetime = this.lifetime;
            particle.deltaTime = 0;
            particle.scale.multiplyScalar(scale);
            this.particles.push(particle);
        }
        Game.physicsObjects.push(this);
    }

    tick(deltaTime) {
        if (Game.frameCount == this.LastFrameTicked) {
            return;
        }
        this.LastFrameTicked = Game.frameCount;
        for (let i = 0; i < this.particles.length; i++) {
            const spawnParticle = this.Timer > this.rate;
            if (this.particles[i].alive === true) {
                this.particles[i].deltaTime += deltaTime;
                if (this.particles[i].deltaTime > this.particles[i].lifetime) {
                    this.particles[i].deltaTime = 0;
                    this.particles[i].alive = false;
                    Game.scene.remove(this.particles[i]);
                    continue;
                }
            } else if (spawnParticle) {
                if (this.enabled) {
                    this.particles[i].alive = true;
                    Game.scene.add(this.particles[i]);
                    this.resetParticle(this.particles[i]);
                    this.Timer -= this.rate;
                }
            } else {
                continue;
            }
            const dx = Math.abs(this.particles[i].position.x - this.position.x);
            const dz = Math.abs(this.particles[i].position.z - this.position.z);
            this.particles[i].momentum.y -= this.gravity;
            if (this.particles[i].position.y < 0.3 && this.stopAtGroundLevel) {
                this.particles[i].momentum.y = 0;
                this.particles[i].momentum.x = 0;
                this.particles[i].momentum.z = 0;
            }
            this.particles[i].position.set(this.acceleration * this.particles[i].momentum.x * deltaTime + this.particles[i].position.x, this.acceleration * this.particles[i].momentum.y * deltaTime + this.particles[i].position.y, this.acceleration * this.particles[i].momentum.z * deltaTime + this.particles[i].position.z);
            if (this.rotationSpeed > 0) {
                this.particles[i].rotateY(this.rotationSpeed * deltaTime * Math.random());
                this.particles[i].rotateX(this.rotationSpeed * 0.1 * deltaTime * Math.random());
            }
            if (this.colourA !== this.colourB && this.particles[i].geometry.faces[0].color !== this.colourA) {
                const color = this.getColourInCurrentRange();
                for (let j = 0; j < this.particles[i].geometry.faces.length; j++) {
                    this.particles[i].geometry.faces[j].color.set(color);
                }
                this.particles[i].geometry.colorsNeedUpdate = true;
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
        if (!x) {
            x = this.position.x;
        }
        if (!y) {
            y = this.position.y;
        }
        if (!z) {
            z = this.position.z;
        }
        this.position.set(x, y, z);
        this.Timer = 0;
        for (let p = 0; p < this.particles.length; p++) {
            const scale = Math.random() + 0.5;
            const pX = (Math.random() - 0.5) * this.size;
            const pY = (Math.random() - 0.5) * this.size;
            const pZ = (Math.random() - 0.5) * this.size;
            this.particles[p].position.set(this.position.x, this.position.y, this.position.z);
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
    resetParticle(particle, x, y, z) {
        if (!x) {
            x = this.position.x;
        }
        if (!y) {
            y = this.position.y;
        }
        if (!z) {
            z = this.position.z;
        }
        if (!this.parent) {
            return;
        }
        this.Timer = 0;
        const scale = Math.random() + 0.5;
        const pX = (Math.random() - 0.5) * this.size;
        const pY = (Math.random() - 0.5) * this.size;
        const pZ = (Math.random() - 0.5) * this.size;
        particle.position.set(this.parent.position.x, 0.8, this.parent.position.z + 0.3);
        particle.momentum.set(this.direction.x * this.acceleration / scale, this.direction.y * this.acceleration / scale, this.direction.z * this.acceleration / scale);
        if (this.colourA !== this.colourB && particle.geometry.faces[0].color !== this.colourA) {
            const color = this.getColourInCurrentRange();
            for (let j = 0; j < particle.geometry.faces.length; j++) {
                particle.geometry.faces[j].color.set(color);
            }
            particle.geometry.colorsNeedUpdate = true;
        }
    }
    play() {
        this.enabled = true;
    }
    stop() {
        this.enabled = false;
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
    emit(time) {
        if (!Game.physicsObjects.includes(this)) {
            Game.physicsObjects.push(this);
        }
        this.enabled = true;
        const self = this;
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            self.enabled = false;
        }, time);
    }


}

export default ParticleSystem;