import R from "./common/ramda.js";
import Json_rpc from "./Json_rpc.js";
import RoyalGameOfUr from "../common/RoyalGameOfUr.js";

// Look into preloading images with Promise
// because there are quite a few images to load
const PIECE_IMAGE_SOURCES = [
    "./assets/piece-dark.png",
    "./assets/piece-light.png",
    "./assets/piece-played.png"
];

const PIECE_IMAGE_ALTS = [
    "Dark piece",
    "Light piece",
    "Played piece"
];

const DICE_IMAGE_SOURCES = [
    [
        "./assets/dice-0_version-1.png",
        "./assets/dice-0_version-2.png",
        "./assets/dice-0_version-3.png"
    ],
    [
        "./assets/dice-1_version-1.png",
        "./assets/dice-1_version-2.png",
        "./assets/dice-1_version-3.png"
    ]
];

const DICE_IMAGE_ALTS = [
    "Die which rolled 0",
    "Die which rolled 1"
];

const BOARD_WIDTH_DESIGN = 910;
const TILES_WIDTH_DESIGN = 870;
const TILES_HEIGHT_DESIGN = 320;
const TILE_WIDTH_DESIGN = 100;
const ROWS = 3;
const COLUMNS = 8;

const initialBoard = RoyalGameOfUr.createBoard();
console.log(initialBoard);

const drawTilesContainer = function () {
    // Retrieving dimensions from browser side
    const gameArea = document.getElementById("gameArea");
    const gameAreaWidth = parseInt(
        window.getComputedStyle(gameArea).getPropertyValue("width")
    );
    const board = document.getElementById("board");
    const boardWidth = parseInt(
        window.getComputedStyle(board).getPropertyValue("width")
    );

    // Doing the calculations
    const scalingWidth = TILES_WIDTH_DESIGN / BOARD_WIDTH_DESIGN;
    const aspectRatio = TILES_WIDTH_DESIGN / TILES_HEIGHT_DESIGN;
    const tilesContainerWidthPercent = (
        boardWidth * scalingWidth / gameAreaWidth * 100 + "%"
    );
    // Creating the tilesContainer element and assigning properties
    const tilesContainer = document.createElement("div");
    tilesContainer.className = "tiles-container";
    tilesContainer.style.width = tilesContainerWidthPercent;
    tilesContainer.style.aspectRatio = aspectRatio;
    tilesContainer.id = "tilesContainer";
    gameArea.append(tilesContainer);
};

drawTilesContainer();

const drawTiles = function () {
    // Retrieving dimensions from browser side
    const tilesContainer = document.getElementById("tilesContainer");

    // Doing the calculations
    const tileWidthPercent = TILE_WIDTH_DESIGN / TILES_WIDTH_DESIGN * 100 + "%";

    // Creating the elements
    [...new Array(ROWS)].forEach(function (ignore, rowIndex) {
        const row = document.createElement("div");
        row.className = "tiles-container__row";
        [...new Array(COLUMNS)].forEach(function (ignore, columnIndex) {
            const vector = [columnIndex, rowIndex];
            const tile = document.createElement("div");
            tile.style.width = tileWidthPercent;
            tile.className = "tile tile--regular";
            tile.id = `[${columnIndex}, ${rowIndex}]`;
            if (RoyalGameOfUr.tileIsRosette(vector)) {
                tile.className = "tile tile--rosette";
            }
            if (RoyalGameOfUr.tileIsEmpty(vector)) {
                tile.className = "tile";
            }
            row.append(tile);
        });
        // Prepend because div elements are appended from top to bottom
        // But coordinates are from bottom to top
        tilesContainer.prepend(row);
    });
};

drawTiles();

