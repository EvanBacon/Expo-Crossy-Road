const isIE11 = !!window.MSInputMethodContext && !!document.documentMode;
import * THREE from 'three';

export let assetProgress = {};
export let loadedAssets = {};
export let queue = [];
export let queueIdx = 0;
export let loader = {};
export let maxConcurrency = Infinity;
export let assetsLoading = [];
export let lastRequestedWorld = null;
export let lastRequestedCharacters = null;
export let load = callback => {
    asyncQueue(queue, () => {
        queue = [];
        assetProgress = {};
        progressListeners.forEach(callback => callback(1));
        if (typeof callback === 'function') {
            callback();
        }
    });
};
export const loadAsync = () => {
    return new Promise((resolve) => {
        asyncQueue(queue, () => {
            queue = [];
            assetProgress = {};
            progressListeners.forEach(callback => callback(1));
            resolve();
        });
    })
};
export let worlds = {
    original_cast: {
        loaded: false,
        loading: false
    },
    space: {
        loaded: false,
        loading: false
    },
    common: {
        loaded: false,
        loading: false
    }
};
export let characters = {
    original_cast: {
        loaded: false,
        loading: false
    },
    space: {
        loaded: false,
        loading: false
    }
};
export const isWorldLoaded = world => {
    if (!world || !worlds[world]) {
        return false;
    }
    return worlds[world].loaded || worlds[world].loading;
};
export const areCharactersLoaded = world => {
    if (!world || !characters[world]) {
        return false;
    }
    return characters[world].loaded || characters[world].loading;
};
export const loadCharacters = (world, callback) => {
    add.json(`models/${world}-char.json`);
    characters[world].loading = true;
    load(callback);
};
export const loadCharactersAsync = (world, callback) => {
    add.json(`models/${world}-char.json`);
    characters[world].loading = true;
    return new Promise((resolve) => {
        load(resolve);
    })
};
export const queueNext = () => {
    queueIdx++;
};
export const doneLoading = (key, asset) => {
    loadedAssets[key] = asset;
    updateAssetProgress(key, 1, 1);
    assetsLoading.pop(key);
    console.log(`loaded: ${key}`);
    switch (key) {
        case 'models/original_cast-world.json':
            worlds.original_cast.loaded = true;
            break;
        case 'models/space-world.json':
            worlds.space.loaded = true;
            break;
        case 'models/common-world.json':
            worlds.common.loaded = true;
            break;
        case 'models/original_cast-char.json':
            characters.original_cast.loaded = true;
            break;
        case 'models/space-char.json':
            characters.space.loaded = true;
            break;
    }
};
export const push = func => {
    if (typeof queue[queueIdx] === 'undefined') {
        queue[queueIdx] = [];
    }
    queue[queueIdx].push(func);
};
export let progressListeners = [];
export const getProgress = () => {
    if (queue.length <= 0) {
        return 1;
    }
    let total = 0;
    Object.keys(assetProgress).forEach(asset => {
        total += assetProgress[asset];
    });
    let totalLoaders = 0;
    queue.forEach(({ length }) => {
        totalLoaders += length;
    });
    return total / totalLoaders;
};
export const updateAssetProgress = (asset, done, total) => {
    if (assetProgress[asset] === 1 || total < done || total <= 0) {
        return;
    }
    let progress = 1;
    if (typeof done !== 'undefined' && typeof total !== 'undefined') {
        progress = done / total;
    }
    assetProgress[asset] = progress;
    if (progressListeners.length > 0) {
        progressListeners.forEach(callback => callback(getProgress()));
    }
};
export const getAssetById = id => loadedAssets[id];
export const asyncQueue = (queue, callback) => {
    const workingQueue = queue.slice();
    const next = function next() {
        const collection = workingQueue.shift();
        asyncCollection(collection, () => {
            if (workingQueue.length > 0) {
                next();
            } else {
                callback();
            }
        });
    };
    next();
};
export const asyncCollection = (collection, callback) => {
    var collection = collection.slice();
    let numLoading = Math.min(maxConcurrency, collection.length);
    const loadAndContinue = function loadAndContinue(func) {
        func(() => {
            numLoading--;
            if (collection.length > 0) {
                numLoading++;
                loadAndContinue(collection.shift());
            } else if (numLoading === 0) {
                callback();
            }
        });
    };
    collection.splice(0, maxConcurrency).forEach(loadAndContinue);
};
export const add = asset => {
    const fileType = asset.split('.').pop();
    if (fileType === 'png') {
        add.image(asset);
    } else if (fileType === 'json') {
        add.json(asset);
    } else if (fileType === 'css') {
        add.css(asset);
    } else {
        throw new Error(`Unsupported file-type (${fileType}) passed to AssetLoader.add.`);
    }
};
add.image = asset => {
    assetsLoading.push(asset);
    push(done => {
        const img = new Image();
        img.onload = () => {
            doneLoading(asset, img);
            updateAssetProgress(asset, 1, 1);
            done();
        };
        img.crossOrigin = "Anonymous";
        img.src = asset;
    });
};
export const setupAudioLoader = () => {
    if (isIE11) {
        return;
    }
    audioLoader = audioLoader || new THREE.AudioLoader();
};
export const setupFontLoader = () => {
    fontLoader = fontLoader || new THREE.FontLoader();
};
add.audio = filename => {
    if (isIE11) {
        return;
    }
    setupAudioLoader();
    push(done => {
        audioLoader.load(filename, buffer => {
            doneLoading(filename, buffer);
            done();
        });
    });
};
add.threeFont = filename => {
    setupFontLoader();
    fontLoader.load(filename, font => {
        doneLoading(filename, font);
    });
};
add.plainAudio = asset => {
    if (isIE11) {
        return;
    }
    push(done => {
        const audio = new Audio(asset);
        doneLoading(asset, audio);
        done();
    });
};
add.spriteSheet = (image, json) => {
    add.image(image);
    add.json(json);
};
add.bitmapText = (image, json) => {
    add.image(image);
    add.json(json);
};
add.webFont = (fontFamily, css) => {
    add.css(css);
    const el = document.createElement('div');
    el.innerText = `Loading ${fontFamily}`;
    el.style.fontFamily = fontFamily;
    el.style.width = 0;
    el.style.height = 0;
    el.style.overflow = 'hidden';
    document.body.appendChild(el);
};
add.json = asset => {
    assetsLoading.push(asset);
    console.log(`LOADING ASSET JSON ${asset}`);
    push(done => {
        loadJSON(asset, response => {
            doneLoading(asset, response);
            done();
        });
    });
};
add.script = asset => {
    assetsLoading.push(asset);
    push(done => {
        loader.script(asset, () => {
            doneLoading(asset, asset);
            done();
        });
    });
};
loader.script = (asset, callback) => {
    const el = document.createElement('script');
    el.src = asset;
    el.onload = callback;
    document.head.appendChild(el);
};
add.css = asset => {
    assetsLoading.push(asset);
    push(done => {
        const el = document.createElement('link');
        el.type = 'text/css';
        el.rel = 'stylesheet';
        el.href = asset;
        el.onload = () => {
            doneLoading(asset, el);
            done();
        };
        document.head.appendChild(el);
    });
};
add.text = asset => {
    assetsLoading.push(asset);
    push(done => {
        loadJSON(asset, response => {
            doneLoading(asset, response);
            done();
        });
    });
};
export const loadGeneric = function loadGeneric(url, callback) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    if (url.includes('.zip')) {
        xhr.responseType = 'arraybuffer';
    }
    const readyCallback = function readyCallback() {
        if (xhr.readyState === 4) {
            callback(xhr.response || xhr.responseText);
            xhr.onload = null;
            xhr.onreadystatechange = null;
        }
    };
    xhr.onload = readyCallback;
    xhr.onreadystatechange = readyCallback;
    xhr.onprogress = ({ loaded, total }) => {
        updateAssetProgress(url, loaded, total);
    };
    xhr.onerror = error => {
        throw new Error(`Error during XHR: ${error}`);
    };
    xhr.send();
};



export async function receivedWorldSwitchAsync(world) {
    lastRequestedWorld = world;
    if (!isWorldLoaded(world)) {
        add.json(`models/${world}-world.json`);
        worlds[world].loading = true;
        await loadAsync();
        if (!areCharactersLoaded(world)) {
            await loadCharactersAsync(world)
        }
    } else if (!areCharactersLoaded(world)) {
        await loadCharactersAsync(world);
    }
}


const loadJSON = (url, callback) => {
    loadGeneric(url, response => {
        callback(JSON.parse(response));
    });
};