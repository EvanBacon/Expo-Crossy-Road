import * THREE from 'three';


const Utils = {};
Utils.getQueryVariable = variable => {
    const query = window.location.search.substring(1);
    const vars = query.split("&");
    for (let i = 0; i < vars.length; i++) {
        const pair = vars[i].split("=");
        if (pair[0] == variable) {
            return pair[1];
        }
    }
    return false;
};
Utils.getHiddenProp = () => {
    const prefixes = ['webkit', 'moz', 'ms', 'o'];
    if ('hidden' in document) {
        return 'hidden';
    }
    for (let i = 0; i < prefixes.length; i++) {
        if (`${prefixes[i]}Hidden` in document) {
            return `${prefixes[i]}Hidden`;
        }
    }
    return null;
};
Utils.isHidden = () => {
    const prop = Utils.getHiddenProp();
    if (!prop) {
        return false;
    }
    return document[prop];
};
Utils.hslToRgb = (h, s, l) => {
    let r;
    let g;
    let b;
    if (s == 0) {
        r = g = b = l;
    } else {
        const hue2rgb = function hue2rgb(p, q, t) {
            if (t < 0) {
                t += 1;
            }
            if (t > 1) {
                t -= 1;
            }
            if (t < 1 / 6) {
                return p + (q - p) * 6 * t;
            }
            if (t < 1 / 2) {
                return q;
            }
            if (t < 2 / 3) {
                return p + (q - p) * (2 / 3 - t) * 6;
            }
            return p;
        };
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
};
Utils.getRandomArbitrary = (min, max) => Math.random() * (max - min) + min;
Utils.inverseLerp = (a, b, x) => (x - a) / (b - a);
Utils.getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
Utils.getRandomFromArray = array => array[Math.floor(Math.random() * array.length)];
Utils.normalize = (val, min, max) => (val - min) / (max - min);
Utils.extractDomainFromURL = url => {
    let domain = null;
    try {
        domain = url ? url.match(/^(?:https?:\/\/)?(?:[^@/\n]+@)?(?:www\.)?([^:/\n]+)/im)[1] : null;
    } catch (e) { }
    return domain;
};
export default Utils;