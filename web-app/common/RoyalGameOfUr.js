import R from "../common/ramda.js";
/**
 * RoyalGameOfUr.js is a module to play the Royal Game of Ur, an ancient
 * two-player Mesopotamian board game dating back to 300 BC.
 * @namespace RoyalGameOfUr
 * @author Justin Keung
 * @version 1.0
 */

const RoyalGameOfUr = Object.create(null);

// const COLUMNS = 8;
// const ROWS = 3;
const PIECES_PER_PLAYER = 7;

const COMBAT_ZONE = [
    [0, 1],
    [1, 1],
    [2, 1],
    [3, 1],
    [4, 1],
    [5, 1],
    [6, 1],
    [7, 1]
];

const PLAYER_1_PATH = [
    [4, 0], // One tile before the starting tile of player 1
    [3, 0],
    [2, 0],
    [1, 0],
    [0, 0],
    ...COMBAT_ZONE,
    [7, 0],
    [6, 0],
    [5, 0] // One tile after the finishing tile of player 1
];

const PLAYER_2_PATH = [
    [4, 2], // One tile before the starting tile of player 2
    [3, 2],
    [2, 2],
    [1, 2],
    [0, 2],
    ...COMBAT_ZONE,
    [7, 2],
    [6, 2],
    [5, 2] // One tile after the finishing tile of player 2
];

const ROSETTE_TILES = [
    [0, 0],
    [0, 2],
    [3, 1],
    [6, 0],
    [6, 2]
];

const EMPTY_TILES = [
    PLAYER_1_PATH[0],
    PLAYER_1_PATH[PLAYER_1_PATH.length - 1],
    PLAYER_2_PATH[0],
    PLAYER_2_PATH[PLAYER_2_PATH.length - 1]
];

// const PLAYER_1_INITIAL_PIECES = new Array(PIECES_PER_PLAYER).fill(
//     PLAYER_1_PATH[0]
// );
const PLAYER_1_INITIAL_PIECES = R.repeat(PLAYER_1_PATH[0], PIECES_PER_PLAYER);
const PLAYER_2_INITIAL_PIECES = R.repeat(PLAYER_2_PATH[0], PIECES_PER_PLAYER);

const ALL_PLAYERS_INITIAL_PIECES = [
    PLAYER_1_INITIAL_PIECES,
    PLAYER_2_INITIAL_PIECES
];

/**
 * Creates an empty Royal Game of Ur board.
 * @param {number[][][]} allPlayersPieces Array containing two arrays storing
 * the locations of each player's pieces.
 * @param {number} playerToPly The player to ply. Default set to be player 1.
 * @returns {Object} A board object containing information about each player's
 * pieces, as well as which player is making the ply.
 */

RoyalGameOfUr.createBoard = function (
    allPlayersPieces = ALL_PLAYERS_INITIAL_PIECES,
    playerToPly = 1,
    diceValues = [0, 0, 0, 0]
) {
    const board = {};
    allPlayersPieces.forEach(function (playerPieces, playerIndex) {
        const playerID = playerIndex + 1; // 0 indexing
        board[playerID] = playerPieces;
    });
    board.playerToPly = playerToPly;
    board.diceValues = diceValues;
    board.ROSETTE_TILES = ROSETTE_TILES;
    board.EMPTY_TILES = EMPTY_TILES;
    board.COMBAT_ZONE = COMBAT_ZONE;
    return board;
};

/**
 * Determines if the player has any valid moves.
 * @param {number} playerID Either 1 or 2 for games with two players.
 * @param {Object} board Current board to be examined.
 * @returns {boolean} Whether the player has any valid moves.
 */
RoyalGameOfUr.playerHasValidMoves = function (playerID, board) {
    const diceValues = board.diceValues;
    const totalDiceValue = RoyalGameOfUr.sumDiceValues(diceValues);
    if (totalDiceValue === 0) {
        return false;
    }
    const playerPieces = board[playerID];
    return playerPieces.some(function (piece) {
        const plyedBoard = RoyalGameOfUr.ply(playerID, piece, board);
        return !equalBoards(board, plyedBoard);
    });
};

/**
 * Determines if the player can move a particular piece.
 * @param {number} playerID Either 1 or 2 for games with two players.
 * @param {number[]} piece Piece to be examined, represented by its location.
 * @param {Object} board Current board to be examined.
 * @returns {boolean} Whether the player can move the specified piece.
 */
