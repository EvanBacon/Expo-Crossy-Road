const isIE11 = !!window.MSInputMethodContext && !!document.documentMode;
const AssetLoader = {};
AssetLoader.assetProgress = {};
AssetLoader.loadedAssets = {};
AssetLoader.queue = [];
AssetLoader.queueIdx = 0;
AssetLoader.loader = {};
AssetLoader.maxConcurrency = Infinity;
AssetLoader.assetsLoading = [];
AssetLoader.lastRequestedWorld = null;
AssetLoader.lastRequestedCharacters = null;
AssetLoader.load = callback => {
    AssetLoader.asyncQueue(AssetLoader.queue, () => {
        AssetLoader.queue = [];
        AssetLoader.assetProgress = {};
        AssetLoader.progressListeners.forEach(callback => callback(1));
        if (typeof callback === 'function') {
            callback();
        }
    });
};
AssetLoader.worlds = {
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
AssetLoader.characters = {
    original_cast: {
        loaded: false,
        loading: false
    },
    space: {
        loaded: false,
        loading: false
    }
};
AssetLoader.isWorldLoaded = world => {
    if (!world || !AssetLoader.worlds[world]) {
        return false;
    }
    return AssetLoader.worlds[world].loaded || AssetLoader.worlds[world].loading;
};
AssetLoader.areCharactersLoaded = world => {
    if (!world || !AssetLoader.characters[world]) {
        return false;
    }
    return AssetLoader.characters[world].loaded || AssetLoader.characters[world].loading;
};
AssetLoader.loadCharacters = (world, callback) => {
    AssetLoader.add.json(`models/${world}-char.json`);
    AssetLoader.characters[world].loading = true;
    AssetLoader.load(callback);
};
AssetLoader.queueNext = () => {
    AssetLoader.queueIdx++;
};
AssetLoader.done = (key, asset) => {
    AssetLoader.loadedAssets[key] = asset;
    AssetLoader.updateAssetProgress(key, 1, 1);
    AssetLoader.assetsLoading.pop(key);
    console.log(`loaded: ${key}`);
    switch (key) {
        case 'models/original_cast-world.json':
            AssetLoader.worlds.original_cast.loaded = true;
            break;
        case 'models/space-world.json':
            AssetLoader.worlds.space.loaded = true;
            break;
        case 'models/common-world.json':
            AssetLoader.worlds.common.loaded = true;
            break;
        case 'models/original_cast-char.json':
            AssetLoader.characters.original_cast.loaded = true;
            break;
        case 'models/space-char.json':
            AssetLoader.characters.space.loaded = true;
            break;
    }
};
AssetLoader.push = func => {
    if (typeof AssetLoader.queue[AssetLoader.queueIdx] === 'undefined') {
        AssetLoader.queue[AssetLoader.queueIdx] = [];
    }
    AssetLoader.queue[AssetLoader.queueIdx].push(func);
};
AssetLoader.progressListeners = [];
AssetLoader.getProgress = () => {
    if (AssetLoader.queue.length <= 0) {
        return 1;
    }
    let total = 0;
    Object.keys(AssetLoader.assetProgress).forEach(asset => {
        total += AssetLoader.assetProgress[asset];
    });
    let totalLoaders = 0;
    AssetLoader.queue.forEach(({ length }) => {
        totalLoaders += length;
    });
    return total / totalLoaders;
};
AssetLoader.updateAssetProgress = (asset, done, total) => {
    if (AssetLoader.assetProgress[asset] === 1 || total < done || total <= 0) {
        return;
    }
    let progress = 1;
    if (typeof done !== 'undefined' && typeof total !== 'undefined') {
        progress = done / total;
    }
    AssetLoader.assetProgress[asset] = progress;
    if (AssetLoader.progressListeners.length > 0) {
        AssetLoader.progressListeners.forEach(callback => callback(AssetLoader.getProgress()));
    }
};
AssetLoader.getAssetById = id => AssetLoader.loadedAssets[id];
AssetLoader.asyncQueue = (queue, callback) => {
    const workingQueue = queue.slice();
    const next = function next() {
        const collection = workingQueue.shift();
        AssetLoader.asyncCollection(collection, () => {
            if (workingQueue.length > 0) {
                next();
            } else {
                callback();
            }
        });
    };
    next();
};
AssetLoader.asyncCollection = (collection, callback) => {
    var collection = collection.slice();
    let numLoading = Math.min(AssetLoader.maxConcurrency, collection.length);
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
    collection.splice(0, AssetLoader.maxConcurrency).forEach(loadAndContinue);
};
AssetLoader.add = asset => {
    const fileType = asset.split('.').pop();
    if (fileType === 'png') {
        AssetLoader.add.image(asset);
    } else if (fileType === 'json') {
        AssetLoader.add.json(asset);
    } else if (fileType === 'css') {
        AssetLoader.add.css(asset);
    } else {
        throw new Error(`Unsupported file-type (${fileType}) passed to AssetLoader.add.`);
    }
};
AssetLoader.add.image = asset => {
    AssetLoader.assetsLoading.push(asset);
    AssetLoader.push(done => {
        const img = new Image();
        img.onload = () => {
            AssetLoader.done(asset, img);
            AssetLoader.updateAssetProgress(asset, 1, 1);
            done();
        };
        img.crossOrigin = "Anonymous";
        img.src = asset;
    });
};
AssetLoader.setupAudioLoader = () => {
    if (isIE11) {
        return;
    }
    AssetLoader.audioLoader = AssetLoader.audioLoader || new THREE.AudioLoader();
};
AssetLoader.setupFontLoader = () => {
    AssetLoader.fontLoader = AssetLoader.fontLoader || new THREE.FontLoader();
};
AssetLoader.add.audio = filename => {
    if (isIE11) {
        return;
    }
    AssetLoader.setupAudioLoader();
    AssetLoader.push(done => {
        AssetLoader.audioLoader.load(filename, buffer => {
            AssetLoader.done(filename, buffer);
            done();
        });
    });
};
AssetLoader.add.threeFont = filename => {
    AssetLoader.setupFontLoader();
    AssetLoader.fontLoader.load(filename, font => {
        AssetLoader.done(filename, font);
    });
};
AssetLoader.add.plainAudio = asset => {
    if (isIE11) {
        return;
    }
    AssetLoader.push(done => {
        const audio = new Audio(asset);
        AssetLoader.done(asset, audio);
        done();
    });
};
AssetLoader.add.spriteSheet = (image, json) => {
    AssetLoader.add.image(image);
    AssetLoader.add.json(json);
};
AssetLoader.add.bitmapText = (image, json) => {
    AssetLoader.add.image(image);
    AssetLoader.add.json(json);
};
AssetLoader.add.webFont = (fontFamily, css) => {
    AssetLoader.add.css(css);
    const el = document.createElement('div');
    el.innerText = `Loading ${fontFamily}`;
    el.style.fontFamily = fontFamily;
    el.style.width = 0;
    el.style.height = 0;
    el.style.overflow = 'hidden';
    document.body.appendChild(el);
};
AssetLoader.add.json = asset => {
    AssetLoader.assetsLoading.push(asset);
    console.log(`LOADING ASSET JSON ${asset}`);
    AssetLoader.push(done => {
        loadJSON(asset, response => {
            AssetLoader.done(asset, response);
            done();
        });
    });
};
AssetLoader.add.script = asset => {
    AssetLoader.assetsLoading.push(asset);
    AssetLoader.push(done => {
        AssetLoader.loader.script(asset, () => {
            AssetLoader.done(asset, asset);
            done();
        });
    });
};
AssetLoader.loader.script = (asset, callback) => {
    const el = document.createElement('script');
    el.src = asset;
    el.onload = callback;
    document.head.appendChild(el);
};
AssetLoader.add.css = asset => {
    AssetLoader.assetsLoading.push(asset);
    AssetLoader.push(done => {
        const el = document.createElement('link');
        el.type = 'text/css';
        el.rel = 'stylesheet';
        el.href = asset;
        el.onload = () => {
            AssetLoader.done(asset, el);
            done();
        };
        document.head.appendChild(el);
    });
};
AssetLoader.add.text = asset => {
    AssetLoader.assetsLoading.push(asset);
    AssetLoader.push(done => {
        loadJSON(asset, response => {
            AssetLoader.done(asset, response);
            done();
        });
    });
};
const loadGeneric = function loadGeneric(url, callback) {
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
        AssetLoader.updateAssetProgress(url, loaded, total);
    };
    xhr.onerror = error => {
        throw new Error(`Error during XHR: ${error}`);
    };
    xhr.send();
};
AssetLoader.loadGeneric = loadGeneric;

const loadJSON = (url, callback) => {
    loadGeneric(url, response => {
        callback(JSON.parse(response));
    });
};

window.AssetLoader = AssetLoader;
export default AssetLoader;