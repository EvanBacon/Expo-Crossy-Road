import { TextureLoader } from 'expo-three';
import * THREE from 'three';

let spaceBackgroundShader = void 0;
const getSpaceBackgroundShader = function getSpaceBackgroundShader() {
    if (!spaceBackgroundShader) {
        spaceBackgroundShader = {
            uniforms: {
                "cloudText": {
                    type: "t",
                    value: new TextureLoader().load("sprites/SpaceStarfieldGasClouds.png")
                },
                "starText": {
                    type: "t",
                    value: new TextureLoader().load("sprites/SpaceStarfieldRGB.png")
                },
                "time": {
                    type: "f",
                    value: 1.0
                }
            },
            vertexShader: ["varying vec4 vColor;", "varying vec4 vWorldPosition;", "varying vec3 vWorldNormal;", "varying vec2 vUV;", "void main() {", "vUV = uv;", "gl_Position = vec4(position, 1.0);", "}"].join("\n"),
            fragmentShader: ["varying vec4 vColor;", "varying vec4 vWorldPosition;", "varying vec3 vWorldNormal;", "varying vec2 vUV;", "uniform sampler2D cloudText;", "uniform sampler2D starText;", "uniform float time;", "float lerp(float from, float to, float k)", "{", "return from + (to - from) * k;", "}", "float powerLerp(float value, float modifier)", "{", "value = lerp(0.0, 1.0, pow(abs(value), sin(time / 400.0) * modifier + 2.0));", "return value;", "}", "float twinkleStars(float starMap, float twinkle)", "{", "twinkle *= starMap;", "twinkle = powerLerp(twinkle, 0.85);", "return twinkle;", "}", "void main() {", "vec4 starColor = vec4(0.91, 0.98, 1.0, 1.0);", "vec4 backgroundColor1 = vec4(0.0, 0.00, 0.0, 0.8);", "vec4 backgroundColor2 = vec4(0.0, 0.0, 0.0, 0.8);", "vec4 cloudColor1 = vec4(0.16, 0.08, 0.27, 0.8);", "vec4 cloudColor2 = vec4(1.0, 1.0, 1.0, 0.8);", "vec4 cloudT = texture2D(cloudText, vUV);", "vec4 t = texture2D(starText, vUV);", "float twinkle1 = lerp(0.0, t.b, 1.0 - pow(pow(abs(cos(time + 0.0)) / 800.0, 2.0), 2.0));", "float twinkle2 = lerp(0.0, t.g, 1.0 - pow(pow(abs(cos(time + 1.0)) / 900.0, 2.0), 2.0));", "float twinkle3 = lerp(0.0, t.a, 1.0 - pow(pow(abs(cos(time + 2.0)) / 1000.0, 2.0), 2.0));", "float stars = t.r;", "stars = powerLerp(stars, 0.35) * 0.2;", "stars += twinkleStars(t.r, twinkle1);", "stars += twinkleStars(t.r, twinkle2);", "stars += twinkleStars(t.r, twinkle3);", "vec3 starCol = vec3(stars * starColor.x, stars * starColor.y, stars * starColor.z);", "vec3 bgCol;", "bgCol.r = lerp(backgroundColor1.r, backgroundColor2.r, clamp((vUV.y - 1.4) * 3.5, 0.0, 1.0));", "bgCol.g = lerp(backgroundColor1.g, backgroundColor2.g, clamp((vUV.y - 1.4) * 3.5, 0.0, 1.0));", "bgCol.b = lerp(backgroundColor1.b, backgroundColor2.b, clamp((vUV.y - 1.4) * 3.5, 0.0, 1.0));", "vec3 cloudCol;", "cloudCol.r = lerp(cloudColor1.r, cloudColor2.r, cloudT.r) * pow(abs(cloudT.a), 0.75);", "cloudCol.g = lerp(cloudColor1.g, cloudColor2.g, cloudT.r) * pow(abs(cloudT.a), 0.75);", "cloudCol.b = lerp(cloudColor1.b, cloudColor2.b, cloudT.r) * pow(abs(cloudT.a), 0.75);", "vec3 finalCol = (bgCol + starCol) + cloudCol;", "gl_FragColor = vec4(finalCol, 1.0);", "}"].join("\n")
        };
    }
    return spaceBackgroundShader;
};
export default getSpaceBackgroundShader;