RoyalGameOfUr.pieceHasValidMoves = function (
    playerID,
    piece,
    board
) {
    const newTileVector = getNewTileVector(playerID, piece, board);
    const playerPieces = board[playerID];
    const opponentPieces = board[3 - playerID];
    const pathOfPlayer = getPathOfPlayer(playerID);
    const playerLastTilePlusOne = pathOfPlayer[pathOfPlayer.length - 1];
    // Out of bounds checking
    if (newTileVector === undefined) {
        return false;
    }
    // Player cannot ply pieces that does not belong to them
    if (!includesVector(playerPieces, piece)) {
        return false;
    }
    // If the future tile is occupied by another piece by the same player
    // and the future tile is not one tile beyond the last tile,
    // i.e. if the player were to ply the piece,
    // the piece would be moved off the board
    if (
        includesVector(playerPieces, newTileVector)
        && !equalVectors(playerLastTilePlusOne, newTileVector)
    ) {
        return false;
    }
    // Players cannot knock another piece on a rosette tile off the board
    if (
        RoyalGameOfUr.tileIsRosette(newTileVector)
        && includesVector(opponentPieces, newTileVector)
    ) {
        return false;
    }
    return true;
};

/**
 * Determines if a piece landed on a rosette tile after moving.
 * In theory this is an impure function but ROSETTE_TILES is not meant to be
 * mutated, so the same input should always lead to the same output and thus
 * the function is "pure" in this sense.
 * @param {number[]} piece Piece to be examined, represented by its location.
 * @param {Object} board Current board to be examined.
 * @returns {boolean} Whether the piece landed on a rosette tile after moving.
 */
RoyalGameOfUr.pieceLandedOnRosette = function (piece) {
    return includesVector(ROSETTE_TILES, piece);
};

/**
 * Counts the number of pieces at home for the player,
 * i.e. pieces waiting to moved onto the board.
 * @param {number} playerID Either 1 or 2 for games with two players.
 * @param {Object} board The current board.
 * @returns {number} Number of pieces at home for the player.
 */
RoyalGameOfUr.piecesAtHome = function (playerID, board) {
    let playerPath;
    if (playerID === 1) {
        playerPath = PLAYER_1_PATH;
    }
    if (playerID === 2) {
        playerPath = PLAYER_2_PATH;
    }
    const playerPieces = board[playerID];
    const homeLocation = playerPath[0];
    const piecesAtHome = playerPieces.filter(function (piece) {
        return piece === homeLocation;
    });
    return piecesAtHome.length;
};

/**
 * Counts the number of scored pieces for the player,
 * i.e. pieces that have been moved off the board.
 * @param {number} playerID Either 1 or 2 for games with two players.
 * @param {Object} board The current board.
 * @returns {number} Number of scored pieces for the player.
 */
RoyalGameOfUr.piecesScored = function (playerID, board) {
    let playerPath;
    if (playerID === 1) {
        playerPath = PLAYER_1_PATH;
    }
    if (playerID === 2) {
        playerPath = PLAYER_2_PATH;
    }
    const playerPieces = board[playerID];
    const scoredLocation = playerPath[playerPath.length - 1];
    const piecesScored = playerPieces.filter(function (piece) {
        return piece === scoredLocation;
    });
    return piecesScored.length;
};

/**
 * Determines if a tile is a rosette tile.
 * @param {number[]} vector Vector location of the tile.
 * @returns {boolean} Whether the tile is a rosette tile.
 */
RoyalGameOfUr.tileIsRosette = function (vector) {
    return includesVector(ROSETTE_TILES, vector);
};

/**
 * Determines if a tile is empty, i.e. off the board.
 * @param {number[]} vector Vector location of the tile.
 * @returns {boolean} Whether the tile is empty.
 */
RoyalGameOfUr.tileIsEmpty = function (vector) {
    return includesVector(EMPTY_TILES, vector);
};

/* Do something like this in the unit test
player1Pieces[0] = [9,9];
console.log(player1Pieces);
*/

/**
 * Makes a ply.
 * @param {*} playerID Player making the ply.
 * @param {*} piece Piece to be plyed.
 * @param {*} board Current board.
 * @returns {Object} New board which describes the state of the game after
 * the ply is made.
 */
