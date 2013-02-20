/*jslint browser:true, bitwise:true */

var Scripni = {
    ChessGame: function () {
    },
    ChessBoard: function (boardId) {

        function createWhitePiece(type) {
            var piece = document.createElement("a");
            switch (type) {
                // white pieces
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
            var piece = document.createElement("a");
            switch (type) {
                // black pieces
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

        // fallback to the default id if no id was specified
        boardId = boardId || "chessboard";

        // check if the board has already been created
        if (chessboards["chessboard-root-" + boardId]) {
            return chessboards["chessboard-root-" + boardId];
        }

        // only initialize each board once
        var initialized = false,
            selectedSquare = null,
            // get the root DOM element
            root = document.getElementById(boardId),
            init = function () {
                if (initialized) { return; }

                var squares = [],
                    r = 0,
                    c = 0,
                    i = 0,
                    max = 0,
                    row = null,
                    cell = null,
                    movePiece = function () {
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

                function resizePieces() {
                    var anchors = root.getElementsByTagName('a'),
                        squareSize = root.getElementsByTagName('div')[0].getElementsByTagName('div')[0].clientWidth,
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
                }

                window.onresize = resizePieces;

                // add rows
                for (r = 0; r < 8; r++) {
                    row = document.createElement("div");

                    // add cells
                    for (c = 0; c < 8; c++) {
                        cell = document.createElement("div");

                        // set the onclick event to handle piece movement
                        cell.onclick = movePiece;

                        row.appendChild(cell);
                        squares.push(cell);
                    }

                    root.appendChild(row);
                }

                // add the chess pieces for the starting position

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

                resizePieces();
                initialized = true;
            };

        chessboards["chessboard-root-" + boardId] = {
            init: init
        };
        return chessboards["chessboard-root-" + boardId];
    },

    ChessPiece: function (type, color, row, column) {
        "use strict";
        this.pieceType = type;
        this.color = color;
        this.position = [row, column];
    },
    SimpleEngine: function () {
    },
    PieceColor: { WHITE: 1, BLACK: 2 },
    PieceType: { KING: 1, QUEEN: 2, ROOK: 3, BISHOP: 4, KNIGHT: 5, PAWN: 6 }
};

// Make sure no globals get created
(function () {
    "use strict";
    // This should make PieceColor and PieceType seem more like enums
    Object.freeze(Scripni.PieceColor);
    Object.freeze(Scripni.PieceType);

    Scripni.ChessPiece.prototype.getColumn = function () {
        "use strict";
        return this.position[1];
    };

    Scripni.ChessPiece.prototype.getRow = function () {
        "use strict";
        return this.position[0];
    };

    Scripni.ChessPiece.prototype.setPosition = function (row, column) {
        "use strict";
        this.position = [row, column];
    };

    Scripni.ChessPiece.prototype.getType = function () {
        "use strict";
        return this.pieceType;
    };

    Scripni.ChessPiece.prototype.getValue = function () {
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