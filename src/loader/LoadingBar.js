import * THREE from 'three';

const containerID = 'loading-bar';
const innerContainerID = 'loading-bar-inner-container';
const barID = 'loading-bar-bar';
const loadingTextID = 'loading-bar-text';
const borderClassName = 'loading-bar-border';
const chickenID = 'loading-bar-chicken';
const barTransitionTime = 0.5;
const minUpdateTime = 0.1;
const maxFakeProgress = 0.987;

const style = `\n#${containerID} {\n\tposition: absolute;\n\tz-index: 9999999;\n\twidth: 93%;\n\theight: 5%;\n\tleft: 2.5%;\n\tbottom: -12%;\n\ttransition: all ${barTransitionTime}s ease-in-out;\n\ttransform: translate3d(0,0,0);\n\tperspective: 1000px;\n}\n\n#${innerContainerID} {\n\tposition: absolute;\n\tbackground: #4ecbff;\n\tbox-shadow: inset 0 -5px #0ea9f1;\n\tleft: 0;\n\ttop: 0;\n\twidth: 100%;\n\theight: 100%;\n\tz-index: 1;\n}\n\n#${barID} {\n\theight: 100%;\n\tposition: absolute;\n\tleft: 0;\n\ttop: 0;\n\twidth: 100%;\n\tbackground: #fea47c;\n\ttransform-origin: left;\n\tbox-shadow: inset 0 -5px #ff8149;\n\ttransition: 0.2s all ease-out;\n\tz-index: 1;\n\tperspective: 1000px;\n}\n\n#${loadingTextID} {\n\ttext-align: center;\n\tfont-family: Arial;\n\tfont-weight: bold;\n\tcolor: #fff;\n\tposition: absolute;\n\tz-index: 2;\n\twidth: 100%;\n\ttop: 8%;\n\ttext-shadow: 0 3px rgba(0, 0, 0, 0.2);\n}\n\n.${borderClassName} {\n\tbackground: #fff;\n\tposition: absolute;\n}\n\n#${chickenID} {\n\tposition: absolute;\n\tright: -3%;\n\ttop: -60%;\n\theight: 200%;\n\tz-index: 1;\n\ttransform-origin: 50% 100%;\n\tanimation: chicken-idle-animation .6s ease-in-out alternate infinite;\n}\n\n@keyframes chicken-idle-animation {\n\t0%  { transform: scale3d(1, 1, 1); }\n\t15%  { transform: scale3d(1, 1, 1); }\n\t85% { transform: scale3d(1.1, .9, 1.1); }\n\t100% { transform: scale3d(1.1, .9, 1.1); }\n}\n`;

class LoadingBar {
    constructor() {
        this.enableFakeProgress = false;
        this.wrapper = document.body;
        this.totalProgress = 0;
        this.progress = 0;
        const styleEl = document.createElement('style');
        styleEl.innerHTML = style;
        document.head.appendChild(styleEl);
        this.container = document.createElement('div');
        this.container.id = containerID;
        this.innerContainer = document.createElement('div');
        this.innerContainer.id = innerContainerID;
        this.container.appendChild(this.innerContainer);
        this.bar = document.createElement('div');
        this.bar.id = barID;
        this.innerContainer.appendChild(this.bar);
        this.loadingText = document.createElement('div');
        this.loadingText.id = loadingTextID;
        this.innerContainer.appendChild(this.loadingText);
        this.loadingTextBig = document.createElement('span');
        this.loadingTextBig.innerHTML = '0';
        this.loadingText.appendChild(this.loadingTextBig);
        this.loadingTextSmall = document.createElement('span');
        this.loadingTextSmall.innerHTML = '.0';
        this.loadingText.appendChild(this.loadingTextSmall);
        this.loadingTextPerc = document.createElement('span');
        this.loadingTextPerc.innerHTML = '%';
        this.loadingText.appendChild(this.loadingTextPerc);
        this.borderSides = document.createElement('div');
        this.borderSides.className = borderClassName;
        this.borderSides.style.height = '100%';
        this.container.appendChild(this.borderSides);
        this.borderTopBottom = document.createElement('div');
        this.borderTopBottom.className = borderClassName;
        this.borderTopBottom.style.width = '100%';
        this.container.appendChild(this.borderTopBottom);
        window.addEventListener('resize', this.resize.bind(this));
    }

