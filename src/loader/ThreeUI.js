import * as THREE from 'three';

import anchors from './anchors';
import BitmapText from './BitmapText';
import Rectangle from './Rectangle';
import Sprite from './Sprite';
import Text from './Text';

const dirtyProperties = ['x', 'y', 'width', 'height', 'rotation', 'alpha', 'visible', 'pivot', 'anchor', 'smoothing', 'stretch', 'offset', 'text', 'scale', 'parent', 'textAlign', 'assetPath', 'color', 'left', 'right', 'up', 'down'];

const observeDirtyProperties = function observeDirtyProperties(object, ui) {
    dirtyProperties.forEach(prop => {
        const proxyKey = `_proxied_${prop}`;
        object[proxyKey] = object[prop];
        Object.defineProperty(object, prop, {
            set: function set(value) {
                if (object[prop] !== value) {
                    ui.shouldReDraw = true;
                }
                object[proxyKey] = value;
            },
            get: function get() {
                return object[proxyKey];
            }
        });
    });
};

class ThreeUI {
    displayObjects = [];
    eventListeners = {
        click: []
    };
    clearRect = null;
    shouldReDraw = true;
    constructor(gameCanvas, height, renderOnQuad, resolution) {
        
      
        this.gameCanvas = gameCanvas;
        this.canvas = document.createElement('canvas');
        this.height = height || 720;
        this.context = this.canvas.getContext('2d');
        this.renderOnQuad = renderOnQuad || false;
        this.resolution = resolution || 1;
        if (this.renderOnQuad) {
            this.prepareThreeJSScene();
        } else {
            this.addCanvasToDom();
        }
        this.resize();
        if (!window.mouseDisabled) {
            window.addEventListener('touchend', this.clickHandler.bind(this));
            if (isFirefox) {
                window.addEventListener('click', this.clickHandler.bind(this));
            } else {
                window.addEventListener('mousedown', this.clickHandler.bind(this));
            }
        }
    }

    addCanvasToDom() {
        this.gameCanvas.parentNode.appendChild(this.canvas);
        if (!['relative', 'absolute', 'fixed'].includes(this.gameCanvas.style.position)) {
            this.gameCanvas.style.position = 'relative';
        }
        this.canvas.style.position = 'absolute';
        this.canvas.style.left = 0;
        this.canvas.style.top = 0;
        this.canvas.style.zIndex = 1;
        this.canvas.style.transformOrigin = '0% 0%';
        this.canvas.style.perspective = '1000px';
    }

    prepareThreeJSScene() {
        this.camera = new THREE.OrthographicCamera(-this.canvas.width / 2, this.canvas.width / 2, this.canvas.height / 2, -this.canvas.height / 2, 0, 30);
        this.scene = new THREE.Scene();
        this.texture = new THREE.Texture(this.canvas);
        const material = new THREE.MeshBasicMaterial({
            map: this.texture
        });
        material.transparent = true;
        const planeGeo = new THREE.PlaneGeometry(this.canvas.width, this.canvas.height);
        this.plane = new THREE.Mesh(planeGeo, material);
        this.plane.matrixAutoUpdate = false;
        this.scene.add(this.plane);
    }

    resize() {
        const gameCanvasAspect = this.gameCanvas.width / this.gameCanvas.height;
        this.width = this.height * gameCanvasAspect;
        this.canvas.width = this.width * this.resolution;
        this.canvas.height = this.height * this.resolution;
        const containerWidth = this.gameCanvas.parentNode.getBoundingClientRect().width;
        this.canvas.style.transform = `scale(${containerWidth / this.width / this.resolution})`;
        this.shouldReDraw = true;
    }

    hideAll() {
        this.displayObjects.forEach(object => {
            if (typeof object === 'undefined') {
                return;
            }
            if (!object.parent) {
                object.visible = false;
            }
        });
    }

