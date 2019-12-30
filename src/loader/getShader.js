import * as THREE from 'three';

let shader = void 0;

export default function getShader() {
    if (!shader) {
        shader = {
            uniforms: {
                "fillLight": {
                    value: new THREE.Vector3(0, 1, 2)
                },
                "fillLightColor": {
                    value: new THREE.Color(0.5, 0.5, 0.5)
                },
                "dirLight": {
                    value: new THREE.Vector3(-1, 1, 1)
                },
                "dirLightColor": {
                    value: new THREE.Color(0.5, 0.5, 0.5)
                },
                "ambientLightColor": {
                    value: new THREE.Color(0.5, 0.5, 0.7)
                },
                "saturation": {
                    value: 1.0
                },
                "_Brightness": {
                    value: 0.8
                },
                "transparency": {
                    value: 1
                },
                "GREY_COLOR": {
                    value: new THREE.Vector3(.222, .707, .071)
                }
            },
            vertexShader: [
                "uniform vec3 fillLight;",
                "uniform vec3 dirLight;",
                "uniform vec3 fillLightColor;",
                "uniform vec3 dirLightColor;", "uniform vec3 ambientLightColor;", "uniform float saturation;", "uniform float _Brightness;", "uniform vec3 GREY_COLOR;", "#include <shadowmap_pars_vertex>", "varying vec4 vColor;", "varying vec3 vWorldPosition;", "void main() {", "mat4 mvp = projectionMatrix * viewMatrix * modelMatrix;", "vec4 worldPosition = modelMatrix * vec4(position, 1.0);", "#include <shadowmap_vertex>", "gl_Position = mvp * vec4( position, 1.0 );", "vec3 objectColor = vec3(color.rgb);", "vec3 worldNormal = normalize(normalMatrix * normal);", "objectColor *= (clamp(dot(normalize(fillLight), worldNormal), 0.0, 1.0) * fillLightColor) + (clamp(dot(dirLight, worldNormal), 0.0, 1.0) * dirLightColor) + ambientLightColor;", "float grey = dot(objectColor, GREY_COLOR);", "vec3 ds = vec3(grey, grey, grey);", "vColor = vec4(mix(ds, objectColor, saturation) * _Brightness, 1);", "}"
            ].join("\n"),
            fragmentShader: ["varying vec4 vColor;", "uniform float transparency;", "#include <common>", "#include <packing>", "#include <fog_pars_fragment>", "#include <bsdfs>", "#include <lights_pars_begin>", "#include <shadowmap_pars_fragment>", "#include <shadowmask_pars_fragment>", "void main() {", "float sm = ( 1.0  - ( 1.0 - getShadowMask() ) * 0.3 );", "gl_FragColor = vColor*sm;", "gl_FragColor.a = transparency;", "}"].join("\n")
        };
    }
    return shader;
};
