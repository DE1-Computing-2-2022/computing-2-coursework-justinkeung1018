import RoyalGameOfUr from "../common/RoyalGameOfUr.js";

/**
 * StatsRGOU is a module to load and save game stats for Royal Game of Ur games.
 * @namespace StatsRGOU
 * @author Justin Keung
 * @version 1.0
 */
const StatsRGOU = Object.create(null);

let allPlayersStats = {};

/**
 * Fetches the five players with the most games won.
 * @returns {Array} Array containing the names and games won of the top five
 * players.
 */
StatsRGOU.getTop5Stats = function () {
    const statsArray = Object.entries(allPlayersStats);
    const descendingArray = statsArray.sort(function (prevPlayer, currPlayer) {
        return currPlayer[1] - prevPlayer[1];
    });
    return descendingArray.slice(0, 5);
};

/**
 * Updates the statistics after a game is finished.
 * @param {string} player1Name Name of player 1.
 * @param {string} player2Name Name of player 2.
 * @param {Object} board Board right after game is finished.
 */
StatsRGOU.recordGame = function (player1Name, player2Name, board) {
    if (!RoyalGameOfUr.isEnded(board)) {
        return undefined;
    }
    const playerToPly = board.playerToPly;
    const winner = 3 - playerToPly;
    const player1Wins = allPlayersStats[player1Name] || 0;
    const player2Wins = allPlayersStats[player2Name] || 0;
    const updatedStats = {};
    if (winner === 1) {
        updatedStats[player1Name] = player1Wins + 1;
        updatedStats[player2Name] = player2Wins;
        allPlayersStats = Object.assign(allPlayersStats, updatedStats);
    }
    if (winner === 2) {
        updatedStats[player1Name] = player1Wins;
        updatedStats[player2Name] = player2Wins + 1;
        allPlayersStats = Object.assign(allPlayersStats, updatedStats);
    }
};

/**
 * Clears the statistics for all players.
 */
StatsRGOU.clearStats = function () {
    allPlayersStats = {};
};

/* Methods below are solely for unit testing purposes */

/**
 * Manually adds statistics to the server.
 * Only for unit testing purposes.
 * @param {Object} stats Player statistics to be manually added.
 */
StatsRGOU.addStats = function (stats) {
    allPlayersStats = Object.assign(allPlayersStats, stats);
};

/**
 * Getter function for the stats of all players.
 * Only for unit testing purposes.
 * @returns {Object} Object containing the stats of all players.
 */
StatsRGOU.getAllPlayersStats = function () {
    return allPlayersStats;
};

export default Object.freeze(StatsRGOU);