    show() {
        const _this = this;
        this.chicken = new Image();
        this.chicken.src = this.chickenSrc;
        this.chicken.id = chickenID;
        this.container.appendChild(this.chicken);
        this.wrapper.appendChild(this.container);
        this.resize();
        window.setTimeout(() => {
            _this.container.style.transform = 'translate3D(0, -270%, 0)';
        }, 0);
        requestAnimationFrame(this.update.bind(this));
    }

    enteredNewLoadingPhase(percDedicatedToThisPhase) {
        this.totalProgress += this.currentProgress || 0;
        this.percDedicatedToCurrentPhase = percDedicatedToThisPhase;
    }

    enteredFinalLoadingPhase() {
        this.totalProgress += this.currentProgress || 0;
        this.percDedicatedToCurrentPhase = 1 - this.totalProgress;
    }

    setProgress(currentPhaseProgress, notPoki) {
        this.currentProgress = currentPhaseProgress * this.percDedicatedToCurrentPhase || 0;
        const newProgress = this.totalProgress + this.currentProgress;
        if (Math.round(newProgress) !== this.progress) {
            this.progressWasLastUpdatedAt = Date.now();
        }
        this.progress = Math.max(this.progress, newProgress);
        if (!notPoki) {
            PokiSDK.gameLoadingProgress({
                percentageDone: this.progress
            });
        }
    }

    resize() {
        const containerBounds = this.container.getBoundingClientRect();
        this.loadingText.style.fontSize = `${(containerBounds.height / 1.4).toFixed(2)}px`;
        this.loadingTextSmall.style.fontSize = `${(containerBounds.height / 3).toFixed(2)}px`;
        const borderSize = containerBounds.height / 10;
        this.borderSides.style.left = `-${borderSize}px`;
        this.borderSides.style.width = `${containerBounds.width + borderSize * 2}px`;
        this.borderTopBottom.style.top = `-${borderSize}px`;
        this.borderTopBottom.style.height = `${containerBounds.height + borderSize * 2}px`;
    }

    destroy() {
        const _this2 = this;
        if (this.destroyed) {
            return;
        }
        this.destroyed = true;
        window.removeEventListener('resize', this.resize.bind(this));
        this.container.style.transform = 'translate3d(0,0,0)';
        window.setTimeout(() => {
            _this2.wrapper.removeChild(_this2.container);
        }, barTransitionTime * 1000);
    }

    forceFinished() {
        this.progress = 1;
        this.lastProgress = 1;
        this.update();
    }

    fakeProgressUpdate() {
        if (!this.enableFakeProgress) {
            return;
        }
        if (Math.random() < 0.95) {
            return;
        }
        this.progressWasLastUpdatedAt = Date.now();
        const progressIncrease = Math.atan((1 - this.progress) / 500) / (Math.PI / 8);
        this.progress = Math.max(this.progress, Math.min(maxFakeProgress, this.progress + progressIncrease));
    }

    update() {
        if (this.progressWasLastUpdatedAt && this.progressWasLastUpdatedAt + minUpdateTime * 1000 < Date.now()) {
            this.fakeProgressUpdate();
        }
        const easeMultiplier = 15;
        const easedProgress = ((this.lastProgress || 0) * easeMultiplier + this.progress) / (easeMultiplier + 1);
        this.bar.style.transform = `scale3d(${easedProgress.toFixed(2)}, 1, 1)`;
        const percParts = (easedProgress * 100).toFixed(1).split('.');
        this.loadingTextBig.innerHTML = percParts[0];
        this.loadingTextSmall.innerHTML = `.${percParts[1]}`;
        if (easedProgress > 0.999) {
            return this.destroy();
        }
        this.lastProgress = easedProgress;
        requestAnimationFrame(this.update.bind(this));
    }
}

export default LoadingBar;