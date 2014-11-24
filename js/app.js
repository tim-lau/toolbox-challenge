// app.js

"use strict";

var timer;
var matches = 0;
var misses = 0;
var remaining = 8
var pairs = [];
var tiles = [];
var plays = 0;
var i = 0;
var tempTile = [];
var tempImage = [];
var twoFlipped = false;
var gameBoard = $('#gameBoard');

function makeTiles() {

    for (i = 1; i <= 32; i++) {
        tiles.push({
            tileNum: i,
            src: 'img/tile' + i + '.jpg',
            flipped: false,
            matched: false
        });
        } // for each tile
    }

// when document is ready
$(document).ready(function() {
    $(function () {
        $('[data-toggle="popover"]').popover()
    })
    
    $('#startGame').click(function() {
        gameReset();
        status();
        makeTiles();
        gameSet();
        console.log("matches: " + matches + " misses: " + misses + " remaining: " + remaining);

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
    //gets all tiles, chooses 8, clones the 8 tiles into pairs
    // shuffles the 16 tiles onto the board
    tiles = _.shuffle(tiles);
    var toUse = tiles.slice(0, 8);
    var pairs = [];
    _.forEach(toUse, function (tile) {
        pairs.push(tile);
        pairs.push(_.clone(tile));
    })
    pairs = _.shuffle(pairs);
    console.log(pairs);

    var img;
    var row = $(document.createElement('div'));
    _.forEach(pairs, function (tile, elemIndex) {
        if (elemIndex > 0 && elemIndex % 4 == 0) {
            gameBoard.append(row);
            row = $(document.createElement('div'));
        }
        img = $(document.createElement('img'));
        img.attr({
            src: 'img/tile-back.png',
            alt: 'tile ' + tile.tileNum
        });
        //
        img.data('tile', tile);
        row.append(img);
    });
    gameBoard.append(row);
}

function gameReset() {
    twoFlipped = false;
    gameBoard.empty();
    tiles = [];
    pairs = [];
    tempTile = [];
    tempImage = [];
    matches = 0;
    misses = 0;
    remaining = 8;
}

function gameRun() {
 $('#gameBoard img').click(function() {
    var clickedImg = $(this);
    var tile = clickedImg.data('tile');
    if (twoFlipped == false && !tile.flipped) {
        flipTile(tile, clickedImg);
        console.log("Selected tile: " + tile.tileNum); 
        compareTiles(tile, clickedImg);
    }

    status();

    if(matches == 8){
        setTimeout(function() {
            gameBoard.empty();
            clearInterval(timer);
        }, 3000)
    };
});
}

function status() {
    $('#matches').text(matches);
    $('#misses').text(misses);
    $('#remaining').text(remaining);
}

function compareTiles(tile, img) {
    tempTile.push(tile);
    tempImage.push(img);

    if (tempTile.length == 2) {
        // Match
        if (tempTile[0].src == tempTile[1].src) {
            tempTile[0].matched = true;
            tempTile[1].matched = true;
            remaining--;
            matches++;
            tempTile = [];
            tempImage = [];
        // No match
    } else {
        twoFlipped = true;
        misses++;
        window.setTimeout(function() {
            flipTile(tempTile[0], tempImage[0]);
            flipTile(tempTile[1], tempImage[1]);
            twoFlipped = false;
            tempTile = [];
            tempImage = [];
        }, 1000);
    }
}
}

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

