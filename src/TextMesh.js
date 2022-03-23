//https://stackoverflow.com/questions/15248872/dynamically-create-2d-text-in-three-js
import { FontLoader, Mesh, MeshPhongMaterial, TextGeometry } from "three";

/*
let mesh = new TextMesh('Harambe', {
size: 50,
height: 10,
curveSegments: 12,

bevelThickness: 1,
bevelSize: 1,
bevelEnabled: true

});
*/
export default class TextMesh {
  _options = {};
  _text;
  set text(str) {
    if (this._text === str) {
      return;
    }
    this._text = str;
    // this._updateMesh();
  }

  set options(props) {
    this._options = props;
    // this._updateMesh();
  }

  _updateMesh = (fontPath) => {
    return new Promise((res, rej) => {
      const parseFont = (font) => {
        console.log("Font Loaded", font);
        let textGeometry = new TextGeometry(this._text, this._options);
        let textMaterial = new MeshPhongMaterial({
          color: 0xff0000,
          specular: 0xffffff,
        });

        if (!this._mesh) {
          this._mesh = new Mesh(textGeometry, textMaterial);
        } else {
          this._mesh.geometry = text;
          this._mesh.geometry.needsUpdate = true;
        }
        res(this._mesh);
        return this._mesh;
      };

      const loader = new FontLoader();
      console.warn("loader", FontLoader.load, JSON.stringify(loader));
      loader.load(fontPath, parseFont).catch(rej);
    });

    //
    // // Example text options : {'font' : 'helvetiker','weight' : 'normal', 'style' : 'normal','size' : 100,'curveSegments' : 300};
    // var textShapes = FontUtils.generateShapes( text, this._options );
    // var text = new ShapeGeometry( textShapes );
    //
  };

  constructor(text, options) {
    this._text = text || "";
    this._options = options || {};
    // this._updateMesh();
  }
}
