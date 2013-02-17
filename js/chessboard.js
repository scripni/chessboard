/// <reference path="jquery-1.9.1.debug.js" />
/// <reference path="knockout-2.2.1.debug.js" />

// define the piece size relative to the square
var pieceSizeRatio = 0.8;

$(document).ready(function () {
    setMoveOnClick();
    $(window).resize(resizePieces);
    resizePieces();
});

function setMoveOnClick() {
    /// <summary>Attaches the click handler to all chess pieces on the board.</summary>
    var squares = $("#chessboard div div");
    squares.click(function () {
        if ($("a", this).length > 0) {
            $(this).addClass("selected");
        } else {
            var selectedPiece = $("div.selected a").first();
            if (selectedPiece) {
                $(this).append($("div.selected>a"));
            }
        };
    });
    $("a", chessboard).click(function () {
        if ($(this).hasClass("selected")) {
            $(this).parent().removeClass("selected");
        } else {
            $("div div", chessboard).removeClass("selected");
            $(this).parent().addClass("selected");
        }
    });
}

function resizePieces() {
    /// <summary>Recalculates the piece size based on the size of their containing squares.</summary>
    var chessboard = $("#chessboard");
    var squareSize = $("div div", chessboard).first().width();
    var pieceSize = squareSize * pieceSizeRatio;
    var pieceMargin = squareSize * ((1 - pieceSizeRatio) / 2);

    $("a", chessboard).each(function () {
        $(this).css("font-size", pieceSize);
        $(this).css("margin", pieceMargin);
    });
}