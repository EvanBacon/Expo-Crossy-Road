import * THREE from 'three';

const ChunksOriginal = [{
    name: "field",
    lanes: ["grass-hole", "grass", "grass-empty", "grass-empty", "grass-empty", "grass-empty", "field-mid", "grass-empty", "grass-empty", "grass-empty", "grass-empty", "grass-empty", "grass", "grass-hole"],
    rarity: "Never",
    Events: [{
        rarity: "Epic",
        scoreThreshold: 30
    }]
}, {
    name: "grassy-nothing",
    lanes: ["grass", "grass", "grass", "grass", "grass", "grass", "grass", "grass"],
    rarity: "MostEpic",
    Events: []
}, {
    name: "grass-hole-single",
    lanes: ["grass-hole"],
    rarity: "Never",
    Events: [{
        rarity: "Uncommon",
        scoreThreshold: 300
    }]
}, {
    name: "hard-water",
    lanes: ["log-right-poop", "log-left-poop", "log-right-poop", "log-left-poop", "log-right-poop", "log-left-poop", "log-right-poop", "water-lilypad-rand", "log-left-poop", "log-right-poop", "log-left-poop", "log-right-poop", "water-lilypad-rand", "log-left-poop", "log-right-poop"],
    rarity: "Never",
    Events: [{
        rarity: "MostEpic",
        scoreThreshold: 60
    }, {
        rarity: "Epic",
        scoreThreshold: 100
    }]
}, {
    name: "hard-traffic",
    lanes: ["train", "train", "road", "train", "road", "train", "road", "road", "train", "road", "road", "road", "train", "train", "train"],
    rarity: "Never",
    Events: [{
        rarity: "MostEpic",
        scoreThreshold: 40
    }, {
        rarity: "Epic",
        scoreThreshold: 100
    }, {
        rarity: "Uncommon",
        scoreThreshold: 360
    }, {
        rarity: "Common",
        scoreThreshold: 500
    }]
}, {
    name: "grass-single",
    lanes: ["grass"],
    rarity: "Common",
    Events: []
}, {
    name: "train-hole",
    lanes: ["train", "train", "train", "grass-hole"],
    rarity: "Never",
    Events: [{
        rarity: "Epic",
        scoreThreshold: 90
    }, {
        rarity: "Uncommon",
        scoreThreshold: 350
    }]
}, {
    name: "water-lily-a",
    lanes: ["log-left-poop", "water-lilypad-rand", "log-left-poop", "log-right-poop", "log-left-poop", "water-lilypad-rand"],
    rarity: "Epic",
    Events: [{
        rarity: "Rarer",
        scoreThreshold: 50
    }]
}, {
    name: "water-left-3",
    lanes: ["water-lilypad-rand", "log-left-poop-slow", "log-left-poop-fast", "log-right-poop"],
    rarity: "Rarer",
    Events: [{
        rarity: "Uncommon",
        scoreThreshold: 25
    }, {
        rarity: "Common",
        scoreThreshold: 350
    }]
}, {
    name: "train-1",
    lanes: ["train"],
    rarity: "Rare",
    Events: [{
        rarity: "Rare",
        scoreThreshold: 2
    }, {
        rarity: "Uncommon",
        scoreThreshold: 110
    }, {
        rarity: "Common",
        scoreThreshold: 180
    }]
}, {
    name: "water-lily-rand",
    lanes: ["water-lilypad-rand"],
    rarity: "Rarer",
    Events: [{
        rarity: "Uncommon",
        scoreThreshold: 50
    }]
}, {
    name: "train-2",
    lanes: ["train", "train"],
    rarity: "Epic",
    Events: [{
        rarity: "Rare",
        scoreThreshold: 30
    }, {
        rarity: "Uncommon",
        scoreThreshold: 50
    }]
}, {
    name: "train-1b",
    lanes: ["train"],
    rarity: "Rare",
    Events: []
}, {
    name: "train-3",
    lanes: ["train", "train"],
    rarity: "Epic",
    Events: [{
        rarity: "Rare",
        scoreThreshold: 70
    }, {
        rarity: "Uncommon",
        scoreThreshold: 100
    }]
}, {
    name: "train-road-alternate",
    lanes: ["road", "train", "road", "train", "road", "train"],
    rarity: "MostEpic",
    Events: [{
        rarity: "Rarer",
        scoreThreshold: 80
    }, {
        rarity: "Rare",
        scoreThreshold: 150
    }, {
        rarity: "Common",
        scoreThreshold: 320
    }]
}, {
    name: "trainfield",
    lanes: ["grass-hole", "grass", "grass", "grass", "train", "grass", "train", "train", "grass", "grass", "train", "train", "train", "grass", "grass", "grass", "grass", "grass", "grass", "grass-hole"],
    rarity: "MostEpic",
    Events: [{
        rarity: "Epic",
        scoreThreshold: 200
    }]
}, {
    name: "water-easy",
    lanes: ["log-right-poop", "log-left-poop"],
    rarity: "Rarer",
    Events: [{
        rarity: "Uncommon",
        scoreThreshold: 15
    }, {
        rarity: "Common",
        scoreThreshold: 320
    }]
}, {
    name: "road-harder",
    lanes: ["grass", "road", "road", "road"],
    rarity: "Rarer",
    Events: [{
        rarity: "Uncommon",
        scoreThreshold: 10
    }, {
        rarity: "Common",
        scoreThreshold: 20
    }, {
        rarity: "Rare",
        scoreThreshold: 300
    }]
}, {
    name: "log-poop-4-alt-b",
    lanes: ["log-right-poop", "log-left-poop", "log-right-poop"],
    rarity: "Rarer",
    Events: [{
        rarity: "Uncommon",
        scoreThreshold: 70
    }]
}, {
    name: "train-road",
    lanes: ["road", "road", "train", "road", "train", "grass-hole"],
    rarity: "MostEpic",
    Events: [{
        rarity: "Epic",
        scoreThreshold: 100
    }, {
        rarity: "Rarer",
        scoreThreshold: 200
    }, {
        rarity: "Uncommon",
        scoreThreshold: 300
    }]
}, {
    name: "road-single",
    lanes: ["road"],
    rarity: "Common",
    Events: []
}, {
    name: "log-poop-4-alt",
    lanes: ["log-left-poop", "log-right-poop", "log-left-poop", "log-right-poop"],
    rarity: "Epic",
    Events: [{
        rarity: "Rare",
        scoreThreshold: 60
    }, {
        rarity: "Common",
        scoreThreshold: 400
    }]
}, {
    name: "road-highway",
    lanes: ["road", "road", "road", "road", "road", "road", "road", "road", "road", "road"],
    rarity: "MostEpic",
    Events: [{
        rarity: "Rarer",
        scoreThreshold: 100
    }, {
        rarity: "Rare",
        scoreThreshold: 150
    }, {
        rarity: "Uncommon",
        scoreThreshold: 300
    }]
}, {
    name: "road-easy",
    lanes: ["grass", "road", "road"],
    rarity: "Common",
    Events: [{
        rarity: "Uncommon",
        scoreThreshold: 10
    }, {
        rarity: "Rarer",
        scoreThreshold: 20
    }, {
        rarity: "MostEpic",
        scoreThreshold: 100
    }]
}, {
    name: "road-5",
    lanes: ["road", "road", "road", "road", "road"],
    rarity: "Epic",
    Events: [{
        rarity: "Rarer",
        scoreThreshold: 30
    }, {
        rarity: "Rare",
        scoreThreshold: 70
    }, {
        rarity: "Uncommon",
        scoreThreshold: 150
    }, {
        rarity: "Common",
        scoreThreshold: 300
    }]
}, {
    name: "train-hard",
    lanes: ["train", "train", "road", "train", "train", "train"],
    rarity: "Never",
    Events: [{
        rarity: "MostEpic",
        scoreThreshold: 20
    }, {
        rarity: "Epic",
        scoreThreshold: 100
    }, {
        rarity: "Rarer",
        scoreThreshold: 150
    }]
}, {
    name: "tutorial",
    lanes: ["tutorial-grass-neat", "tutorial-hole-center", "tutorial-hole-center", "tutorial-hole-center", "tutorial-grass-empty", "tutorial-grass-empty", "tutorial-hole-left", "tutorial-grass-empty", "tutorial-grass-empty", "tutorial-hole-center", "tutorial-grass", "tutorial-grass", "tutorial-grass", "road", "grass", "grass", "road", "road", "grass", "grass", "road", "grass", "road", "grass", "road", "road", "grass", "grass", "grass"],
    rarity: "Never",
    Events: []
}];
export default ChunksOriginal;