RoyalGameOfUr.ply = function (playerID, piece, board) {
    const newTileVector = getNewTileVector(playerID, piece, board);
    if (newTileVector === undefined) {
        return board;
    }
    if (!RoyalGameOfUr.pieceHasValidMoves(playerID, piece, board)) {
        return board;
    }
    const currentPlayerPieces = board[playerID];
    const newPlayerPieces = [...currentPlayerPieces];
    const opponentID = 3 - playerID;
    const currentOpponentPieces = board[opponentID];
    const newOpponentPieces = [...currentOpponentPieces];
    const newBoard = Object.assign({}, board);

    // If the piece would land on a rosette tile
    if (RoyalGameOfUr.tileIsRosette(newTileVector)) {
        newPlayerPieces[
            indexOfVectorInArray(newPlayerPieces, piece)
        ] = newTileVector;
        newBoard[playerID] = newPlayerPieces;
        newBoard.diceValues = [0, 0, 0, 0];
        return newBoard;
    }

    // Moves the piece to the new tile location
    // Unit test this to make sure currentPlayerPieces is not mutated
    newPlayerPieces[
        indexOfVectorInArray(newPlayerPieces, piece)
    ] = newTileVector;
    if (includesVector(currentOpponentPieces, newTileVector)) {
        const pathOfOpponent = getPathOfPlayer(opponentID);
        newOpponentPieces[
            indexOfVectorInArray(newOpponentPieces, newTileVector)
        ] = pathOfOpponent[0];
    }

    const nextPlayerToPly = 3 - board.playerToPly;
    newBoard[playerID] = newPlayerPieces;
    newBoard[opponentID] = newOpponentPieces;
    newBoard.playerToPly = nextPlayerToPly;
    newBoard.diceValues = [0, 0, 0, 0];
    return newBoard;
};

/**
 * Skips a ply if the player cannot make any moves.
 * @param {Object} board Board to be examined.
 * @returns A new board
 */
RoyalGameOfUr.pass = function (board) {
    const newBoard = Object.assign({}, board);
    const nextPlayerToPly = 3 - board.playerToPly;
    newBoard.playerToPly = nextPlayerToPly;
    return newBoard;
};

/**
 * Determines if the game has ended.
 * @param {Object} board The board to be examined.
 * @returns {boolean} Whether the game has ended.
 */
RoyalGameOfUr.isEnded = function (board) {
    // JSLint throws a warning if I directly do [1, 2].some()
    const playerIDs = [1, 2];
    return playerIDs.some(function (playerID) {
        const playerPieces = board[playerID];
        const playerPath = getPathOfPlayer(playerID);
        const lastTile = playerPath[playerPath.length - 1];
        return playerPieces.every(function (piece) {
            return equalVectors(lastTile, piece);
        });
    });
};

/**
 * Turns the board into a string in the form of a 2D matrix for debugging.
 * @param {Object} board The board to be printed.
 * @returns {String} The printable 2D matrix representation of the board.
 */
RoyalGameOfUr.toString = function (board) {
    const boardMatrix = [
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0]
    ];
    [1, 2].forEach(function (playerID) {
        const playerPieces = board[playerID];
        playerPieces.forEach(function (piece) {
            const xCoordinateOfPiece = piece[0];
            const yCoordinateOfPiece = piece[1];
            boardMatrix[yCoordinateOfPiece][xCoordinateOfPiece] = playerID;
        });
    });
    board.EMPTY_TILES.forEach(function (emptyTile) {
        const xCoordinateOfEmptyTile = emptyTile[0];
        const yCoordinateOfEmptyTile = emptyTile[1];
        boardMatrix[yCoordinateOfEmptyTile][xCoordinateOfEmptyTile] = " ";
    });
    let boardString = "\n";
    boardMatrix.forEach(function (row, index) {
        let rowString = row.join(" ");
        if (index < boardMatrix.length) {
            rowString += "\n";
        }
        boardString += rowString;
    });
    return boardString;
};

// Returns the vector location of the tile, if the piece can be successfully
// moved to the new location
const getNewTileVector = function (playerID, piece, board) {
    const currentTileIndex = getIndexOnPath(playerID, piece, board);
    if (currentTileIndex < 0) {
        return undefined;
    }
    const diceValues = board.diceValues;
    const totalDiceValue = RoyalGameOfUr.sumDiceValues(diceValues);
    const newTileIndexAlongPath = currentTileIndex + totalDiceValue;
    const pathOfPlayer = getPathOfPlayer(playerID);
    return pathOfPlayer[newTileIndexAlongPath];
};

