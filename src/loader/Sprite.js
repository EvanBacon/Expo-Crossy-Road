import * THREE from 'three';

import * as AssetLoader from './AssetLoader';
import DisplayObject from './DisplayObject'

class Sprite extends DisplayObject {
    constructor(ui, assetPath, x = 0, y = 0, width = null, height = null, sheetImagePath, sheetDataPath) {
        x = typeof x !== 'undefined' ? x : 0;
        y = typeof y !== 'undefined' ? y : 0;
        width = typeof width !== 'undefined' ? width : null;
        height = typeof height !== 'undefined' ? height : null;
        super(ui, x, y, width, height);
        this.setAssetPath(assetPath, sheetImagePath, sheetDataPath);
        if (this.asset) {
            width = width !== null ? width : this.asset.width;
            height = height !== null ? height : this.asset.height;
        } else if (this.sheet && this.sheetImageData) {
            width = width !== null ? width : this.sheetImageData['frame']['w'];
            height = height !== null ? height : this.sheetImageData['frame']['h'];
        }
    }

    draw(context, x, y, width, height) {
        if (this.sheet && this.sheetImageData) {
            context.drawImage(this.sheet, this.sheetImageData['frame']['x'], this.sheetImageData['frame']['y'], this.sheetImageData['frame']['w'], this.sheetImageData['frame']['h'], x, y, width, height);
        } else {
            context.drawImage(this.asset, x, y, width, height);
        }
    }

    setAssetPath(assetPath, sheetImagePath, sheetDataPath) {
        this.assetPath = assetPath;
        if (typeof sheetImagePath === 'undefined' && !this.sheet) {
            this.asset = AssetLoader.getAssetById(assetPath);
            this.sheet = null;
        } else {
            this.asset = null;
            this.parseSheet(assetPath, sheetImagePath, sheetDataPath);
        }
    }

    parseSheet(assetPath, sheetImagePath, sheetDataPath) {
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
        } else if (!this.sheetData['frames']) {
            throw new Error(`Invalid sheet data ${sheetDataPath} -- does not have frames`);
        }
        let data;
        this.sheetData['frames'].forEach(frame => {
            if (frame['filename'] === assetPath) {
                data = frame;
            }
        });
        if (!data) {
            throw new Error(`Asset "${assetPath}" does not exist in sheet "${sheetDataPath}"`);
        }
        this.sheetImageData = data;
    }
}

export default Sprite;