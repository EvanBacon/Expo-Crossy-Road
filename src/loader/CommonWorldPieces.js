
const CommonWorldPieces = {
    "coin": {
        PieceSelectionWeighting: 1,
        PieceType: "Other",
        Variations: [{
            name: "coin",
            weight: 1,
            scoreRequired: -1,
            hitBoxScale: [1.0, 2.0, 1.0],
            animationSpeed: 0
        }],
        poolAmount: 10
    },
    "red-coin": {
        PieceSelectionWeighting: 1,
        PieceType: "Other",
        Variations: [{
            name: "red_coin",
            weight: 1,
            scoreRequired: -1,
            animationSpeed: 0
        }],
        poolAmount: 10
    }
};
export default CommonWorldPieces;