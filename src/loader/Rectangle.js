import DisplayObject from './DisplayObject';

class Rectangle extends DisplayObject {
    constructor(ui, color, x = 0, y = 0, width = 1, height = 1) {
        super(ui, x, y, width, height);
        this.color = color;
    }

    draw(context, x, y, width, height) {
        context.fillStyle = this.color;
        context.fillRect(x, y, width, height);
    }
}

export default Rectangle;