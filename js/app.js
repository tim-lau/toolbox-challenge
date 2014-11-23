// app.js

"use strict";

var timer;
var matches = 0;
var misses = 0;
var remaining = 8;
var tiles = [];
var i = 0;
var click;
var tempImage = null;

var gameBoard = $('#gameBoard');

for (i = 1; i <= 32; i++) {
    tiles.push({
        tileNum: i,
        src: 'img/tile' + i + '.jpg',
        flipped: false,
        matched: false
    });
} // for each tile

// when document is ready
$(document).ready(function() {
    $('#startGame').click(function() {
        gameReset();
        gameSet();

        // Starts timer
        var seconds = Date.now();
        clearInterval(timer);
        timer = window.setInterval(function() {
            var elapsedSeconds = (Date.now() - seconds) / 1000;
            elapsedSeconds = Math.floor(elapsedSeconds);
            $('#elapsed-seconds').text(elapsedSeconds + ' seconds');
        }, 1000);

        gameRun();
    });
});

function gameSet() {
    tiles = _.shuffle(tiles);
    var toUse = tiles.slice(0, 8);
    var pairs = [];
    _.forEach(toUse, function(tile) {
        pairs.push(tile);
        pairs.push(_.clone(tile));
    });
    pairs = _.shuffle(pairs);

    var img;
    var row = $(document.createElement('div'));
    _.forEach(pairs, function(tile, elemIndex) {
        if (elemIndex > 0 && elemIndex % 4 == 0) {
            gameBoard.append(row);
            row = $(document.createElement('div'));
        }
        img = $(document.createElement('img'));
        img.attr({
            src: 'img/tile-back.png',
            alt: 'tile ' + tile.tileNum
        });
        img.data('tile', tile);
        row.append(img);
    });
    gameBoard.append(row);
}

function gameReset() {
    gameBoard.empty();
    click = true;
}

function gameRun() {
   $('#gameBoard img').click(function() {
        if(click) {
            var clickedImg = $(this);
            var tile = clickedImg.data('tile');
            if (!tile.flipped) {
                flipTile(tile, clickedImg);
                console.log("Selected tile: " + tile.tileNum); 
            }
        }
    });
}

// function to handle game status

// function to handle tile comparison

function flipTile(tile, img) {
    img.fadeOut(100, function() {
        if (tile.flipped) {
            img.attr('src', 'img/tile-back.png');
        } else {
            img.attr('src', tile.src);
        }
        tile.flipped = !tile.flipped;
        img.fadeIn(100);
    });
}

function flipBack(tile, img) {
    tile.flipped = !tile.flipped;
}