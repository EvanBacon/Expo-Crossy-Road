
const OriginalWorldPieces = {
    "train-middle": {
        PieceSelectionWeighting: 1,
        PieceType: "Other",
        Variations: [{
            name: "train_middle",
            weight: 1,
            scoreRequired: -1,
            animationSpeed: 0
        }],
        poolAmount: 20
    },
    "strip-train": {
        PieceSelectionWeighting: 1,
        PieceType: "Other",
        Variations: [{
            name: "strip_train",
            weight: 1,
            scoreRequired: -1,
            animationSpeed: 0
        }],
        poolAmount: 15
    },
    "strip-grass-2": {
        PieceSelectionWeighting: 1,
        PieceType: "grass",
        Variations: [{
            name: "strip_grass_2",
            weight: 1,
            scoreRequired: -1,
            animationSpeed: 0
        }],
        poolAmount: 15
    },
    "log": {
        PieceSelectionWeighting: 1,
        PieceType: "Log",
        Variations: [{
            name: "log_1",
            weight: 1,
            scoreRequired: 100,
            hitBoxScale: [1.5, 0.5, 1.0],
            logwidth: 1,
            animationSpeed: 0
        }, {
            name: "log_2",
            weight: 1,
            scoreRequired: -1,
            hitBoxScale: [2.5, 0.5, 1.0],
            logwidth: 2,
            animationSpeed: 0
        }, {
            name: "log_3",
            weight: 1,
            scoreRequired: -1,
            hitBoxScale: [3.5, 0.5, 1.0],
            logwidth: 3,
            animationSpeed: 0
        }],
        poolAmount: 30
    },
    "strip-road-1": {
        PieceSelectionWeighting: 1,
        PieceType: "Other",
        Variations: [{
            name: "strip_road_1",
            weight: 1,
            scoreRequired: -1,
            animationSpeed: 0
        }],
        poolAmount: 15
    },
    "blocking-object-tall": {
        PieceSelectionWeighting: 1,
        PieceType: "Other",
        Variations: [{
            name: "tree_1",
            weight: 25,
            scoreRequired: -1,
            animationSpeed: 0
        }, {
            name: "tree_2",
            weight: 25,
            scoreRequired: -1,
            animationSpeed: 0
        }, {
            name: "tree_3",
            weight: 25,
            scoreRequired: -1,
            animationSpeed: 0
        }, {
            name: "tree_4",
            weight: 25,
            scoreRequired: -1,
            animationSpeed: 0
        }, {
            name: "stump",
            weight: 2,
            scoreRequired: -1,
            animationSpeed: 0
        }],
        poolAmount: 30
    },
    "train-light-on": {
        PieceSelectionWeighting: 1,
        PieceType: "Other",
        Variations: [{
            name: "train_light_on_1",
            weight: 1,
            scoreRequired: -1,
            animationSpeed: 5
        }],
        poolAmount: 5
    },
    "vehicle-car-special": {
        PieceSelectionWeighting: 0.003,
        PieceType: "Vehicle",
        Variations: [{
            name: "fuzz",
            weight: 1,
            scoreRequired: -1,
            hitBoxScale: [1.6, 1.0, 0.7],
            playCarNoise: "True",
            minCoolDown: 1,
            maxHornCooldown: 20,
            animationSpeed: 0
        }],
        poolAmount: 5
    },
    "eagle-fly": {
        PieceSelectionWeighting: 1,
        PieceType: "Other",
        Variations: [{
            name: "eagle_1",
            weight: 1,
            scoreRequired: -1,
            animationSpeed: 16
        }],
        poolAmount: 1
    },
    "vehicle-truck": {
        PieceSelectionWeighting: 0.166,
        PieceType: "Vehicle",
        Variations: [{
            name: "truck",
            weight: 0.799,
            scoreRequired: -1,
            hitBoxScale: [2.8, 1.0, 0.7],
            playCarNoise: "True",
            minCoolDown: 1,
            maxHornCooldown: 20,
            animationSpeed: 0
        }, {
            name: "truck_blue",
            weight: 0.15,
            scoreRequired: -1,
            hitBoxScale: [2.8, 1.0, 0.7],
            playCarNoise: "True",
            minCoolDown: 1,
            maxHornCooldown: 20,
            animationSpeed: 0
        }, {
            name: "truck_green",
            weight: 0.05,
            scoreRequired: -1,
            hitBoxScale: [2.8, 1.0, 0.7],
            playCarNoise: "True",
            minCoolDown: 1,
            maxHornCooldown: 20,
            animationSpeed: 0
        }],
        poolAmount: 15
    },
    "strip-water": {
        PieceSelectionWeighting: 1,
        PieceType: "Water",
        Variations: [{
            name: "strip_water_1",
            weight: 1,
            scoreRequired: -1,
            animationSpeed: 0
        }],
        poolAmount: 15
    },
    "train-light-off": {
        PieceSelectionWeighting: 1,
        PieceType: "Other",
        Variations: [{
            name: "train_light_off",
            weight: 1,
            scoreRequired: -1,
            animationSpeed: 0
        }],
        poolAmount: 5
    },
    "strip-grass-1": {
        PieceSelectionWeighting: 1,
        PieceType: "grass",
        Variations: [{
            name: "strip_grass_1",
            weight: 1,
            scoreRequired: -1,
            animationSpeed: 0
        }],
        poolAmount: 15
    },
    "strip-road-2": {
        PieceSelectionWeighting: 1,
        PieceType: "Other",
        Variations: [{
            name: "strip_road_2",
            weight: 1,
            scoreRequired: -1,
            animationSpeed: 0
        }],
        poolAmount: 15
    },
    "train-front": {
        PieceSelectionWeighting: 1,
        PieceType: "Other",
        Variations: [{
            name: "train_front",
            weight: 1,
            scoreRequired: -1,
            animationSpeed: 0
        }],
        poolAmount: 7
    },
    "lillypad": {
        PieceSelectionWeighting: 1,
        PieceType: "Other",
        Variations: [{
            name: "lilypad",
            weight: 1,
            scoreRequired: -1,
            animationSpeed: 0
        }],
        poolAmount: 20
    },
    "train-back": {
        PieceSelectionWeighting: 1,
        PieceType: "Other",
        Variations: [{
            name: "train_back",
            weight: 1,
            scoreRequired: -1,
            animationSpeed: 0
        }],
        poolAmount: 7
    },
    "vehicle-car": {
        PieceSelectionWeighting: 0.831,
        PieceType: "Vehicle",
        Variations: [{
            name: "electric",
            weight: 0.2,
            scoreRequired: -1,
            hitBoxScale: [1.1, 1.0, 0.7],
            playCarNoise: "True",
            minCoolDown: 1,
            maxHornCooldown: 20,
            animationSpeed: 0
        }, {
            name: "ganster",
            weight: 0.2,
            scoreRequired: -1,
            hitBoxScale: [1.6, 1.0, 0.7],
            playCarNoise: "True",
            minCoolDown: 1,
            maxHornCooldown: 20,
            animationSpeed: 0
        }, {
            name: "muscle",
            weight: 0.003,
            scoreRequired: -1,
            hitBoxScale: [1.8, 1.0, 0.7],
            playCarNoise: "True",
            minCoolDown: 1,
            maxHornCooldown: 20,
            animationSpeed: 0
        }, {
            name: "sedan",
            weight: 0.2,
            scoreRequired: -1,
            hitBoxScale: [1.6, 1.0, 0.7],
            playCarNoise: "True",
            minCoolDown: 1,
            maxHornCooldown: 20,
            animationSpeed: 0
        }],
        poolAmount: 50
    },
    "blocking-object-short": {
        PieceSelectionWeighting: 1,
        PieceType: "Other",
        Variations: [{
            name: "tree_1",
            weight: 33,
            scoreRequired: -1,
            animationSpeed: 0
        }, {
            name: "tree_2",
            weight: 33,
            scoreRequired: -1,
            animationSpeed: 0
        }, {
            name: "rock",
            weight: 33,
            scoreRequired: -1,
            animationSpeed: 0
        }, {
            name: "stump",
            weight: 2,
            scoreRequired: -1,
            animationSpeed: 0
        }],
        poolAmount: 10
    },
    "forest": {
        PieceSelectionWeighting: 1,
        PieceType: "Other",
        Variations: [{
            name: "forest_1",
            weight: 1,
            scoreRequired: -1,
            animationSpeed: 0
        }, {
            name: "forest_2",
            weight: 1,
            scoreRequired: -1,
            animationSpeed: 0
        }, {
            name: "forest_3",
            weight: 1,
            scoreRequired: -1,
            animationSpeed: 0
        }, {
            name: "forest_4",
            weight: 1,
            scoreRequired: -1,
            animationSpeed: 0
        }, {
            name: "forest_5",
            weight: 1,
            scoreRequired: -1,
            animationSpeed: 0
        }, {
            name: "forest_6",
            weight: 1,
            scoreRequired: -1,
            animationSpeed: 0
        }],
        poolAmount: 15
    }
};
export default OriginalWorldPieces;