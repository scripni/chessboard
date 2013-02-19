(function (document, window) {
    var chessboards = {};

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
        };
        return piece;
    };

    var chessboard = window.chessboard = function (boardId) {

        // fallback to the default id if no id was specified
        boardId = boardId || "chessboard";

        // check if the board has already been created
        if (chessboards["chessboard-root-" + boardId]) {
            return chessboards["chessboard-root-" + boardId];
        }

        // only initialize each board once
        var initialized = false;

        var selectedSquare = null;

        // get the root DOM element
        var root = document.getElementById(boardId);

        var init = function () {
            if (initialized) { return; }

            function resizePieces() {
                var anchors = root.getElementsByTagName('a');
                var squareSize = root.getElementsByTagName('div')[0].getElementsByTagName('div')[0].clientWidth;
                var pieceRatio = 0.7;
                var pieceSize = squareSize * pieceRatio;
                var margin = (squareSize - pieceSize) / 2;
                for (var i = 0; i < anchors.length; i++) {
                    var anchor = anchors[i];
                    anchor.style.fontSize = pieceSize + "px";
                    anchor.style.margin = margin + "px";
                }
            };

            window.onresize = resizePieces;

            var squares = new Array();

            // add rows
            for (var r = 0; r < 8; r++) {
                var row = document.createElement("div");

                // add cells
                for (var c = 0; c < 8; c++) {
                    var cell = document.createElement("div");

                    // set the onclick event to handle piece movement
                    cell.onclick = function () {

                        if (selectedSquare == this) {
                            selectedSquare.classList.remove('selected');
                            selectedSquare = null;
                        } else if (this.getElementsByTagName('a').length == 0 && selectedSquare != null) {
                            this.appendChild(selectedSquare.getElementsByTagName('a')[0]);
                            selectedSquare.classList.remove('selected');
                            selectedSquare = null;
                        } else if (this.getElementsByTagName('a').length > 0 && selectedSquare == null) {
                            selectedSquare = this;
                            selectedSquare.classList.add('selected');
                        }
                    };

                    row.appendChild(cell);
                    squares.push(cell);
                };

                root.appendChild(row);
            };

            // add the chess pieces for the starting position

            squares[0].appendChild(createChessPiece("b-rook"));
            squares[1].appendChild(createChessPiece("b-knight"));
            squares[2].appendChild(createChessPiece("b-bishop"));
            squares[3].appendChild(createChessPiece("b-queen"));
            squares[4].appendChild(createChessPiece("b-king"));
            squares[5].appendChild(createChessPiece("b-bishop"));
            squares[6].appendChild(createChessPiece("b-knight"));
            squares[7].appendChild(createChessPiece("b-rook"));

            for (var i = 0; i < 8; i++) {
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

        return (chessboards["chessboard-root-" + boardId] = {
            init: init,
        });
    }
})(document, window);

function ChessEngine() {

};

function ChessPiece(type, row, column) {
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
};

ChessPiece.prototype.getColumn = function () {
    // the column is the same every 8th cell
    // cell indexing starts from 0
    if (this.position[0] > 0) {
        return 7 - Math.floor(Math.log(this.position[0]) / Math.LN2 % 8);
    } else {
        return 7 - Math.floor(Math.log(this.position[1]) / Math.LN2 % 8);
    }
};

ChessPiece.prototype.getRow = function () {
    // the row increases every 8 cells
    if (this.position[1] > 0) {
        var val = this.position[1];
        for (var r = 0; r < 4; r++) {
            for (var c = 0; c < 8; c++) {
                console.log(val);
                val = val >> 1;
                if (val == 1) return r;
            }
        }
    } else {
        var val = this.position[0];
        for (var r = 4; r < 8; r++) {
            for (var c = 0; c < 8; c++) {
                val = val >> 1;
                if (val == 1) return r;
            }
        }
    }
};

ChessPiece.prototype.setPosition = function (row, column) {
    // the position is stored as 2 ^ ((8 * row) + column)
    var pow = 8 * row + (7 - column);
    if (pow > 31) {
        pow = pow - 32;
        this.position[0] = (1 << pow) >>> 0;
    } else {
        this.position[1] = (1 << pow) >>> 0;
    }
};