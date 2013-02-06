/// <reference path="jquery-1.9.1.debug.js" />
/// <reference path="knockout-2.2.1.debug.js" />

$(document).ready(function () {
    var chessboard = $("#chessboard");
    // get the size of a square in pixels
    var squareSize = $("div div", chessboard).first().width();

    $("#chessboard a").each(function () {
        // set the font size to 70% of the square size
        $(this).css("font-size", squareSize * 0.8);
        $(this).css("margin", squareSize * 0.1);
    });
});