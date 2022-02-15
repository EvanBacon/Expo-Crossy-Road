const defaultAssetExts = require("metro-config/src/defaults/defaults").assetExts;

module.exports = {
    resolver: {
        assetExts: [
            ...defaultAssetExts,
            // 3D Model formats
            "ttf",
            "mp4",
            "mp3",
            "obj",
            "wav"
        ]
    }
};
