import * THREE from 'three';

import Game from './Game';

class ScreenFlash {
    constructor() {
        const flashPlane = new THREE.PlaneGeometry(20, 20, 1, 1);
        const flashMat = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            side: THREE.DoubleSide,
            opacity: 0
        });
        const flash = new THREE.Mesh(flashPlane, flashMat);
        Game.scene.add(flash);
        this.flash = flash;
        this.name = 'screenflash';
        this.flash.rotation.set(Game.camera.rotation.x, Game.camera.rotation.y, Game.camera.rotation.z);
        this.length = 1;
        this.RedFlash = new THREE.Color(0xff0000);
        this.time = 0;
    }

    pool() {
        this.flash.material.opacity = 0;
        Game.removefromPhysics(this);
    }
    tick(deltaTime) {
        this.time += deltaTime;
        const timeCount = this.time / this.length;
        this.flash.material.opacity = 1.0 - timeCount;
        if (timeCount > 0.2) {
            this.flash.material.color.lerp(this.RedFlash, timeCount - 0.2);
        }
        if (timeCount > 0.999) {
            this.flash.material.opacity = 0;
        }
        if (this.flash.material.opacity < 0.1) {
            this.pool;
        }
    }
    play() {
        this.flash.position.set(Game.camera.position.x, Game.camera.position.y, Game.camera.position.z - 1);
        this.flash.material.opacity = 1;
        this.flash.material.color.set(0xFFFFFF);
        Game.physicsObjects.push(this);
        this.time = 0;
    }
}

export default ScreenFlash;