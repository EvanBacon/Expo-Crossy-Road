function _defineProperty(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}

let _ref;
const SpaceWorldPieces = {
    "space-log": {
        PieceSelectionWeighting: 1,
        PieceType: "Log",
        Variations: [{
            name: "moon_log_1",
            weight: 1,
            scoreRequired: 100,
            hitBoxScale: [1.5, 0.5, 1.0],
            logwidth: 1,
            animationSpeed: 0
        }, {
            name: "moon_log_2",
            weight: 1,
            scoreRequired: -1,
            hitBoxScale: [2.5, 0.5, 1.0],
            logwidth: 2,
            animationSpeed: 0
        }, {
            name: "moon_log_3",
            weight: 1,
            scoreRequired: -1,
            hitBoxScale: [3.5, 0.5, 1.0],
            logwidth: 3,
            animationSpeed: 0
        }],
        poolAmount: 30
    },
    "space-strip-road-1": {
        PieceSelectionWeighting: 1,
        PieceType: "Other",
        Variations: [{
            name: "moon_strip_road_1",
            weight: 1,
            scoreRequired: -1,
            animationSpeed: 0
        }, {
            name: "moon_strip_road_alt_1",
            weight: 1,
            scoreRequired: -1,
            animationSpeed: 0
        }],
        poolAmount: 15
    },
    "space-strip-road-2": {
        PieceSelectionWeighting: 1,
        PieceType: "Other",
        Variations: [{
            name: "moon_strip_road_2",
            weight: 1,
            scoreRequired: -1,
            animationSpeed: 0
        }, {
            name: "moon_strip_road_alt_2",
            weight: 1,
            scoreRequired: -1,
            animationSpeed: 0
        }],
        poolAmount: 15
    },
    "space-lillypad": {
        PieceSelectionWeighting: 1,
        PieceType: "Other",
        Variations: [{
            name: "moon_lillypad_1",
            weight: 1,
            scoreRequired: -1,
            animationSpeed: 0
        }, {
            name: "moon_lillypad_2",
            weight: 1,
            scoreRequired: -1,
            animationSpeed: 0
        }, {
            name: "moon_lillypad_3",
            weight: 1,
            scoreRequired: -1,
            animationSpeed: 0
        }],
        poolAmount: 30
    },
    "space-blocking-object-tall": {
        PieceSelectionWeighting: 1,
        PieceType: "Other",
        Variations: [{
            name: "moon_geode_tall_1",
            weight: 30,
            scoreRequired: -1,
            animationSpeed: 0
        }, {
            name: "moon_geode_tall_2",
            weight: 30,
            scoreRequired: -1,
            animationSpeed: 0
        }, {
            name: "moon_geode_tall_3",
            weight: 30,
            scoreRequired: -1,
            animationSpeed: 0
        }, {
            name: "spaceexploration_lunarlander",
            weight: 10,
            scoreRequired: -1,
            animationSpeed: 0
        }],
        poolAmount: 30
    },
    "robodog-pickup": {
        PieceSelectionWeighting: 1,
        PieceType: "Other",
        Variations: [{
            name: "spaceexploration_robodog_pickup",
            weight: 0.02,
            scoreRequired: -1,
            animationSpeed: 0
        }],
        poolAmount: 1
    },
    "space-blocking-object-short": {
        PieceSelectionWeighting: 1,
        PieceType: "Other",
        Variations: [{
            name: "moon_rock_small_1",
            weight: 33,
            scoreRequired: -1,
            animationSpeed: 0
        }, {
            name: "moon_rock_small_2",
            weight: 33,
            scoreRequired: -1,
            animationSpeed: 0
        }, {
            name: "moon_rock_small_3",
            weight: 33,
            scoreRequired: -1,
            animationSpeed: 0
        }],
        poolAmount: 10
    },
    "space-strip-grass-1": {
        PieceSelectionWeighting: 1,
        PieceType: "grass",
        Variations: [{
            name: "moon_strip_ground_alt_1",
            weight: 1,
            scoreRequired: -1,
            animationSpeed: 0
        }, {
            name: "moon_strip_ground_alt_2",
            weight: 1,
            scoreRequired: -1,
            animationSpeed: 0
        }],
        poolAmount: 15
    },
    "space-strip-grass-2": {
        PieceSelectionWeighting: 1,
        PieceType: "grass",
        Variations: [{
            name: "moon_strip_ground_1",
            weight: 1,
            scoreRequired: -1,
            animationSpeed: 0
        }, {
            name: "moon_strip_ground_2",
            weight: 1,
            scoreRequired: -1,
            animationSpeed: 0
        }],
        poolAmount: 15
    },
    "space-strip-water": {
        PieceSelectionWeighting: 1,
        PieceType: "Water",
        Variations: [{
            name: "moon_strip_emptyspace",
            weight: 1,
            scoreRequired: -1,
            animationSpeed: 0
        }],
        poolAmount: 15
    },
    "space-forest": {
        PieceSelectionWeighting: 1,
        PieceType: "Other",
        Variations: [{
            name: "moon_strip_emptyspace",
            weight: 1,
            scoreRequired: -1,
            animationSpeed: 0
        }],
        poolAmount: 15
    },
    "space-vehicle-car": {
        PieceSelectionWeighting: 0.831,
        PieceType: "Vehicle",
        Variations: [{
            name: "moon_rollingasteroid_1_fixedmesh",
            weight: 1,
            scoreRequired: -1,
            hitBoxScale: [1.0, 1.0, 1.0],
            playCarNoise: "False",
            minCoolDown: 1,
            maxHornCooldown: 2000,
            animationSpeed: 0
        }, {
            name: "moon_rollingasteroid_2_fixedmesh",
            weight: 1,
            scoreRequired: -1,
            hitBoxScale: [1.0, 1.0, 1.0],
            playCarNoise: "False",
            minCoolDown: 1,
            maxHornCooldown: 2000,
            animationSpeed: 0
        }],
        poolAmount: 50
    },
    "specimen": {
        PieceSelectionWeighting: 1,
        PieceType: "Other",
        Variations: [{
            name: "alien",
            weight: 33,
            scoreRequired: -1,
            animationSpeed: 0
        }],
        poolAmount: 20
    },
    "space-special-1": {
        PieceSelectionWeighting: 1,
        PieceType: "grass",
        Variations: [{
            name: "moon_chunk_2_strip_1",
            weight: 1,
            holes: [3, 4, 5, -2, -3],
            scoreRequired: -1,
            animationSpeed: 0
        }],
        poolAmount: 15
    },
    "space-special-2": {
        PieceSelectionWeighting: 1,
        PieceType: "grass",
        Variations: [{
            name: "moon_chunk_2_strip_2",
            weight: 1,
            holes: [3, 4, -3, -4],
            scoreRequired: -1,
            animationSpeed: 0
        }],
        poolAmount: 15
    },
    "space-special-3": {
        PieceSelectionWeighting: 1,
        PieceType: "grass",
        Variations: [{
            name: "moon_chunk_2_strip_3",
            weight: 1,
            holes: [3, 4, -3, -4, -5],
            scoreRequired: -1,
            animationSpeed: 0
        }],
        poolAmount: 15
    },
    "space-special-4": {
        PieceSelectionWeighting: 1,
        PieceType: "grass",
        Variations: [{
            name: "moon_chunk_2_strip_4",
            weight: 1,
            holes: [2, 3, 4, -2, -3, -4],
            scoreRequired: -1,
            animationSpeed: 0
        }],
        poolAmount: 15
    },
    "space-block-1": {
        PieceSelectionWeighting: 1,
        PieceType: "grass",
        Variations: [{
            name: "moon_chunk_1_strip_1",
            weight: 1,
            holes: [5, -4],
            scoreRequired: -1,
            animationSpeed: 0
        }, {
            name: "moon_chunk_1_strip_2",
            weight: 1,
            holes: [5, -4],
            scoreRequired: -1,
            animationSpeed: 0
        }],
        poolAmount: 15
    },
    "space-block-2": {
        PieceSelectionWeighting: 1,
        PieceType: "grass",
        Variations: [{
            name: "moon_chunk_1_strip_3",
            weight: 1,
            holes: [1, 0],
            scoreRequired: -1,
            animationSpeed: 0
        }, {
            name: "moon_chunk_1_strip_4",
            weight: 1,
            holes: [1, 0],
            scoreRequired: -1,
            animationSpeed: 0
        }],
        poolAmount: 15
    },
    "barrier-spawner": {
        PieceSelectionWeighting: 1,
        PieceType: "Other",
        Variations: [{
            name: "moon_barrierspawner",
            weight: 1,
            scoreRequired: -1,
            animationSpeed: 0
        }],
        poolAmount: 10
    },
    "barrier-button": {
        PieceSelectionWeighting: 1,
        PieceType: "Other",
        Variations: [{
            name: "moon_barrierbutton",
            weight: 1,
            scoreRequired: -1,
            animationSpeed: 0
        }],
        poolAmount: 10
    },
    "barrier": {
        PieceSelectionWeighting: 1,
        PieceType: "Other",
        Variations: [{
            name: "moon_blockingbarrier",
            weight: 1,
            scoreRequired: -1,
            animationSpeed: 0
        }],
        poolAmount: 10
    },
    "meteor": {
        PieceSelectionWeighting: 1,
        PieceType: "Other",
        Variations: [(_ref = {
            name: "moon_meteorshower_debris_1",
            weight: 1,
            scoreRequired: -1,
            animationSpeed: 0
        }, _defineProperty(_ref, "name", "moon_meteorshower_debris_2"), _defineProperty(_ref, "weight", 1), _defineProperty(_ref, "scoreRequired", -1), _defineProperty(_ref, "animationSpeed", 0), _defineProperty(_ref, "name", "moon_meteorshower_debris_3"), _defineProperty(_ref, "weight", 1), _defineProperty(_ref, "scoreRequired", -1), _defineProperty(_ref, "animationSpeed", 0), _ref)],
        poolAmount: 50
    },
    "hipster-whale-log": {
        PieceSelectionWeighting: 1,
        PieceType: "Log",
        Variations: [{
            name: "hipster_whale",
            weight: 1,
            scoreRequired: 100,
            hitBoxScale: [1.5, 0.5, 1.0],
            logwidth: 1,
            animationSpeed: 0
        }],
        poolAmount: 1
    }
};
export default SpaceWorldPieces;