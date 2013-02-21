/*jslint browser:true, bitwise:true */

var Scripni = {
    ChessGame: function () {
        /// <summary> This will encapsulate a chess game. </summary>
    },

    ChessBoard: function (boardId) {
        /// <summary> Represents an HTML chessboard. </summary>
        function createWhitePiece(type) {
            /// <summary> Creates a DOM representation of a white chess piece. </summary>
            var piece = document.createElement("a");
            switch (type) {
                case Scripni.PieceType.pawn:
                    piece.innerHTML = "&#9817;";
                    break;
                case Scripni.PieceType.rook:
                    piece.innerHTML = "&#9814;";
                    break;
                case Scripni.PieceType.knight:
                    piece.innerHTML = "&#9816;";
                    break;
                case Scripni.PieceType.bishop:
                    piece.innerHTML = "&#9815;";
                    break;
                case Scripni.PieceType.queen:
                    piece.innerHTML = "&#9813;";
                    break;
                case Scripni.PieceType.king:
                    piece.innerHTML = "&#9812;";
                    break;
            }

            piece.setAttribute('data-type', type);
            piece.setAttribute('data-color', Scripni.PieceColor.WHITE);
            return piece;
        }

        function createBlackPiece(type) {
            /// <summary> Creates a DOM representation of a black chess piece. </summary>
            var piece = document.createElement("a");
            switch (type) {
                case Scripni.PieceType.PAWN:
                    piece.innerHTML = "&#9823;";
                    break;
                case Scripni.PieceType.ROOK:
                    piece.innerHTML = "&#9820;";
                    break;
                case Scripni.PieceType.KNIGHT:
                    piece.innerHTML = "&#9822;";
                    break;
                case Scripni.PieceType.BISHOP:
                    piece.innerHTML = "&#9821;";
                    break;
                case Scripni.PieceType.QUEEN:
                    piece.innerHTML = "&#9819;";
                    break;
                case Scripni.PieceType.KING:
                    piece.innerHTML = "&#9818;";
                    break;
                default:
                    piece.innerHTML = "X";
                    break;
            }

            piece.setAttribute('data-type', type);
            piece.setAttribute('data-color', Scripni.PieceColor.BLACK);
            return piece;
        }

        function createChessPiece(type, color) {
            /// <summary>Creates an anchor containing a chess piece of the specified type.</summary>
            if (color === Scripni.PieceColor.WHITE) {
                return createWhitePiece(type);
            }

            return createBlackPiece(type);
        }

        // fall back to the default id if no id was specified
        boardId = boardId || "chessboard";

        // check if the board has already been created
        if (chessboards["chessboard-root-" + boardId]) {
            return chessboards["chessboard-root-" + boardId];
        }

        var initialized = false,
            selectedSquare = null,
            // get the root DOM element
            root = document.getElementById(boardId),
            init = function () {
                // only initialize each board once
                if (initialized) { return; }

                var squares = [],
                    r = 0,
                    c = 0,
                    i = 0,
                    max = 0,
                    row = null,
                    cell = null;

                // this will be called each time the winow is resized
                function resizePieces() {
                    /// <summary> Resizes all chess pieces on the board relative to the board's size. </summary>
                    var anchors = root.getElementsByTagName('a'),
                        squareSize = root.getElementsByTagName('div')[0].getElementsByTagName('div')[0].clientWidth,
                        // the piece's size relative to the square size
                        pieceRatio = 0.7,
                        pieceSize = squareSize * pieceRatio,
                        margin = (squareSize - pieceSize) / 2,
                        i = 0,
                        anchor = null;

                    for (i = 0, max = anchors.length; i < max; i++) {
                        anchor = anchors[i];
                        anchor.style.fontSize = pieceSize + "px";
                        anchor.style.margin = margin + "px";
                    }
                };

                window.onresize = resizePieces;

                // this will be called when a square on the chessboard is clicked
                function movePiece() {
                    /// <summary> Manages moving chess pieces through the UI </summary>

                    // check if the clicked square has an anchor (a chess piece)
                    var hasAnchor = this.getElementsByTagName('a').length !== 0;

                    if (selectedSquare === this) {
                        // clicking the selected square de-selects it
                        selectedSquare.classList.remove('selected');
                        selectedSquare = null;
                    } else if (!hasAnchor && selectedSquare !== null) {
                        // clicking an empty square while a piece is selected
                        // moves the piece to that square and deselects it
                        this.appendChild(selectedSquare.getElementsByTagName('a')[0]);
                        selectedSquare.classList.remove('selected');
                        selectedSquare = null;
                    } else if (hasAnchor && selectedSquare === null) {
                        // clicking a square that has a piece if no square
                        // is selected selects the clicked square
                        selectedSquare = this;
                        selectedSquare.classList.add('selected');
                    }
                };

                // add rows
                for (r = 0; r < 8; r++) {
                    row = document.createElement("div");

                    // add cells
                    for (c = 0; c < 8; c++) {
                        cell = document.createElement("div");

                        // set the onclick event to handle piece movement
                        cell.onclick = movePiece;
                        // add the cell to the DOM
                        row.appendChild(cell);
                        squares.push(cell);
                    }

                    root.appendChild(row);
                }

                // add the chess pieces for the starting position
                // TODO: find a better way to set a position
                squares[0].appendChild(createBlackPiece(Scripni.PieceType.rook));
                squares[1].appendChild(createBlackPiece(Scripni.PieceType.knight));
                squares[2].appendChild(createBlackPiece(Scripni.PieceType.bishop));
                squares[3].appendChild(createBlackPiece(Scripni.PieceType.queen));
                squares[4].appendChild(createBlackPiece(Scripni.PieceType.king));
                squares[5].appendChild(createBlackPiece(Scripni.PieceType.bishop));
                squares[6].appendChild(createBlackPiece(Scripni.PieceType.knight));
                squares[7].appendChild(createBlackPiece(Scripni.PieceType.rook));
                for (i = 0; i < 8; i++) {
                    squares[8 + i].appendChild(createBlackPiece(Scripni.PieceType.pawn));
                    squares[8 * 6 + i].appendChild(createWhitePiece(Scripni.PieceType.pawn));
                }
                squares[8 * 7].appendChild(createWhitePiece(Scripni.PieceType.rook));
                squares[8 * 7 + 1].appendChild(createWhitePiece(Scripni.PieceType.knight));
                squares[8 * 7 + 2].appendChild(createWhitePiece(Scripni.PieceType.bishop));
                squares[8 * 7 + 3].appendChild(createWhitePiece(Scripni.PieceType.queen));
                squares[8 * 7 + 4].appendChild(createWhitePiece(Scripni.PieceType.king));
                squares[8 * 7 + 5].appendChild(createWhitePiece(Scripni.PieceType.bishop));
                squares[8 * 7 + 6].appendChild(createWhitePiece(Scripni.PieceType.knight));
                squares[8 * 7 + 7].appendChild(createWhitePiece(Scripni.PieceType.rook));

                // after the chess board is created, set the size of all pieces relative to the board
                resizePieces();
                initialized = true;
            };

        // cache the created chessboard
        chessboards["chessboard-root-" + boardId] = {
            init: init
        };
        return chessboards["chessboard-root-" + boardId];
    },

    ChessPiece: function (type, color, row, column) {
        /// <summary> Defines a chess piece. </summary>
        "use strict";
        if (row < 0 || row > 7) {
            throw ("Argument 'row' was out of range.");
        }
        if (column < 0 || column > 7) {
            throw ("Argument 'column' was out of range.");
        }

        this.pieceType = type;
        this.color = color;
        this.position = [row, column];
    },

    SimpleEngine: function () {
        /// <summary> It's really simple... </summary>
    },

    PieceColor: {
        /// <summary> Enumerates chess piece colors. </summary>
        WHITE: 1,
        BLACK: 2
    },

    PieceType: {
        /// <summary> Enumerates chess pieces. </summary>
        KING: 1,
        QUEEN: 2,
        ROOK: 3,
        BISHOP: 4,
        KNIGHT: 5,
        PAWN: 6
    },

    Math: {
        getRandomInt: function (min, max) {
            /// <summary> Returns a random integer between min and max. </summary>
            return Math.floor(Math.random() * (max - min + 1)) + min;
        },
        isNumber: function (value) {
            /// <summary> Checks if a value is a number or not (regardless of type). </summary>
            return !isNaN(parseFloat(n)) && isFinite(n);
        }
    },

    Error: {
        ArgumentOutOfRangeMessage: function (argName, argValue, min, max) {
            /// <summary> Error message for an argument out of range error. </summary>
            var message = "Argument '" + argName + "' out of range.";
            if (Scripni.Math.isNumber(min) || Scripni.Math.isNumber(max)) {
                message += " Expected range: " + min + " - " + max + ".";
            }

            return message;
        }
    }
};

