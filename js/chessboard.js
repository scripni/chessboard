/*jslint browser:true, bitwise:true */

(function (document, window) {
    "use strict";

    var chessboards = {};

    function createChessPiece(type, color) {
        /// <summary>Creates an anchor containing a chess piece of the specified type.</summary>
        if (color === chessEngine.pieceColors.white) {
            return createWhitePiece(type);
        }

        return createBlackPiece(type);
    }

    function createWhitePiece(type) {
        var piece = document.createElement("a");
        switch (type) {
            // white pieces
            case chessEngine.pieceTypes.pawn:
                piece.innerHTML = "&#9817;";
                break;
            case chessEngine.pieceTypes.rook:
                piece.innerHTML = "&#9814;";
                break;
            case chessEngine.pieceTypes.knight:
                piece.innerHTML = "&#9816;";
                break;
            case chessEngine.pieceTypes.bishop:
                piece.innerHTML = "&#9815;";
                break;
            case chessEngine.pieceTypes.queen:
                piece.innerHTML = "&#9813;";
                break;
            case chessEngine.pieceTypes.king:
                piece.innerHTML = "&#9812;";
                break;
        }
        return piece;
    }

    function createBlackPiece(type) {
        var piece = document.createElement("a");
        switch (type) {
            // black pieces
            case chessEngine.pieceTypes.pawn:
                piece.innerHTML = "&#9823;";
                break;
            case chessEngine.pieceTypes.rook:
                piece.innerHTML = "&#9820;";
                break;
            case chessEngine.pieceTypes.knight:
                piece.innerHTML = "&#9822;";
                break;
            case chessEngine.pieceTypes.bishop:
                piece.innerHTML = "&#9821;";
                break;
            case chessEngine.pieceTypes.queen:
                piece.innerHTML = "&#9819;";
                break;
            case chessEngine.pieceTypes.king:
                piece.innerHTML = "&#9818;";
                break;
            default:
                piece.innerHTML = "X";
                break;
        }
        return piece;
    }

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

                squares[0].appendChild(createBlackPiece(chessEngine.pieceTypes.rook));
                squares[1].appendChild(createBlackPiece(chessEngine.pieceTypes.knight));
                squares[2].appendChild(createBlackPiece(chessEngine.pieceTypes.bishop));
                squares[3].appendChild(createBlackPiece(chessEngine.pieceTypes.queen));
                squares[4].appendChild(createBlackPiece(chessEngine.pieceTypes.king));
                squares[5].appendChild(createBlackPiece(chessEngine.pieceTypes.bishop));
                squares[6].appendChild(createBlackPiece(chessEngine.pieceTypes.knight));
                squares[7].appendChild(createBlackPiece(chessEngine.pieceTypes.rook));

                for (i = 0; i < 8; i++) {
                    squares[8 + i].appendChild(createBlackPiece(chessEngine.pieceTypes.pawn));
                    squares[8 * 6 + i].appendChild(createWhitePiece(chessEngine.pieceTypes.pawn));
                }

                squares[8 * 7].appendChild(createWhitePiece(chessEngine.pieceTypes.rook));
                squares[8 * 7 + 1].appendChild(createWhitePiece(chessEngine.pieceTypes.knight));
                squares[8 * 7 + 2].appendChild(createWhitePiece(chessEngine.pieceTypes.bishop));
                squares[8 * 7 + 3].appendChild(createWhitePiece(chessEngine.pieceTypes.queen));
                squares[8 * 7 + 4].appendChild(createWhitePiece(chessEngine.pieceTypes.king));
                squares[8 * 7 + 5].appendChild(createWhitePiece(chessEngine.pieceTypes.bishop));
                squares[8 * 7 + 6].appendChild(createWhitePiece(chessEngine.pieceTypes.knight));
                squares[8 * 7 + 7].appendChild(createWhitePiece(chessEngine.pieceTypes.rook));

                resizePieces();
                initialized = true;
            };

        chessboards["chessboard-root-" + boardId] = {
            init: init
        };
        return chessboards["chessboard-root-" + boardId];
    };
}(document, window));

var chessEngine = {
    ChessPiece: function (type, color, row, column) {
        "use strict";
        this.pieceType = type;
        this.color = color;
        this.position = [row, column];
    },
    pieceColors: { white: 1, black: 2 },
    pieceTypes: { king: 1, queen: 2, rook: 3, bishop: 4, knight: 5, pawn: 6 }
};

Object.freeze(chessEngine.pieceColors);
Object.freeze(chessEngine.pieceTypes);

chessEngine.ChessPiece.prototype.getColumn = function () {
    "use strict";
    return this.position[1];
};

chessEngine.ChessPiece.prototype.getRow = function () {
    "use strict";
    return this.position[0];
};

chessEngine.ChessPiece.prototype.setPosition = function (row, column) {
    "use strict";
    this.position = [row, column];
};

chessEngine.ChessPiece.prototype.getType = function () {
    "use strict";
    return this.pieceType.substring(this.pieceType.indexOf('-') + 1, this.pieceType.length);
};

chessEngine.ChessPiece.prototype.getValue = function () {
    "use strict";
    switch (this.getType()) {
        case chessEngine.pieceTypes.pawn:
            return 1;
        case chessEngine.pieceTypes.knight:
        case chessEngine.pieceTypes.bishop:
            return 3;
        case chessEngine.pieceTypes.rook:
            return 5;
        case chessEngine.pieceTypes.queen:
            return 9;
        case chessEngine.pieceTypes.king:
            return 100;
    }
};