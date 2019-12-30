import anchors from './anchors'
import * THREE from 'three';

class DisplayObject {
    rotation = 0;
    alpha = 1;
    visible = true;
    pivot = {
        x: 0.5,
        y: 0.5
    };

    constructor(ui, x, y, width, height) {
        this.uuid = [performance.now(), Math.random()].join('-');
        this.ui = ui;
        this.x = typeof x !== 'undefined' ? x : 0;
        this.y = typeof y !== 'undefined' ? y : 0;
        this.width = typeof width !== 'undefined' ? width : 0;
        this.height = typeof height !== 'undefined' ? height : 0;

        this.anchor = {
            x: anchors.left,
            y: anchors.top
        };
        this.smoothing = false;
        this.stretch = {
            x: false,
            y: false
        };
        this.offset = {
            left: 0,
            top: 0,
            right: 0,
            bottom: 0
        };
        this.parent = undefined;
        this.forceEventsWhenVisible = true;
        this.eventHandlers = [];
        this.disabled = false;
    }

    getBounds() {
        const position = this.determinePositionInCanvas();
        const dimensions = this.determineDimensionsInCanvas();
        return {
            x: position.x,
            y: position.y,
            width: dimensions.width,
            height: dimensions.height
        };
    }

    getParentBounds() {
        if (typeof this.parent === 'undefined') {
            return {
                x: 0,
                y: 0,
                width: this.ui.width,
                height: this.ui.height
            };
        } else if (this.parent instanceof DisplayObject) {
            return this.parent.getBounds();
        } else {
            throw new Error('DisplayObject.parent should always be an instance of DisplayObject');
        }
    }

    determinePositionInCanvas() {
        let position = {
            x: typeof this.x === 'number' ? this.x : 0,
            y: typeof this.y === 'number' ? this.y : 0
        };
        if (this.stretch.x || this.stretch.y) {
            const parentBounds = this.getParentBounds();
            const offset = this.getOffsetInCanvas();
            if (this.stretch.x) {
                position.x = parentBounds.x + offset.left;
            }
            if (this.stretch.y) {
                position.y = parentBounds.y + offset.top;
            }
        }
        position = this.adjustPositionForAnchor(position.x, position.y);
        position = this.adjustPositionForPivot(position.x, position.y);
        return position;
    }

    determineDimensionsInCanvas() {
        const dimensions = {
            width: typeof this.width === 'number' ? this.width : 0,
            height: typeof this.height === 'number' ? this.height : 0
        };
        if (this.stretch.x || this.stretch.y) {
            const parentBounds = this.getParentBounds();
            const offset = this.getOffsetInCanvas();
            if (this.stretch.x) {
                dimensions.width = parentBounds.width - offset.left - offset.right;
            }
            if (this.stretch.y) {
                dimensions.height = parentBounds.height - offset.top - offset.bottom;
            }
        } else {
            dimensions.width *= 1;
            dimensions.height *= 1;
        }
        return dimensions;
    }

    adjustPositionForAnchor(x, y) {
        const parentBounds = this.getParentBounds();
        if (!this.stretch.x) {
            if (this.anchor.x === anchors.left) {
                x = parentBounds.x + x;
            } else if (this.anchor.x === anchors.right) {
                x = parentBounds.x + parentBounds.width - x;
            } else if (this.anchor.x === anchors.center) {
                x = parentBounds.x + parentBounds.width * .5 + x;
            }
        }
        if (!this.stretch.y) {
            if (this.anchor.y === anchors.top) {
                y = parentBounds.y + y;
            } else if (this.anchor.y === anchors.bottom) {
                y = parentBounds.y + parentBounds.height - y;
            } else if (this.anchor.y === anchors.center) {
                y = parentBounds.y + parentBounds.height * .5 + y;
            }
        }
        return {
            x,
            y
        };
    }

    getOffsetInCanvas() {
        
        const offset = {
            left: this.offset.left,
            top: this.offset.top,
            right: this.offset.right,
            bottom: this.offset.bottom
        };
        let parentBounds;
        const keys = Object.keys(offset);
        const length = keys.length;
        for (let i = 0; i < length; i++) {
            const key = keys[i];
            const value = offset[key];
            if (typeof value !== 'number') {
                parentBounds = parentBounds || this.getParentBounds();
                const percValue = parseFloat(value.match(/^([0-9\.]+)%$/)[1]);
                offset[key] = percValue / 100 * parentBounds.width;
            }
        }
        return offset;
    }

    adjustPositionForPivot(x, y) {
        x = x - this.width * 1 * this.pivot.x;
        y = y - this.height * 1 * this.pivot.y;
        return {
            x,
            y
        };
    }

    shouldReceiveEvents() {
        return this.visible && (this.alpha > 0 || this.forceEventsWhenVisible);
    }

    onClick(callback) {
        this.eventHandlers['click'] = this.eventHandlers['click'] || [];
        this.eventHandlers['click'].push(callback);
        this.ui.addEventListener('click', () => {
            if (this.ui.disableInput) {
                return;
            }
            if (this.disabled) {
                return;
            }
            callback();
        }, this);
    }

    fireEvent(type) {
        (this.eventHandlers[type] || []).forEach(handler => {
            handler();
        });
    }

    removeEventListeners(type) {
        this.eventHandlers[type] = [];
        this.ui.removeEventListeners(type, this);
    }

    render(context, resolution) {
        if (!this.visible || this.alpha === 0) {
            return;
        }
        resolution = resolution || 1;
        context.save();
        const bounds = this.getBounds();
        if (this.rotation) {
            const radians = Math.PI / 180 * this.rotation;
            const pivotAdjustment = this.adjustPositionForPivot(0, 0);
            const moveX = bounds.x - pivotAdjustment.x;
            const moveY = bounds.y - pivotAdjustment.y;
            context.translate(moveX, moveY);
            context.rotate(radians);
            context.translate(-moveX, -moveY);
        }
        context.globalAlpha = this.alpha;
        if (typeof context['mozImageSmoothingEnabled'] !== 'undefined') {
            context['mozImageSmoothingEnabled'] = this.smoothing;
        }
        if (typeof context['webkitImageSmoothingEnabled'] !== 'undefined') {
            context['webkitImageSmoothingEnabled'] = this.smoothing;
        }
        if (typeof context['msImageSmoothingEnabled'] !== 'undefined') {
            context['msImageSmoothingEnabled'] = this.smoothing;
        }
        if (typeof context['imageSmoothingEnabled'] !== 'undefined') {
            context['imageSmoothingEnabled'] = this.smoothing;
        }
        this.draw(context, bounds.x * resolution, bounds.y * resolution, bounds.width * resolution, bounds.height * resolution);
        context.restore();
    }

    get _proxied_visible() {
        if (this.parent && this.parent !== this && !this.parent.visible) {
            return false;
        } else {
            return this._visible;
        }
    }

    set _proxied_visible(toggle) {
        return this._visible = toggle;
    }
}

DisplayObject.draw = (context, x, y, width, height) => { };
export default DisplayObject;