// Given the vector location of the tile, returns the index along a certain
// player's path
const getIndexOnPath = function (playerID, vector) {
    const pathOfPlayer = getPathOfPlayer(playerID);
    let indexOnPath = -1;
    pathOfPlayer.forEach(function (tile, index) {
        if (equalVectors(tile, vector)) {
            indexOnPath = index;
        }
    });
    return indexOnPath;
};

const getPathOfPlayer = function (playerID) {
    if (playerID === 1) {
        return PLAYER_1_PATH;
    }
    if (playerID === 2) {
        return PLAYER_2_PATH;
    }
    return undefined;
};

const includesVector = function (array, vector) {
    return array.some(function (vectorElement) {
        return equalVectors(vectorElement, vector);
    });
};

const indexOfVectorInArray = function (array, vector) {
    let result = -1;
    if (array === undefined || vector === undefined) {
        return result;
    }
    array.forEach(function (vectorElement, index) {
        if (equalVectors(vectorElement, vector)) {
            result = index;
        }
    });
    return result;
};

const equalVectors = function (vector1, vector2) {
    const xCoordinateOfVector1 = vector1[0];
    const yCoordinateOfVector1 = vector1[1];
    const xCoordinateOfVector2 = vector2[0];
    const yCoordinateOfVector2 = vector2[1];
    return (
        xCoordinateOfVector1 === xCoordinateOfVector2
        && yCoordinateOfVector1 === yCoordinateOfVector2
    );
};

const equalDice = function (dice1, dice2) {
    return dice1.every(function (die1Value, index) {
        const die2Value = dice2[index];
        return die1Value === die2Value;
    });
};

const equalBoards = function (board1, board2) {
    if (
        board1.length !== board2.length ||
        !RoyalGameOfUr.equalVectorArrays(board1[1], board2[1]) ||
        !RoyalGameOfUr.equalVectorArrays(board1[2], board2[2]) ||
        !equalDice(board1.diceValues, board2.diceValues) ||
        board1.playerToPly !== board2.playerToPly
    ) {
        return false;
    }
    return true;
};

/**
 * Determines whether two arrays containing solely vectors have identical
 * elements.
 * @param {number[][]} array1 First input vector array.
 * @param {number[][]} array2 Second input vector array.
 * @returns {boolean} Whether the two input arrays contain identical elements.
 */
RoyalGameOfUr.equalVectorArrays = function (array1, array2) {
    if (array1 === array2) {
        return true;
    }
    if (array1 === null || array2 === null) {
        return false;
    }
    if (array1.length !== array2.length) {
        return false;
    }

    // To avoid modifying the input arrays when sorting
    const array1Duplicate = [...array1];
    const array2Duplicate = [...array2];
    array1Duplicate.sort();
    array2Duplicate.sort();

    return array1Duplicate.every(function (vector1, index) {
        const vector2 = array2Duplicate[index];
        return equalVectors(vector1, vector2);
    });
};

const rollOneDie = function () {
    return Math.floor(Math.random() * 2);
};

/**
 * Rolls a set of four dice randomly. The possible values are from 0 to 4 and
 * should follow a binomial distribution. Note that this is an impure function
 * since the same input may lead to different outputs.
 * @param {Object} board The current state of the board.
 * @returns {number[]} An array of four numbers, each being either 0 or 1.
 * The sum of these four values represent the number of steps the player can
 * make in the ply.
 */
RoyalGameOfUr.rollDice = function (board) {
    const newBoard = Object.assign({}, board);
    newBoard.diceValues = [
        rollOneDie(),
        rollOneDie(),
        rollOneDie(),
        rollOneDie()
    ];
    return newBoard;
};

/**
 * Sums the values of the four dice.
 * @param {number[]} diceValues Array containing values of the four dice.
 * @returns {number} The total value of the four dice.
 */
RoyalGameOfUr.sumDiceValues = function (diceValues) {
    return diceValues.reduce((
        previousDieValue,
        currentDieValue
    ) => previousDieValue + currentDieValue, 0);
};

export default Object.freeze(RoyalGameOfUr);