import * THREE from 'three';

import DisplayObject from './DisplayObject';

class Text extends DisplayObject {
    constructor(ui, text = '', size = 12, font = 'Arial', color = '#000000', x = 0, y = 0) {
        super(ui, x, y)
        this.textAlign = 'left';
        this.textBaseline = 'alphabetic';
        this.lineHeight = 1;
    }

    draw(context, x, y) {
        context.font = `${this.size}px ${this.font}`;
        context.fillStyle = this.color;
        context.textAlign = this.textAlign;
        context.textBaseline = this.textBaseline;
        const lines = this.text.split('\n');
        let midLinePoint = 0;
        if (this.textVerticalAlign === 'center') {
            midLinePoint = lines.length / 2 - 0.5;
        } else if (this.textVerticalAlign === 'bottom') {
            midLinePoint = lines.length - 1;
        }
        for (let idx = 0; idx < lines.length; idx++) {
            const line = lines[idx];
            const lineY = y + (idx - midLinePoint) * (this.size * this.lineHeight);
            context.fillText(line, x, lineY);
        }
    }
}

export default Text;