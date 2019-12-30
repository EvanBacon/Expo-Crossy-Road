import * THREE from 'three';

const ChunksSpace = [{
    name: "space-grassy-nothing",
    lanes: ["space-grass", "space-grass", "space-grass", "space-grass", "space-grass", "space-grass", "space-grass", "space-grass"],
    rarity: "MostEpic",
    Events: []
}, {
    name: "space-grass-single",
    lanes: ["space-grass"],
    rarity: "Common",
    Events: []
}, {
    name: "space-water-lily-a",
    lanes: ["space-log-left-poop", "space-water-lilypad-rand", "space-log-left-poop", "space-log-right-poop", "space-log-left-poop", "space-water-lilypad-rand"],
    rarity: "Epic",
    Events: [{
        rarity: "Rarer",
        scoreThreshold: 50
    }]
}, {
    name: "space-water-left-3",
    lanes: ["space-water-lilypad-rand", "space-log-left-poop-slow", "space-log-left-poop-fast", "space-log-right-poop"],
    rarity: "Rarer",
    Events: [{
        rarity: "Uncommon",
        scoreThreshold: 25
    }, {
        rarity: "Common",
        scoreThreshold: 350
    }]
}, {
    name: "space-water-lily-rand",
    lanes: ["space-water-lilypad-rand"],
    rarity: "Rarer",
    Events: [{
        rarity: "Uncommon",
        scoreThreshold: 50
    }]
}, {
    name: "space-water-easy",
    lanes: ["space-log-right-poop", "space-log-left-poop"],
    rarity: "Rarer",
    Events: [{
        rarity: "Uncommon",
        scoreThreshold: 15
    }, {
        rarity: "Common",
        scoreThreshold: 320
    }]
}, {
    name: "space-road-harder",
    lanes: ["space-grass", "space-road", "space-road", "space-road"],
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
    name: "space-log-poop-4-alt-b",
    lanes: ["space-log-right-poop", "space-log-left-poop", "space-log-right-poop"],
    rarity: "Rarer",
    Events: [{
        rarity: "Uncommon",
        scoreThreshold: 70
    }]
}, {
    name: "space-road-single",
    lanes: ["space-road"],
    rarity: "Common",
    Events: []
}, {
    name: "space-log-poop-4-alt",
    lanes: ["space-log-left-poop", "space-log-right-poop", "space-log-left-poop", "space-log-right-poop"],
    rarity: "Epic",
    Events: [{
        rarity: "Rare",
        scoreThreshold: 60
    }, {
        rarity: "Common",
        scoreThreshold: 400
    }]
}, {
    name: "space-road-highway",
    lanes: ["space-road", "space-road", "space-road", "space-road", "space-road", "space-road", "space-road", "space-road", "space-road", "space-road"],
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
    name: "space-road-easy",
    lanes: ["space-grass", "space-road", "space-road"],
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
    name: "space-road-5",
    lanes: ["space-road", "space-road", "space-road", "space-road", "space-road"],
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
    name: "space-field",
    lanes: ["space-grass-hole", "space-grass", "space-grass-empty", "space-grass-empty", "space-grass-empty", "space-grass-empty", "space-field-mid", "space-grass-empty", "space-grass-empty", "space-grass-empty", "space-grass-empty", "space-grass-empty", "space-grass", "space-grass-hole"],
    rarity: "Never",
    Events: [{
        rarity: "Epic",
        scoreThreshold: 30
    }]
}, {
    name: "space-grass-hole-single",
    lanes: ["space-grass-hole"],
    rarity: "Never",
    Events: [{
        rarity: "Uncommon",
        scoreThreshold: 300
    }]
}, {
    name: "space-hard-water",
    lanes: ["space-log-right-poop", "space-log-left-poop", "space-log-right-poop", "space-log-left-poop", "space-log-right-poop", "space-log-left-poop", "space-log-right-poop", "space-water-lilypad-rand", "space-log-left-poop", "space-log-right-poop", "space-log-left-poop", "space-log-right-poop", "space-water-lilypad-rand", "space-log-left-poop", "space-log-right-poop"],
    rarity: "Never",
    Events: [{
        rarity: "MostEpic",
        scoreThreshold: 60
    }, {
        rarity: "Epic",
        scoreThreshold: 100
    }]
}, {
    name: "tutorial",
    lanes: ["tutorial-grass-neat", "tutorial-hole-center", "tutorial-hole-center", "tutorial-hole-center", "tutorial-grass-empty", "tutorial-grass-empty", "tutorial-hole-left", "tutorial-grass-empty", "tutorial-grass-empty", "tutorial-hole-center", "tutorial-grass", "tutorial-grass", "tutorial-grass", "space-road", "space-grass", "space-grass", "space-road", "space-road", "space-grass", "space-grass", "space-road", "space-grass", "space-road", "space-grass", "space-road", "space-road", "space-grass", "space-grass", "space-grass"],
    rarity: "Never",
    Events: []
}, {
    name: "space-special-1",
    lanes: ["space-water-lilypad-rand", "space-log-left-poop", "space-log-right-poop", "space-block-1", "space-block-1", "space-block-2", "space-block-2", "space-log-right-poop", "space-log-left-poop", "space-water-lilypad-rand"],
    rarity: "Rare",
    Events: []
}, {
    name: "space-special-2",
    lanes: ["space-water-lilypad-rand", "space-log-left-poop", "space-log-right-poop", "space-special-1", "space-special-2", "space-special-3", "space-special-4", "space-log-right-poop", "space-log-left-poop", "space-log-right-poop", "space-water-lilypad-rand"],
    rarity: "Rare",
    Events: []
}, {
    name: "space-special-3",
    lanes: ["space-log-right-poop", "space-log-left-poop", "space-log-right-poop", "space-special-1", "space-special-2", "space-log-right-poop", "space-water-lilypad-rand", "space-log-left-poop", "space-block-2", "space-block-2", "space-log-left-poop", "space-log-right-poop", "space-water-lilypad-rand"],
    rarity: "Rare",
    Events: []
}, {
    name: "space-meteorshower-5",
    lanes: ["space-shower", "space-shower", "space-shower-blocking-5", "space-shower", "space-shower"],
    rarity: "Rare",
    Events: []
}];
export default ChunksSpace;