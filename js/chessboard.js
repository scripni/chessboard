(function (document, window) {
    var chessboards = {};

    function createChessPiece(type) {
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
                piece.innerHTML = "piece_not_defined";
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

        // get the root DOM element
        var root = document.getElementById(boardId);

        // store the board squares
        var squares = new Array();

        var init = function () {
            if (initialized) { return; }

            // add rows
            for (var r = 0; r < 8; r++) {
                var row = document.createElement("div");

                // add cells
                for (var c = 0; c < 8; c++) {
                    var cell = document.createElement("div");

                    // set the onclick event to handle piece movement
                    cell.onclick = function () {
                        // if no piece is present on the square, return
                        if (this.childElementCount == 0) { return; }

                        this.classList.toggle('selected');
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


            initialized = true;
        };

        return (chessboards["chessboard-root-" + boardId] = {
            init: init,
            squares: squares,
        });
    }
})(document, window);
