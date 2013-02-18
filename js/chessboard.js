(function (document, window) {
    var chessboards = {};

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
                };

                root.appendChild(row);
            };

            // add event handlers

            initialized = true;
        };

        return (chessboards["chessboard-root-" + boardId] = {
            init: init
        });
    }
})(document, window);
