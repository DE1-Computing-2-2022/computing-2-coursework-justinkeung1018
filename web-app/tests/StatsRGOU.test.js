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
        StatsRGOU.clearStats();
        const allPlayersStats = {};
        const top5Stats = StatsRGOU.getTop5Stats(allPlayersStats);
        StatsRGOU.clearStats();
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
        StatsRGOU.clearStats();
        const allPlayersStats = {
            "Justin": 0,
            "Ian": 1
        };
        StatsRGOU.addStats(allPlayersStats);
        const top5Stats = StatsRGOU.getTop5Stats(allPlayersStats);
        const expectedTop5Stats = [["Ian", 1], ["Justin", 0]];
        StatsRGOU.clearStats();
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
        StatsRGOU.clearStats();
        const allPlayersStats = {
            "Ian": 3,
            "Justin": 0,
            "Jeremy": 10,
            "Pop": 20,
            "Michael": 2,
            "Felix": 6
        };
        StatsRGOU.addStats(allPlayersStats);
        const top5Stats = StatsRGOU.getTop5Stats(allPlayersStats);
        const expectedTop5Stats = [
            ["Pop", 20],
            ["Jeremy", 10],
            ["Felix", 6],
            ["Ian", 3],
            ["Michael", 2]
        ];
        StatsRGOU.clearStats();
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
        StatsRGOU.clearStats();
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
        StatsRGOU.clearStats();
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
                    "but they should have 0 wins." +
                    `${Object.keys(allPlayersStats)}`
                );
            }
        });
    });
    describe("When there are previous games", function () {
        describe("When an existing player and a new player plays", function () {
            describe("When the existing player wins", function () {
                StatsRGOU.clearStats();
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
                StatsRGOU.recordGame("Justin", "Ian", board); // Ian won
                StatsRGOU.recordGame("Freddie", "Ian", board); // Ian won again
                const allPlayerStats = StatsRGOU.getAllPlayersStats();
                StatsRGOU.clearStats();
                it("The existing player should have 1 more win", function () {
                    const ianWins = allPlayerStats.Ian;
                    if (ianWins !== 2) {
                        throw new Error(
                            `Ian currently has ${ianWins} wins, ` +
                            "but he should have 2 wins."
                        );
                    }
                });
                it("The new player should have 0 wins", function () {
                    const freddieWins = allPlayerStats.Freddie;
                    if (freddieWins !== 0) {
                        throw new Error(
                            `Freddie currently has ${freddieWins} wins, ` +
                            "but he should have 0 wins."
                        );
                    }
                });
            });
            describe("When the new player wins", function () {
                StatsRGOU.clearStats();
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
                StatsRGOU.recordGame("Justin", "Ian", board); // Ian won
                StatsRGOU.recordGame("Justin", "Ian", board); // Ian won again
                StatsRGOU.recordGame("Ian", "Freddie", board); // Freddie won
                const allPlayerStats = StatsRGOU.getAllPlayersStats();
                StatsRGOU.clearStats();
                it("The new player should have 1 win", function () {
                    const freddieWins = allPlayerStats.Freddie;
                    if (freddieWins !== 1) {
                        throw new Error(
                            `Freddie currently has ${freddieWins} wins, ` +
                            "but he should have 1 win."
                        );
                    }
                });
                it(
                    "The existing player should have " +
                    "the same number of wins as before",
                    function () {
                        const ianWins = allPlayerStats.Ian;
                        if (ianWins !== 2) {
                            throw new Error(
                                `Ian currently has ${ianWins} wins, ` +
                                "but he should have 2 wins."
                            );
                        }
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
            StatsRGOU.recordGame("Justin", "Ian", board); // Player 2 won
            const allPlayersStats = StatsRGOU.getAllPlayersStats();
            StatsRGOU.clearStats();
            it("The winner should have 1 more win", function () {
                const player2Wins = allPlayersStats.Ian;
                if (player2Wins !== 2) {
                    throw new Error(
                        `Player 2 currently has ${player2Wins} wins, ` +
                        "but they should have 2 wins."
                    );
                }
            });
            it(
                "The loser should have the same number of wins as before",
                function () {
                    const player1Wins = allPlayersStats.Justin;
                    if (player1Wins !== 0) {
                        throw new Error(
                            `Player 1 currently has ${player1Wins} wins, ` +
                            "but they should have 0 wins."
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
            StatsRGOU.clearStats();
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