const redrawPiecesAtHome = function (playerID, board) {
    const containerID = `player${playerID}PiecesContainer`;
    const container = document.getElementById(containerID);
    const playerIndex = playerID - 1; // Because array indexing starts from 0
    const piecesAtHome = RoyalGameOfUr.piecesAtHome(playerID, board);
    const row1 = document.createElement("div");
    row1.className = "pieces__row";
    const row2 = document.createElement("div");
    row2.className = "pieces__row pieces__row--row2";
    const pieces = R.range(0, 7);
    pieces.forEach(function (index) {
        const piece = document.createElement("img");
        piece.className = "piece--home";
        if (index < piecesAtHome) {
            piece.src = PIECE_IMAGE_SOURCES[playerIndex];
            piece.alt = PIECE_IMAGE_ALTS[playerIndex];
        } else {
            piece.src = PIECE_IMAGE_SOURCES[PIECE_IMAGE_SOURCES.length - 1];
            piece.alt = PIECE_IMAGE_ALTS[PIECE_IMAGE_ALTS.length - 1];
        }
        if (index < 4) {
            row1.append(piece);
        } else {
            row2.append(piece);
        }
    });
    // Placeholder for the non-existing 8th piece, for layout purposes
    const placeholder = document.createElement("span");
    placeholder.className = "piece--home";
    row2.append(placeholder);
    container.append(row1);
    container.append(row2);
};

redrawPiecesAtHome(1, initialBoard);
redrawPiecesAtHome(2, initialBoard);

const redrawPiecesOnBoard = function (board) {
    const allPlayersPieces = [board[1], board[2]];
    console.log(allPlayersPieces);
    allPlayersPieces.forEach(function (playerPieces, playerIndex) {
        playerPieces.forEach(function (piece) {
            if (RoyalGameOfUr.tileIsEmpty(piece)) {
                return;
            }
            const row = piece[1];
            const column = piece[0];
            const tileID = `[${column}, ${row}]`;
            const tileOccupiedByPiece = document.getElementById(tileID);
            const image = document.createElement("img");
            image.src = PIECE_IMAGE_SOURCES[playerIndex];
            image.alt = PIECE_IMAGE_ALTS[playerIndex];
            image.className = "piece--board";
            tileOccupiedByPiece.append(image);
        });
    });
};

redrawPiecesOnBoard(initialBoard);

const rollDice = function (playerID, board) {
    const diceValues = RoyalGameOfUr.rollDice(board).diceValues;
    diceValues.forEach(function (dieValue, index) {
        const dieImage = document.getElementById(
            `player${playerID}Die${index + 1}`
        );
        const diceImagesForValue = DICE_IMAGE_SOURCES[dieValue];
        dieImage.src = diceImagesForValue[
            Math.floor(Math.random() * diceImagesForValue.length)
        ];
        dieImage.alt = DICE_IMAGE_ALTS[dieValue];
        dieImage.className = "dice";
    });
    const totalDiceValue = RoyalGameOfUr.sumDiceValues(diceValues);
    const totalDiceValueText = document.getElementById(
        `player${playerID}TotalDiceValue`
    );
    totalDiceValueText.textContent = totalDiceValue;
};

const player1PlayButton = document.getElementById("player1PlayButton");
player1PlayButton.onclick = () => rollDice(1, initialBoard);
const player2PlayButton = document.getElementById("player2PlayButton");
player2PlayButton.onclick = () => rollDice(2, initialBoard);

// Testing
const beforeBoard = RoyalGameOfUr.createBoard(
    [
        [
            [4, 0],
            [4, 0],
            [4, 0],
            [4, 0],
            [4, 0],
            [4, 0],
            [4, 0]
        ],
        [
            [1, 1],
            [4, 2],
            [4, 2],
            [4, 2],
            [4, 2],
            [4, 2],
            [4, 2]
        ]
    ],
    1, //playerToPly
    [0, 1, 1, 1] // diceValues
);
const afterBoard = RoyalGameOfUr.ply(
    1, // playerID
    [1, 1], // Piece belongs to opponent
    beforeBoard
);