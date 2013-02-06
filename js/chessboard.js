/// <reference path="jquery-1.9.1.debug.js" />
/// <reference path="knockout-2.2.1.debug.js" />

$(document).ready(function () {
    $(window).resize(resizePieces);
    resizePieces(0.8);
});

function resizePieces(size) {
    /// <summary>Recalculates the piece size based on the size of their containing squares.</summary>
    /// <param name="size">Size of the piece relative to the container (0.0 - 1.0)</param>
    var chessboard = $("#chessboard");
    var squareSize = $("div div", chessboard).first().width();
    var pieceSize = squareSize * size;
    var pieceMargin = squareSize * ((1 - size) / 2);

    $("a", chessboard).each(function () {
        $(this).css("font-size", pieceSize);
        $(this).css("margin", pieceMargin);
    });
}