/*jslint browser:true, bitwise:true */

(function (document, window) {
    "use strict";
    function createChessPiece(type) {
        /// <summary>Creates an anchor containing a chess piece of the specified type.</summary>
        var piece = document.createElement("a");
        switch (type) {
            // white pieces
            case "w-pawn":
                piece.innerHTML = "&#9817;";
                break;
            case "w-rook":
                piece.innerHTML = "&#9814;";
                break;
            case "w-knight":
                piece.innerHTML = "&#9816;";
                break;
            case "w-bishop":
                piece.innerHTML = "&#9815;";
                break;
            case "w-queen":
                piece.innerHTML = "&#9813;";
                break;
            case "w-king":
                piece.innerHTML = "&#9812;";
                break;

                // black pieces
            case "b-pawn":
                piece.innerHTML = "&#9823;";
                break;
            case "b-rook":
                piece.innerHTML = "&#9820;";
                break;
            case "b-knight":
                piece.innerHTML = "&#9822;";
                break;
            case "b-bishop":
                piece.innerHTML = "&#9821;";
                break;
            case "b-queen":
                piece.innerHTML = "&#9819;";
                break;
            case "b-king":
                piece.innerHTML = "&#9818;";
                break;
            default:
                piece.innerHTML = "X";
                break;
        }
        return piece;
    }

    var chessboards = {};

    window.chessboard = function (boardId) {

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
                    row = null,
                    cell = null,
                    movePiece = function () {
                        if (selectedSquare === this) {
                            selectedSquare.classList.remove('selected');
                            selectedSquare = null;
                        } else if (this.getElementsByTagName('a').length === 0 && selectedSquare !== null) {
                            this.appendChild(selectedSquare.getElementsByTagName('a')[0]);
                            selectedSquare.classList.remove('selected');
                            selectedSquare = null;
                        } else if (this.getElementsByTagName('a').length > 0 && selectedSquare === null) {
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

                    for (i = 0; i < anchors.length; i++) {
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

                squares[0].appendChild(createChessPiece("b-rook"));
                squares[1].appendChild(createChessPiece("b-knight"));
                squares[2].appendChild(createChessPiece("b-bishop"));
                squares[3].appendChild(createChessPiece("b-queen"));
                squares[4].appendChild(createChessPiece("b-king"));
                squares[5].appendChild(createChessPiece("b-bishop"));
                squares[6].appendChild(createChessPiece("b-knight"));
                squares[7].appendChild(createChessPiece("b-rook"));

                for (i = 0; i < 8; i++) {
                    squares[8 + i].appendChild(createChessPiece("b-pawn"));
                    squares[8 * 6 + i].appendChild(createChessPiece("w-pawn"));
                }

                squares[8 * 7].appendChild(createChessPiece("w-rook"));
                squares[8 * 7 + 1].appendChild(createChessPiece("w-knight"));
                squares[8 * 7 + 2].appendChild(createChessPiece("w-bishop"));
                squares[8 * 7 + 3].appendChild(createChessPiece("w-queen"));
                squares[8 * 7 + 4].appendChild(createChessPiece("w-king"));
                squares[8 * 7 + 5].appendChild(createChessPiece("w-bishop"));
                squares[8 * 7 + 6].appendChild(createChessPiece("w-knight"));
                squares[8 * 7 + 7].appendChild(createChessPiece("w-rook"));

                resizePieces();
                initialized = true;
            };

        chessboards["chessboard-root-" + boardId] = {
            init: init
        };
        return chessboards["chessboard-root-" + boardId];
    };
}(document, window));

function ChessPiece(type, row, column) {
    "use strict";
    // all data will be stored on 64 bits (32 + 32)
    // each bit represents one board square
    // to keep it simple, black will always be at the top of the board
    // this means that position[0] holds the first 4 rows
    // and the first half of all 8 columns,
    // leaving the rest for position[1]
    this.position = [0x00000000, 0x00000000];
    this.attacking_squares = [0x00000000, 0x00000000];
    this.move_squares = [0x00000000, 0x00000000];
    this.pieceType = type;
    this.setPosition(row, column);
}

ChessPiece.prototype.getColumn = function () {
    "use strict";
    // the column is the same every 8th cell
    // cell indexing starts from 0
    if (this.position[0] > 0) {
        return 7 - Math.floor(Math.log(this.position[0]) / Math.LN2 % 8);
    }
    return 7 - Math.floor(Math.log(this.position[1]) / Math.LN2 % 8);
};

ChessPiece.prototype.getRow = function () {
    "use strict";
    var r = 0,
        c = 0,
        val = null;
    // the row increases every 8 cells
    if (this.position[1] > 0) {
        val = this.position[1];
        for (r = 0; r < 4; r++) {
            for (c = 0; c < 8; c++) {
                if (val === 1) {
                    return r;
                }
                val = val >>> 1;
            }
        }
    } else {
        val = this.position[0];
        for (r = 4; r < 8; r++) {
            for (c = 0; c < 8; c++) {
                if (val === 1) {
                    return r;
                }
                val = val >>> 1;
            }
        }
    }
};

ChessPiece.prototype.setPosition = function (row, column) {
    "use strict";
    // the position is stored as 2 ^ ((8 * row) + column)
    var pow = 8 * row + (7 - column);
    if (pow > 31) {
        pow = pow - 32;
        this.position[0] = (1 << pow) >>> 0;
    } else {
        this.position[1] = (1 << pow) >>> 0;
    }
};