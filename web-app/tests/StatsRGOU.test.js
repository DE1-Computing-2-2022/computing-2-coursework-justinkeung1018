import RoyalGameOfUr from "../common/RoyalGameOfUr.js";
import StatsRGOU from "../server/StatsRGOU.js";

const isDescending = function (someStats) {
    return someStats.every(function (player, index) {
        const playerWins = player[1];
        if (index === someStats.length - 1) {
            return true;
        }
        const nextPlayerWins = someStats[index + 1][1];
        return playerWins >= nextPlayerWins;
    });
};

describe("Fetching the top five players", function () {
    describe("When there are no previous players", function () {
        const allPlayersStats = {};
        const top5Stats = StatsRGOU.getTop5Stats(allPlayersStats);
        it("It should return an empty array", function () {
            if (top5Stats.length !== 0) {
                throw new Error(
                    "It currently returns " +
                    `${top5Stats}, ` +
                    "but it should return an array of length 0."
                );
            }
        });
    });
    describe("When there are less than five players in total", function () {
        const allPlayersStats = {
            "Justin": 0,
            "Ian": 1
        };
        const top5Stats = StatsRGOU.getTop5Stats(allPlayersStats);
        const expectedTop5Stats = [["Ian", 1], ["Justin", 0]];
        it(
            "It should return an array with the same length as the object",
            function () {
                if (top5Stats.length !== 2) {
                    throw new Error(
                        "It currently returns " +
                        `${top5Stats}, ` +
                        "but it should return an array of length 2."
                    );
                }
            }
        );
        it("It should return a sorted array in descending order", function () {
            const descending = top5Stats.every(function (player, index) {
                const playerWins = player[1];
                if (index === top5Stats.length - 1) {
                    return true;
                }
                const nextPlayerWins = top5Stats[index + 1][1];
                return playerWins >= nextPlayerWins;
            });
            if (!descending) {
                throw new Error(
                    `It currently returns ${top5Stats}, ` +
                    `but it should return ${expectedTop5Stats}.`
                );
            }
        });
    });
    describe("When there are more than five players in total", function () {
        const allPlayersStats = {
            "Ian": 3,
            "Justin": 0,
            "Jeremy": 10,
            "Pop": 20,
            "Michael": 2,
            "Felix": 6
        };
        const top5Stats = StatsRGOU.getTop5Stats(allPlayersStats);
        const expectedTop5Stats = [
            ["Pop", 20],
            ["Jeremy", 10],
            ["Felix", 6],
            ["Ian", 3],
            ["Michael", 2]
        ];
        it(
            "It should return an array of length 5",
            function () {
                if (top5Stats.length !== 5) {
                    throw new Error(
                        `It currently returns ${top5Stats}, ` +
                        "but it should return an array of length 5."
                    );
                }
            }
        );
        it("It should return a sorted array in descending order", function () {
            const descending = isDescending(top5Stats);
            if (!descending) {
                throw new Error(
                    `It currently returns ${top5Stats}, ` +
                    `but it should return ${expectedTop5Stats}.`
                );
            }
        });
    });
});

describe("Recording a game", function () {
    describe("When there are no previous games", function () {
        it("The winner should have 1 win", function () {

        });
        it("The loser should have 0 wins", function () {

        });
    });
    describe("When there are previous games", function () {
        describe("When an existing player and a new player plays", function () {
            describe("When the existing player wins", function () {
                it("The existing player should have 1 more win", function () {

                });
                it("The new player should have 0 wins", function () {

                });
            });
            describe("When the new player wins", function () {
                it("The new player should have 1 win", function () {

                });
                it(
                    "The existing player should have " +
                    "the same number of wins as before",
                    function () {

                    }
                );
            });
        });
        describe("When two existing players play", function () {
            StatsRGOU.clearStats();
            StatsRGOU.addStats({
                "Ian": 1,
                "Justin": 0
            });
            const board = RoyalGameOfUr.createBoard(
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
                        [5, 2],
                        [5, 2],
                        [5, 2],
                        [5, 2],
                        [5, 2],
                        [5, 2],
                        [5, 2]
                    ]
                ],
                1, //playerToPly
                [0, 0, 0, 0] // diceValues
            );
            StatsRGOU.recordGame("Ian", "Justin", board); // Player 2 won
            const allPlayersStats = StatsRGOU.getAllPlayersStats();
            it("The winner should have 1 more win", function () {
                const player2Wins = allPlayersStats.Justin;
                if (player2Wins !== 1) {
                    throw new Error(
                        `Player 2 currently has ${player2Wins} wins, ` +
                        "but they should have 1 win."
                    );
                }
            });
            it(
                "The loser should have the same number of wins as before",
                function () {
                    const player1Wins = allPlayersStats.Ian;
                    if (player1Wins !== 1) {
                        throw new Error(
                            `Player 1 currently has ${player1Wins} wins, ` +
                            "but they should have 1 win."
                        );
                    }
                }
            );
        });
        describe("When two new players play", function () {
            StatsRGOU.clearStats();
            StatsRGOU.addStats({
                "Freddie": 1,
                "Sam": 0
            });
            const board = RoyalGameOfUr.createBoard(
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
                        [5, 2],
                        [5, 2],
                        [5, 2],
                        [5, 2],
                        [5, 2],
                        [5, 2],
                        [5, 2]
                    ]
                ],
                1, //playerToPly
                [0, 0, 0, 0] // diceValues
            );
            StatsRGOU.recordGame("Ian", "Justin", board); // Player 2 won
            const allPlayersStats = StatsRGOU.getAllPlayersStats();
            it("The winner should have 1 win", function () {
                const player2Wins = allPlayersStats.Justin;
                if (player2Wins !== 1) {
                    throw new Error(
                        `Player 2 currently has ${player2Wins} wins, ` +
                        "but they should have 1 win."
                    );
                }
            });
            it("The loser should have 0 wins", function () {
                const player1Wins = allPlayersStats.Ian;
                if (player1Wins !== 0) {
                    throw new Error(
                        `Player 1 currently has ${player1Wins} wins, ` +
                        "but they should have 1 win."
                    );
                }
            });
        });
    });
});