    draw() {
        
        if (!this.shouldReDraw) {
            return;
        }
        if (this.clearRect) {
            this.context.clearRect(this.clearRect.x, this.clearRect.y, this.clearRect.width, this.clearRect.height);
        } else {
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
        const self = this;
        const length = this.displayObjects.length;
        for (let i = 0; i < length; i++) {
            const object = this.displayObjects[i];
            if (object) {
                object.render(self.context, this.resolution);
            }
        }
        if (this.renderOnQuad) {
            this.texture.needsUpdate = true;
        }
        this.shouldReDraw = false;
    }

    render(renderer) {
        this.draw();
        if (this.renderOnQuad) {
            renderer.render(this.scene, this.camera);
        }
        if (this.colorReplace) {
            this.context.save();
            this.context.fillStyle = this.colorReplace;
            this.context.globalCompositeOperation = 'source-atop';
            this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.context.restore();
        }
    }

    createSprite(imagePath, x, y, width, height) {
        const displayObject = new Sprite(this, imagePath, x, y, width, height);
        this.displayObjects.push(displayObject);
        observeDirtyProperties(displayObject, this);
        return displayObject;
    }

    createSpriteFromSheet(imagePath, sheetImagePath, sheetDataPath, x, y, width, height) {
        const displayObject = new Sprite(this, imagePath, x, y, width, height, sheetImagePath, sheetDataPath);
        this.displayObjects.push(displayObject);
        observeDirtyProperties(displayObject, this);
        return displayObject;
    }

    createRectangle(color, x, y, width, height) {
        const displayObject = new Rectangle(this, color, x, y, width, height);
        this.displayObjects.push(displayObject);
        observeDirtyProperties(displayObject, this);
        return displayObject;
    }

    createText(text, font, color, x, y) {
        const displayObject = new Text(this, text, font, color, x, y);
        this.displayObjects.push(displayObject);
        observeDirtyProperties(displayObject, this);
        return displayObject;
    }

    createBitmapText(text, size, x, y, sheetImagePath, sheetDataPath) {
        const displayObject = new BitmapText(this, text, size, x, y, sheetImagePath, sheetDataPath);
        this.displayObjects.push(displayObject);
        observeDirtyProperties(displayObject, this);
        return displayObject;
    }

    addEventListener(type, _callback, displayObject) {
        this.eventListeners[type].push({
            callback: function callback() {
                _callback(displayObject);
            },
            displayObject
        });
    }

    removeEventListeners(type, displayObject) {
        this.eventListeners[type].forEach((listener, idx) => {
            if (listener.displayObject === displayObject) {
                this.eventListeners[type].splice(idx, 1);
            }
        });
    }

    clickHandler(event) {
        let coords = null;
        if (typeof TouchEvent !== 'undefined' && event instanceof TouchEvent) {
            this.listeningToTouchEvents = true;
            if (event.touches.length > 0) {
                coords = {
                    x: event.touches[0].pageX,
                    y: event.touches[0].pageY
                };
            } else if (event.pageX && event.pageY) {
                coords = {
                    x: event.pageX,
                    y: event.pageY
                };
            } else {
                this.listeningToTouchEvents = false;
            }
        } else {
            coords = {
                x: event.pageX,
                y: event.pageY
            };
        }
        if (this.listeningToTouchEvents && event instanceof MouseEvent || coords === null) {
            return;
        }
        coords = this.windowToUISpace(coords.x, coords.y);
        const callbackQueue = [];
        this.eventListeners.click.forEach(listener => {
            const displayObject = listener.displayObject;
            if (!displayObject.shouldReceiveEvents()) {
                return;
            }
            const bounds = displayObject.getBounds();
            if (ThreeUI.isInBoundingBox(coords.x, coords.y, bounds.x, bounds.y, bounds.width, bounds.height)) {
                callbackQueue.push(listener.callback);
            }
        });
        callbackQueue.forEach(callback => {
            callback();
        });
    }

    windowToUISpace(x, y) {
        const bounds = this.gameCanvas.getBoundingClientRect();
        const scale = this.height / bounds.height;
        return {
            x: (x - bounds.left) * scale,
            y: (y - bounds.top) * scale
        };
    }

    getScale() {
        const bounds = this.gameCanvas.getBoundingClientRect();
        return this.height / bounds.height;
    }

    MoveToFront(UIElement) {
        const elIdx = this.displayObjects.indexOf(UIElement);
        if (elIdx !== -1) {
            this.displayObjects.splice(this.displayObjects.indexOf(UIElement), 1);
        }
        this.displayObjects.push(UIElement);
    }

    MoveToBack(UIElement) {
        const elIdx = this.displayObjects.indexOf(UIElement);
        if (elIdx !== -1) {
            this.displayObjects.splice(this.displayObjects.indexOf(UIElement), 1);
        }
        this.displayObjects.unshift(UIElement);
    }

    delete(displayObject) {
        const idx = this.displayObjects.indexOf(displayObject);
        if (idx > -1) {
            this.displayObjects.splice(idx, 1);
        }
    }

    getVisibilityState() {
        const state = {};
        this.displayObjects.forEach(object => {
            if (typeof object === 'undefined') {
                return;
            }
            if (object.parent) {
                return;
            }
            if (object.visible) {
                state[object.uuid] = true;
            }
        });
        return state;
    }

    setVisibilityState(state) {
        if (!state) {
            return;
        }
        this.displayObjects.forEach(object => {
            if (typeof object === 'undefined') {
                return;
            }
            if (object.parent) {
                return;
            }
            if (state[object.uuid]) {
                object.visible = true;
            } else {
                object.visible = false;
            }
        });
        this.shouldReDraw = true;
    }
}

ThreeUI.anchors = anchors.default;
ThreeUI.isInBoundingBox = (x, y, boundX, boundY, boundWidth, boundHeight) => x >= boundX && x <= boundX + boundWidth && y >= boundY && y <= boundY + boundHeight;
export default ThreeUI;