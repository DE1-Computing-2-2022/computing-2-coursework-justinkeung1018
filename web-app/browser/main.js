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

const enablePlayButton = function (board) {
    const nextPlayerID = board.playerToPly;
    const nextPlayerPlayButtonID = `player${
        nextPlayerID
    }PlayButton`;
    const nextPlayerPlayButton = document.getElementById(
        nextPlayerPlayButtonID
    );
    nextPlayerPlayButton.onclick = () => rollDice(nextPlayerID, board);
    nextPlayerPlayButton.disabled = false;
};

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
            const homePiece = initialBoard[playerID][0];
            if (RoyalGameOfUr.pieceHasValidMoves(playerID, homePiece, board)) {
                piece.onclick = function () {
                    const boardAfterPly = RoyalGameOfUr.ply(
                        playerID,
                        homePiece,
                        board
                    );
                    redrawScreen(boardAfterPly);
                };
            }
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
    const rows = [row1, row2];
    container.replaceChildren(...rows);
};

const redrawPiecesOnBoard = function (board) {
    // Clears all previous pieces
    [...new Array(ROWS)].forEach(function (ignore, rowIndex) {
        [...new Array(COLUMNS)].forEach(function (ignore, columnIndex) {
            const tileID = `[${columnIndex}, ${rowIndex}]`;
            const tile = document.getElementById(tileID);
            tile.replaceChildren();
        });
    });

    // Redraws new pieces
    const allPlayersPieces = [board[1], board[2]];
    const playerID = board.playerToPly;
    allPlayersPieces.forEach(function (playerPieces, playerIndex) {
        console.log("New turn");
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
            if (RoyalGameOfUr.pieceHasValidMoves(playerID, piece, board)) {
                console.log(`${piece} has valid moves`);
                const boardAfterPly = RoyalGameOfUr.ply(playerID, piece, board);
                console.log(boardAfterPly);
                image.onclick = () => redrawScreen(boardAfterPly);
            }
            tileOccupiedByPiece.replaceChildren(image);
        });
    });
};

const rollDice = function (playerID, board) {
    const boardAfterRollingDice = RoyalGameOfUr.rollDice(board);
    if (!RoyalGameOfUr.playerHasValidMoves(playerID, boardAfterRollingDice)) {
        const boardAfterPassing = RoyalGameOfUr.pass(boardAfterRollingDice);
        redrawScreen(boardAfterPassing);
        return;
    }
    redrawScreen(boardAfterRollingDice);
    const diceValues = boardAfterRollingDice.diceValues;
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
        dieImage.style.display = "block";
    });
    const totalDiceValue = RoyalGameOfUr.sumDiceValues(diceValues);
    const totalDiceValueText = document.getElementById(
        `player${playerID}TotalDiceValue`
    );
    totalDiceValueText.textContent = totalDiceValue;
    const playerPlayButtonID = `player${playerID}PlayButton`;
    const playerPlayButton = document.getElementById(playerPlayButtonID);
    playerPlayButton.className = "button button--grayed";
    playerPlayButton.disabled = true;
};

const redrawPlayerPanels = function (board) {
    const playerID = board.playerToPly;
    const opponentID = 3 - playerID;

    // Toggling gray overlay
    const playerPanelGrayedID = `player${playerID}PanelGrayed`;
    const playerPanelGrayed = document.getElementById(playerPanelGrayedID);
    playerPanelGrayed.style.display = "none";

    const opponentPanelGrayedID = `player${opponentID}PanelGrayed`;
    const opponentPanelGrayed = document.getElementById(opponentPanelGrayedID);
    opponentPanelGrayed.style.display = "block";

    // Changing dice background
    const playerDiceBackgroundID = `player${playerID}DiceBackground`;
    const playerDiceBackground = document.getElementById(
        playerDiceBackgroundID
    );
    playerDiceBackground.className = "player-panel__dice-background";

    const opponentDiceBackgroundID = `player${opponentID}DiceBackground`;
    const opponentDiceBackground = document.getElementById(
        opponentDiceBackgroundID
    );
    opponentDiceBackground.className = [
        "player-panel__dice-background",
        "player-panel__dice-background--grayed"
    ].join(" ");

    // Removing the dice
    [playerID, opponentID].forEach(function (ID) {
        [1, 2, 3, 4].forEach(function (die) {
            const dieImage = document.getElementById(
                `player${ID}Die${die}`
            );
            dieImage.style.display = "none";
        });
    });

    // Removing the value of dice rolled
    const playerTotalDiceValueText = document.getElementById(
        `player${playerID}TotalDiceValue`
    );
    playerTotalDiceValueText.textContent = "0";
    const opponentTotalDiceValueText = document.getElementById(
        `player${opponentID}TotalDiceValue`
    );
    opponentTotalDiceValueText.textContent = "";

    // Changing button color
    const playerPlayButtonID = `player${playerID}PlayButton`;
    const playerPlayButton = document.getElementById(playerPlayButtonID);
    playerPlayButton.className = "button button--play";

    const opponentPlayButtonID = `player${opponentID}PlayButton`;
    const opponentPlayButton = document.getElementById(opponentPlayButtonID);
    opponentPlayButton.className = "button button--grayed";
};

const redrawScreen = function (board) {
    redrawPiecesAtHome(1, board);
    redrawPiecesAtHome(2, board);
    redrawPiecesOnBoard(board);
    redrawPlayerPanels(board);
    enablePlayButton(board);
};

// Setting up the game
const initialBoard = RoyalGameOfUr.createBoard();
drawTiles();
redrawPiecesAtHome(1, initialBoard);
redrawPiecesAtHome(2, initialBoard);
redrawPiecesOnBoard(initialBoard);
redrawPlayerPanels(initialBoard);
const player1PlayButton = document.getElementById("player1PlayButton");
player1PlayButton.onclick = () => rollDice(1, initialBoard);

// Testing