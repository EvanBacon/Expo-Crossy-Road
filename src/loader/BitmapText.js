import * as AssetLoader from './AssetLoader';
import DisplayObject from './DisplayObject';
import * THREE from 'three';

const fallbackWidth = 6;
const fallbackHeight = 6;

class BitmapText extends DisplayObject {
    constructor(ui, text, scale, x, y, sheetImagePath, sheetDataPath) {
        x = typeof x !== 'undefined' ? x : 0;
        y = typeof y !== 'undefined' ? y : 0;
        super(ui, x, y, dimensions.width, dimensions.height);
        this.scale = typeof scale !== 'undefined' ? scale : 1;
        this.parseSheet(sheetImagePath, sheetDataPath);
        this.setText(text);
        const dimensions = this.calculateDimensions();
        this.pivot.x = 0;
        this.pivot.y = 0;
    }

    setText(text) {
        if (this.text === text) {
            return;
        }
        this.text = typeof text !== 'undefined' ? text.toString() : '';
        this.characters = this.text.split('');
        const dimensions = this.calculateDimensions();
        this.width = dimensions.width;
        this.height = dimensions.height;
    }

    setScale(scale) {
        if (this.scale === scale) {
            return;
        }
        this.scale = scale;
        const dimensions = this.calculateDimensions();
        this.width = dimensions.width;
        this.height = dimensions.height;
    }

    parseSheet(sheetImagePath, sheetDataPath) {
        
        if (typeof sheetImagePath === 'undefined' && !this.sheet) {
            throw new Error('Sheet image path missing when creating sprite from sheet');
        }
        if (typeof sheetDataPath === 'undefined' && !this.sheetData) {
            throw new Error('Sheet data path missing when creating sprite from sheet');
        }
        if (sheetImagePath || !this.sheet) {
            this.sheet = AssetLoader.getAssetById(sheetImagePath);
        }
        if (sheetDataPath || !this.sheetData) {
            this.sheetData = AssetLoader.getAssetById(sheetDataPath);
        }
        if (typeof this.sheetData !== 'object') {
            throw new Error(`Invalid sheet data ${sheetDataPath} -- not an object`);
        }
        this.characterData = {};
        const keys = Object.keys(this.sheetData);
        const length = keys.length;
        for (let i = 0; i < length; i++) {
            const char = keys[i];
            const data = this.sheetData[char];
            data['uv0'][0] = Math.min(1, Math.max(0, data['uv0'][0]));
            data['uv0'][1] = Math.min(1, Math.max(0, data['uv0'][1]));
            data['uv1'][0] = Math.min(1, Math.max(0, data['uv1'][0]));
            data['uv1'][1] = Math.min(1, Math.max(0, data['uv1'][1]));
            this.characterData[char] = {
                x: Math.round(data['uv0'][0] * this.sheet.width),
                y: Math.round((1 - data['uv0'][1]) * this.sheet.height),
                width: Math.round((data['uv1'][0] - data['uv0'][0]) * this.sheet.width),
                height: Math.round((data['uv0'][1] - data['uv1'][1]) * this.sheet.height)
            };
            const cData = this.characterData[char];
            cData.width = Math.max(0.00001, cData.width);
            cData.height = Math.max(0.00001, cData.height);
        }
    }

    calculateDimensions() {
        
        const dimensions = {
            width: 0,
            height: 0
        };
        const length = this.characters.length;
        for (let i = 0; i < length; i++) {
            let character = this.characters[i];
            if (!this.characterData[character]) {
                character = Object.keys(this.characterData)[0];
            }
            const data = this.characterData[character];
            dimensions.width += data ? data.width : 0;
            dimensions.height = Math.max(dimensions.height, data ? data.height : 0);
        }
        dimensions.width *= this.scale;
        dimensions.height *= this.scale;
        return dimensions;
    }

    draw(context, x, y) {
        
        const length = this.characters.length;
        for (let i = 0; i < length; i++) {
            const character = this.characters[i];
            const bounds = this.drawCharacter(context, character, x, y);
            x = bounds.x + bounds.width;
            y = bounds.y;
        }
    }

    drawCharacter(context, character, x, y) {
        let data = this.characterData[character];
        let skipDraw = false;
        if (typeof data === 'undefined') {
            data = {
                width: fallbackWidth,
                height: fallbackHeight
            };
            skipDraw = true;
        }
        const width = data.width * this.scale * this.ui.resolution;
        const height = data.height * this.scale * this.ui.resolution;
        if (!skipDraw) {
            context.drawImage(this.sheet, data.x, data.y, data.width, data.height, x, y, width, height);
        }
        return {
            x,
            y,
            width,
            height
        };
    }
}

export default BitmapText;