// Make sure no globals get created
(function () {
    "use strict";
    // This should make PieceColor and PieceType seem more like enums
    Object.freeze(Scripni.PieceColor);
    Object.freeze(Scripni.PieceType);

    Scripni.ChessPiece.prototype.getColumn = function () {
        /// <summary> Returns the current column of the chess piece. </summary>
        "use strict";
        return this.position[1];
    };

    Scripni.ChessPiece.prototype.getRow = function () {
        /// <summary> Returns the current row of the chess piece. </summary>
        "use strict";
        return this.position[0];
    };

    Scripni.ChessPiece.prototype.setPosition = function (row, column) {
        /// <summary> Sets the piece's board position. </summary>
        "use strict";
        this.position = [row, column];
    };

    Scripni.ChessPiece.prototype.getType = function () {
        /// <summary> Returns the type of the chess piece. </summary>
        "use strict";
        return this.pieceType;
    };

    Scripni.ChessPiece.prototype.getValue = function () {
        /// <summary> Returns the piece's quantitative value, relative to a pawn. </summary>
        "use strict";
        switch (this.getType()) {
            case Scripni.PieceType.PAWN:
                return 1;
            case Scripni.PieceType.KNIGHT:
            case Scripni.PieceType.BISHOP:
                return 3;
            case Scripni.PieceType.ROOK:
                return 5;
            case Scripni.PieceType.QUEEN:
                return 9;
            case Scripni.PieceType.KING:
                return 100;
        }
    };

    var chessboards = {};
}());