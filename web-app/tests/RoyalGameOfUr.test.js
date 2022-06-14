import RoyalGameOfUr from "../common/RoyalGameOfUr.js";

describe("Making a ply", function () {
    describe("When the piece would land on a rosette tile", function () {
        describe("If the rosette tile is occupied", function () {
            describe("By the same player in the combat zone", function () {
                const beforeBoard = RoyalGameOfUr.createBoard(
                    [
                        [
                            [0, 1], // Piece to be plyed
                            [3, 1], // Rosette tile
                            [4, 0],
                            [4, 0],
                            [4, 0],
                            [4, 0],
                            [4, 0]
                        ],
                        [
                            [4, 2],
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
                    [0, 1], // piece
                    beforeBoard
                );
                it("All pieces should be unchanged", function () {
                    if (!RoyalGameOfUr.equalVectorArrays(
                        afterBoard[1],
                        beforeBoard[1]
                    )) {
                        throw new Error(
                            "Player 1's pieces should not have changed. " +
                            "Player 1's pieces are " +
                            `${afterBoard[1]}, ` +
                            "but they should be " +
                            `${beforeBoard[1]}.`
                        );
                    }
                    if (!RoyalGameOfUr.equalVectorArrays(
                        afterBoard[2],
                        beforeBoard[2]
                    )) {
                        throw new Error(
                            "Player 2's pieces should not have changed. " +
                            "Player 1's pieces are " +
                            `${afterBoard[2]}, ` +
                            "but they should be " +
                            `${beforeBoard[2]}.`
                        );
                    }
                });
                it(
                    "The next player to ply should still be the same player",
                    function () {
                        if (afterBoard.playerToPly !== 1) {
                            throw new Error(
                                "Next player to ply is currently " +
                                `player ${afterBoard.playerToPly}, ` +
                                "but it should be player 1."
                            );
                        }
                    }
                );
                it("The total dice value should be unchanged", function () {
                    const diceValues = afterBoard.diceValues;
                    const totalDiceValue = RoyalGameOfUr.sumDiceValues(
                        diceValues
                    );
                    if (totalDiceValue !== 3) {
                        throw new Error(
                            "Total dice value is currently " +
                            `${totalDiceValue}, ` +
                            "but it should be 3."
                        );
                    }
                });
            });
            describe("By the same player not in the combat zone", function () {
                const beforeBoard = RoyalGameOfUr.createBoard(
                    [
                        [
                            [4, 0], // Piece to be plyed
                            [0, 0], // Rosette tile
                            [4, 0],
                            [4, 0],
                            [4, 0],
                            [4, 0],
                            [4, 0]
                        ],
                        [
                            [4, 2],
                            [4, 2],
                            [4, 2],
                            [4, 2],
                            [4, 2],
                            [4, 2],
                            [4, 2]
                        ]
                    ],
                    1, //playerToPly
                    [1, 1, 1, 1] // diceValues
                );
                const afterBoard = RoyalGameOfUr.ply(
                    1, // playerID
                    [4, 0], // piece
                    beforeBoard
                );
                it("All pieces should be unchanged", function () {
                    if (!RoyalGameOfUr.equalVectorArrays(
                        afterBoard[1],
                        beforeBoard[1]
                    )) {
                        throw new Error(
                            "Player 1's pieces are " +
                            `${afterBoard[1]}, ` +
                            "but they should be " +
                            `${beforeBoard[1]}.`
                        );
                    }
                    if (!RoyalGameOfUr.equalVectorArrays(
                        afterBoard[2],
                        beforeBoard[2]
                    )) {
                        throw new Error(
                            "Player 2's pieces are " +
                            `${afterBoard[2]}, ` +
                            "but they should be " +
                            `${beforeBoard[2]}.`
                        );
                    }
                });
                it(
                    "The next player to ply should still be the same player",
                    function () {
                        if (afterBoard.playerToPly !== 1) {
                            throw new Error(
                                "Next player to ply is currently " +
                                `player ${afterBoard.playerToPly}, ` +
                                "but it should be player 1."
                            );
                        }
                    }
                );
                it("The total dice value should be unchanged", function () {
                    const diceValues = afterBoard.diceValues;
                    const totalDiceValue = RoyalGameOfUr.sumDiceValues(
                        diceValues
                    );
                    if (totalDiceValue !== 4) {
                        throw new Error(
                            "Total dice value is currently " +
                            `${totalDiceValue}, ` +
                            "but it should be 4."
                        );
                    }
                });
            });
            describe("By the opponent", function () {
                const beforeBoard = RoyalGameOfUr.createBoard(
                    [
                        [
                            [1, 1], // Piece to be plyed
                            [4, 0],
                            [4, 0],
                            [4, 0],
                            [4, 0],
                            [4, 0],
                            [4, 0]
                        ],
                        [
                            [3, 1], // Rosette tile
                            [4, 2],
                            [4, 2],
                            [4, 2],
                            [4, 2],
                            [4, 2],
                            [4, 2]
                        ]
                    ],
                    1, //playerToPly
                    [0, 1, 0, 1] // diceValues
                );
                const afterBoard = RoyalGameOfUr.ply(
                    1, // playerID
                    [1, 1], // piece
                    beforeBoard
                );
                it("All pieces should be unchanged", function () {
                    if (!RoyalGameOfUr.equalVectorArrays(
                        afterBoard[1],
                        beforeBoard[1]
                    )) {
                        throw new Error(
                            "Player 1's pieces should not have changed. " +
                            "Player 1's pieces are " +
                            `${afterBoard[1]}, ` +
                            "but they should be " +
                            `${beforeBoard[1]}.`
                        );
                    }
                    if (!RoyalGameOfUr.equalVectorArrays(
                        afterBoard[2],
                        beforeBoard[2]
                    )) {
                        throw new Error(
                            "Player 2's pieces should not have changed. " +
                            "Player 2's pieces are " +
                            `${afterBoard[2]}, ` +
                            "but they should be " +
                            `${beforeBoard[2]}.`
                        );
                    }
                });
                it(
                    "The next player to ply should still be the same player",
                    function () {
                        if (afterBoard.playerToPly !== 1) {
                            throw new Error(
                                "Next player to ply is currently " +
                                `player ${afterBoard.playerToPly}, ` +
                                "but it should be player 1."
                            );
                        }
                    }
                );
                it("The total dice value should be unchanged", function () {
                    const diceValues = afterBoard.diceValues;
                    const totalDiceValue = RoyalGameOfUr.sumDiceValues(
                        diceValues
                    );
                    if (totalDiceValue !== 2) {
                        throw new Error(
                            "Total dice value is currently " +
                            `${totalDiceValue}, ` +
                            "but it should be 2."
                        );
                    }
                });
            });
        });
        describe("If the rosette tile is not occupied", function () {
            const beforeBoard = RoyalGameOfUr.createBoard(
                [
                    [
                        [1, 1], // Piece to be plyed
                        [4, 0],
                        [4, 0],
                        [4, 0],
                        [4, 0],
                        [4, 0],
                        [4, 0]
                    ],
                    [
                        [4, 2],
                        [4, 2],
                        [4, 2],
                        [4, 2],
                        [4, 2],
                        [4, 2],
                        [4, 2]
                    ]
                ],
                1, //playerToPly
                [0, 1, 0, 1] // diceValues
            );
            const afterBoard = RoyalGameOfUr.ply(
                1, // playerID
                [1, 1], // piece
                beforeBoard
            );
            const player1Pieces = afterBoard[1];
            const expectedPlayer1Pieces = [
                [3, 1], // Moved to rosette tile
                [4, 0],
                [4, 0],
                [4, 0],
                [4, 0],
                [4, 0],
                [4, 0]
            ];
            const expectedPlayer2Pieces = [
                [4, 2],
                [4, 2],
                [4, 2],
                [4, 2],
                [4, 2],
                [4, 2],
                [4, 2]
            ];
            const expectedBoard = RoyalGameOfUr.createBoard(
                [
                    expectedPlayer1Pieces,
                    expectedPlayer2Pieces
                ],
                1, // playerToPly
                [0, 0, 0, 0] // diceValues
            );
            it("The piece should be moved to the rosette tile", function () {
                if (!RoyalGameOfUr.equalVectorArrays(
                    player1Pieces,
                    expectedPlayer1Pieces
                )) {
                    throw new Error(
                        "The board after the ply is " +
                        `${RoyalGameOfUr.toString(afterBoard)}, ` +
                        "but it should be " +
                        `${RoyalGameOfUr.toString(expectedBoard)}.`
                    );
                }
            });
            it(
                "The next player to ply should still be the same player",
                function () {
                    if (afterBoard.playerToPly !== 1) {
                        throw new Error(
                            "Next player to ply is currently " +
                            `player ${afterBoard.playerToPly}, ` +
                            "but it should be player 2."
                        );
                    }
                }
            );
            it("The total dice value should be reset to 0", function () {
                const diceValues = afterBoard.diceValues;
                const totalDiceValue = RoyalGameOfUr.sumDiceValues(
                    diceValues
                );
                if (totalDiceValue !== 0) {
                    throw new Error(
                        "Total dice value is currently " +
                        `${totalDiceValue}, ` +
                        "but it should be 0."
                    );
                }
            });
        });
    });
    describe("When the piece would land on a regular tile", function () {
        describe("If the regular tile is occupied", function () {
            describe("By the same player", function () {
                const beforeBoard = RoyalGameOfUr.createBoard(
                    [
                        [
                            [1, 0], // Piece to be plyed
                            [1, 1], // Piece occupying regular tile
                            [4, 0],
                            [4, 0],
                            [4, 0],
                            [4, 0],
                            [4, 0]
                        ],
                        [
                            [4, 2],
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
                    [1, 0], // piece
                    beforeBoard
                );
                it("All pieces should be unchanged", function () {
                    if (!RoyalGameOfUr.equalVectorArrays(
                        afterBoard[1],
                        beforeBoard[1]
                    )) {
                        throw new Error(
                            "Player 1's pieces should not have changed. " +
                            "Player 1's pieces are " +
                            `${afterBoard[1]}, ` +
                            "but they should be " +
                            `${beforeBoard[1]}.`
                        );
                    }
                    if (!RoyalGameOfUr.equalVectorArrays(
                        afterBoard[2],
                        beforeBoard[2]
                    )) {
                        throw new Error(
                            "Player 2's pieces should not have changed. " +
                            "Player 1's pieces are " +
                            `${afterBoard[2]}, ` +
                            "but they should be " +
                            `${beforeBoard[2]}.`
                        );
                    }
                });
                it(
                    "The next player to ply should still be the same player",
                    function () {
                        if (afterBoard.playerToPly !== 1) {
                            throw new Error(
                                "Next player to ply is currently " +
                                `player ${afterBoard.playerToPly}, ` +
                                "but it should be player 1."
                            );
                        }
                    }
                );
                it("The total dice value should be unchanged", function () {
                    const diceValues = afterBoard.diceValues;
                    const totalDiceValue = RoyalGameOfUr.sumDiceValues(
                        diceValues
                    );
                    if (totalDiceValue !== 3) {
                        throw new Error(
                            "Total dice value is currently " +
                            `${totalDiceValue}, ` +
                            "but it should be 0."
                        );
                    }
                });
            });
            describe("By the opponent", function () {
                const beforeBoard = RoyalGameOfUr.createBoard(
                    [
                        [
                            [1, 0], // Piece to be plyed
                            [4, 0],
                            [4, 0],
                            [4, 0],
                            [4, 0],
                            [4, 0],
                            [4, 0]
                        ],
                        [
                            [1, 1], // Piece occupying regular tile
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
                    [1, 0], // piece
                    beforeBoard
                );
                const player1Pieces = afterBoard[1];
                const player2Pieces = afterBoard[2];
                const expectedPlayer1Pieces = [
                    [1, 1], // Moved to the new tile
                    [4, 0],
                    [4, 0],
                    [4, 0],
                    [4, 0],
                    [4, 0],
                    [4, 0]
                ];
                const expectedPlayer2Pieces = [
                    [4, 2], // Knocked off board
                    [4, 2],
                    [4, 2],
                    [4, 2],
                    [4, 2],
                    [4, 2],
                    [4, 2]
                ];
                const expectedBoard = RoyalGameOfUr.createBoard(
                    [
                        expectedPlayer1Pieces,
                        expectedPlayer2Pieces
                    ],
                    2, // playerToPly
                    [0, 0, 0, 0] // diceValues
                );
                it(
                    "The opponent's piece should be knocked off the board, " +
                    "i.e. sent back to their home",
                    function () {
                        if (!RoyalGameOfUr.equalVectorArrays(
                            player2Pieces,
                            expectedPlayer2Pieces
                        )) {
                            throw new Error(
                                "The board after the ply is " +
                                `${RoyalGameOfUr.toString(afterBoard)}, ` +
                                "but it should be " +
                                `${RoyalGameOfUr.toString(expectedBoard)}.`
                            );
                        }
                    }
                );
                it(
                    "The player's piece should be moved to the new location",
                    function () {
                        if (!RoyalGameOfUr.equalVectorArrays(
                            player1Pieces,
                            expectedPlayer1Pieces
                        )) {
                            throw new Error(
                                "The board after the ply is " +
                                `${RoyalGameOfUr.toString(afterBoard)}, ` +
                                "but it should be " +
                                `${RoyalGameOfUr.toString(expectedBoard)}.`
                            );
                        }
                    }
                );
            });
        });
        describe("If the regular tile is not occupied", function () {
            const beforeBoard = RoyalGameOfUr.createBoard(
                [
                    [
                        [1, 0], // Piece to be plyed
                        [4, 0],
                        [4, 0],
                        [4, 0],
                        [4, 0],
                        [4, 0],
                        [4, 0]
                    ],
                    [
                        [4, 2],
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
                [1, 0], // piece
                beforeBoard
            );
            const player1Pieces = afterBoard[1];
            const player2Pieces = afterBoard[2];
            const expectedPlayer1Pieces = [
                [1, 1], // Moved to the new tile
                [4, 0],
                [4, 0],
                [4, 0],
                [4, 0],
                [4, 0],
                [4, 0]
            ];
            const expectedPlayer2Pieces = [
                [4, 2],
                [4, 2],
                [4, 2],
                [4, 2],
                [4, 2],
                [4, 2],
                [4, 2]
            ];
            const expectedBoard = RoyalGameOfUr.createBoard(
                [
                    expectedPlayer1Pieces,
                    expectedPlayer2Pieces
                ],
                2, // playerToPly
                [0, 0, 0, 0] // diceValues
            );
            it("The piece should be moved to the new location", function () {
                if (!RoyalGameOfUr.equalVectorArrays(
                    player1Pieces,
                    expectedPlayer1Pieces
                )) {
                    throw new Error(
                        "The board after the ply is " +
                        `${RoyalGameOfUr.toString(afterBoard)}, ` +
                        "but it should be " +
                        `${RoyalGameOfUr.toString(expectedBoard)}.`
                    );
                }
            });
            it("The opponent's pieces should be unchanged", function () {
                if (!RoyalGameOfUr.equalVectorArrays(
                    player2Pieces,
                    expectedPlayer2Pieces
                )) {
                    throw new Error(
                        "The board after the ply is " +
                        `${RoyalGameOfUr.toString(afterBoard)}, ` +
                        "but it should be " +
                        `${RoyalGameOfUr.toString(expectedBoard)}.`
                    );
                }
            });
            it("The next player to ply should be the opponent", function () {
                if (afterBoard.playerToPly === 1) {
                    throw new Error(
                        "Next player to ply is currently " +
                        `player ${afterBoard.playerToPly}, ` +
                        "but it should be player 2."
                    );
                }
            });
        });
    });
    describe("When the piece is near the end", function () {
        describe(
            "If the player rolled the right number, " +
            "i.e. such that the piece would land on exactly one tile beyond " +
            "the last tile of the player's path",
            function () {
                const beforeBoard = RoyalGameOfUr.createBoard(
                    [
                        [
                            [7, 0], // Piece to be plyed
                            [4, 0],
                            [4, 0],
                            [4, 0],
                            [4, 0],
                            [4, 0],
                            [4, 0]
                        ],
                        [
                            [4, 2],
                            [4, 2],
                            [4, 2],
                            [4, 2],
                            [4, 2],
                            [4, 2],
                            [4, 2]
                        ]
                    ],
                    1, //playerToPly
                    [0, 1, 1, 0] // diceValues
                );
                const afterBoard = RoyalGameOfUr.ply(
                    1, // playerID
                    [7, 0], // piece
                    beforeBoard
                );
                const player1Pieces = afterBoard[1];
                const expectedPlayer1Pieces = [
                    [5, 0], // Moved off the board
                    [4, 0],
                    [4, 0],
                    [4, 0],
                    [4, 0],
                    [4, 0],
                    [4, 0]
                ];
                const expectedPlayer2Pieces = [
                    [4, 2],
                    [4, 2],
                    [4, 2],
                    [4, 2],
                    [4, 2],
                    [4, 2],
                    [4, 2]
                ];
                const expectedBoard = RoyalGameOfUr.createBoard(
                    [
                        expectedPlayer1Pieces,
                        expectedPlayer2Pieces
                    ],
                    2, // playerToPly
                    [0, 0, 0, 0] // diceValues
                );
                it("The piece should move off the board", function () {
                    if (!RoyalGameOfUr.equalVectorArrays(
                        player1Pieces,
                        expectedPlayer1Pieces
                    )) {
                        throw new Error(
                            "The board after the ply is " +
                            `${RoyalGameOfUr.toString(afterBoard)}, ` +
                            "but it should be " +
                            `${RoyalGameOfUr.toString(expectedBoard)}.`
                        );
                    }
                });
            }
        );
        describe("If the player overshot", function () {
            const beforeBoard = RoyalGameOfUr.createBoard(
                [
                    [
                        [7, 0], // Piece to be plyed
                        [4, 0],
                        [4, 0],
                        [4, 0],
                        [4, 0],
                        [4, 0],
                        [4, 0]
                    ],
                    [
                        [4, 2],
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
                [7, 0], // piece
                beforeBoard
            );
            const player1Pieces = afterBoard[1];
            const expectedPlayer1Pieces = [
                [7, 0], // Not allowed to move off board
                [4, 0],
                [4, 0],
                [4, 0],
                [4, 0],
                [4, 0],
                [4, 0]
            ];
            const expectedPlayer2Pieces = [
                [4, 2],
                [4, 2],
                [4, 2],
                [4, 2],
                [4, 2],
                [4, 2],
                [4, 2]
            ];
            const expectedBoard = RoyalGameOfUr.createBoard(
                [
                    expectedPlayer1Pieces,
                    expectedPlayer2Pieces
                ],
                1, // playerToPly
                [0, 1, 1, 1] // diceValues
            );
            it("The piece should not move off the board", function () {
                if (!RoyalGameOfUr.equalVectorArrays(
                    player1Pieces,
                    expectedPlayer1Pieces
                )) {
                    throw new Error(
                        "The board after the ply is " +
                        `${RoyalGameOfUr.toString(afterBoard)}, ` +
                        "but it should be " +
                        `${RoyalGameOfUr.toString(expectedBoard)}.`
                    );
                }
            });
        });
    });
    describe("When the player does not ply their own pieces", function () {
        describe("When the player selects the opponent's pieces", function () {
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
            it("All pieces should be unchanged", function () {
                if (!RoyalGameOfUr.equalVectorArrays(
                    afterBoard[1],
                    beforeBoard[1]
                )) {
                    throw new Error(
                        "Player 1's pieces should not have changed. " +
                        "Player 1's pieces are " +
                        `${afterBoard[1]}, ` +
                        "but they should be " +
                        `${beforeBoard[1]}.`
                    );
                }
                if (!RoyalGameOfUr.equalVectorArrays(
                    afterBoard[2],
                    beforeBoard[2]
                )) {
                    throw new Error(
                        "Player 2's pieces should not have changed. " +
                        "Player 2's pieces are " +
                        `${afterBoard[2]}, ` +
                        "but they should be " +
                        `${beforeBoard[2]}.`
                    );
                }
            });
            it(
                "The next player to ply should still be the same player",
                function () {
                    if (afterBoard.playerToPly !== 1) {
                        throw new Error(
                            "Next player to ply is currently " +
                            `player ${afterBoard.playerToPly}, ` +
                            "but it should be player 1."
                        );
                    }
                }
            );
            it("The total dice value should be unchanged", function () {
                const diceValues = afterBoard.diceValues;
                const totalDiceValue = RoyalGameOfUr.sumDiceValues(
                    diceValues
                );
                if (totalDiceValue !== 3) {
                    throw new Error(
                        "Total dice value is currently " +
                        `${totalDiceValue}, ` +
                        "but it should be 3."
                    );
                }
            });
        });
        describe("When the player selects an unoccupied tile", function () {
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
                        [4, 2],
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
                [3, 0], // Unoccupied tile
                beforeBoard
            );
            it("All pieces should be unchanged", function () {
                if (!RoyalGameOfUr.equalVectorArrays(
                    afterBoard[1],
                    beforeBoard[1]
                )) {
                    throw new Error(
                        "Player 1's pieces should not have changed. " +
                        "Player 1's pieces are " +
                        `${afterBoard[1]}, ` +
                        "but they should be " +
                        `${beforeBoard[1]}.`
                    );
                }
                if (!RoyalGameOfUr.equalVectorArrays(
                    afterBoard[2],
                    beforeBoard[2]
                )) {
                    throw new Error(
                        "Player 2's pieces should not have changed. " +
                        "Player 2's pieces are " +
                        `${afterBoard[2]}, ` +
                        "but they should be " +
                        `${beforeBoard[2]}.`
                    );
                }
            });
            it(
                "The next player to ply should still be the same player",
                function () {
                    if (afterBoard.playerToPly !== 1) {
                        throw new Error(
                            "Next player to ply is currently " +
                            `player ${afterBoard.playerToPly}, ` +
                            "but it should be player 1."
                        );
                    }
                }
            );
            it("The total dice value should be unchanged", function () {
                const diceValues = afterBoard.diceValues;
                const totalDiceValue = RoyalGameOfUr.sumDiceValues(
                    diceValues
                );
                if (totalDiceValue !== 3) {
                    throw new Error(
                        "Total dice value is currently " +
                        `${totalDiceValue}, ` +
                        "but it should be 3."
                    );
                }
            });
        });
        describe(
            "When the player selects an empty tile, " +
            "i.e. a tile off the board",
            function () {
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
                            [4, 2],
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
                    [5, 0], // Empty tile off the board
                    beforeBoard
                );
                it("All pieces should be unchanged", function () {
                    if (!RoyalGameOfUr.equalVectorArrays(
                        afterBoard[1],
                        beforeBoard[1]
                    )) {
                        throw new Error(
                            "Player 1's pieces should not have changed. " +
                            "Player 1's pieces are " +
                            `${afterBoard[1]}, ` +
                            "but they should be " +
                            `${beforeBoard[1]}.`
                        );
                    }
                    if (!RoyalGameOfUr.equalVectorArrays(
                        afterBoard[2],
                        beforeBoard[2]
                    )) {
                        throw new Error(
                            "Player 2's pieces should not have changed. " +
                            "Player 2's pieces are " +
                            `${afterBoard[2]}, ` +
                            "but they should be " +
                            `${beforeBoard[2]}.`
                        );
                    }
                });
                it(
                    "The next player to ply should still be the same player",
                    function () {
                        if (afterBoard.playerToPly !== 1) {
                            throw new Error(
                                "Next player to ply is currently " +
                                `player ${afterBoard.playerToPly}, ` +
                                "but it should be player 1."
                            );
                        }
                    }
                );
                it("The total dice value should be unchanged", function () {
                    const diceValues = afterBoard.diceValues;
                    const totalDiceValue = RoyalGameOfUr.sumDiceValues(
                        diceValues
                    );
                    if (totalDiceValue !== 3) {
                        throw new Error(
                            "Total dice value is currently " +
                            `${totalDiceValue}, ` +
                            "but it should be 3."
                        );
                    }
                });
            }
        );
    });
});

describe("Checking if the game has ended", function () {
    describe(
        "When the game has just started, i.e. all pieces are at home",
        function () {
            const board = RoyalGameOfUr.createBoard();
            it("The game has not ended", function () {
                if (RoyalGameOfUr.isEnded(board)) {
                    throw new Error(
                        "The board should not have ended " +
                        "since the game has just started."
                    );
                }
            });
        }
    );
    describe("When both players still have pieces on the board", function () {
        const board = RoyalGameOfUr.createBoard(
            [
                [
                    [1, 0],
                    [4, 0],
                    [4, 0],
                    [4, 0],
                    [4, 0],
                    [4, 0],
                    [4, 0]
                ],
                [
                    [2, 0],
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
        it("The game has not ended", function () {
            if (RoyalGameOfUr.isEnded(board)) {
                throw new Error(
                    "The board should not have ended " +
                    "since both players still have pieces on the board."
                );
            }
        });
    });
    describe(
        "When one player moved all pieces off the board, " +
        "i.e. the player won",
        function () {
            const board = RoyalGameOfUr.createBoard(
                [
                    [
                        [1, 0],
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
                ]
            );
            it("The game has ended", function () {
                if (!RoyalGameOfUr.isEnded(board)) {
                    throw new Error(
                        "The board should have ended " +
                        "since player 2 won."
                    );
                }
            });
        }
    );
});