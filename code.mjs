"use strict";

import {FILES, toCoordString, fromCoordString, Position} from "./fen.mjs";

var letters = "abcdefgh";
var board  = document.getElementById("board");
var selected = null;

function coordToInt(c) {
    let o = fromCoordString(c);
    console.log(o);
    return FILES.indexOf(o.file) + (8 - o.rank)*8;
}

function intToCoord(i) {
    return letters[i%8] + String(8 - parseInt(i/8));
}

function pieceToImg(p) {
    if (p == "b") return "bB.png";
    if (p == "k") return "bK.png";
    if (p == "n") return "bN.png";
    if (p == "p") return "bP.png";
    if (p == "q") return "bQ.png";
    if (p == "r") return "bR.png";
    
    if (p == "B") return "wB.png";
    if (p == "K") return "wK.png";
    if (p == "N") return "wN.png";
    if (p == "P") return "wP.png";
    if (p == "Q") return "wQ.png";
    if (p == "R") return "wR.png";
}

var color = "black";
for (var i = 0; i < 64; i++) {
    board.innerHTML += `<div id="${intToCoord(i)}" class="${color}"></div>`
    if ((i+1)%8 == 0) {
        continue;
    }
    if (color == "black") {
        color = "white";
    } else {
        color = "black";
    }
}

for (var i = 0; i < board.children.length; i++) {
    var child = board.children[i];
    child.addEventListener("click", function (e) {
        if (selected) {
            selected.classList.remove("selected");
            selected = null;
        } else {
            selected = this;
            this.classList.add("selected");
        }
        
        console.log(this.id);
    });
    if (i >= 64-8) {
        child.innerHTML += `<div class="notation notation-letter">${letters[i%8]}</div>`;
    }
}

for (var i = 0; i < 64; i+=8) {
    var child = board.children[i];
    child.innerHTML += `<div class="notation">${8 - i/8}</div>`;
}

const urlParams = new URLSearchParams(window.location.search);
const f = atob(urlParams.get("d"));
const fen = new Position(atob(urlParams.get("d")));
console.log(fen.board);
for (var coord of fen.board) {
    console.log(coord);
    board.children[coordToInt(coord[0])].innerHTML += `<img src="img/${pieceToImg(coord[1])}">`;
}

console.log(coordToInt("a1"));
console.log(coordToInt("a2"));
console.log(coordToInt("a8"));
console.log(coordToInt("b1"));
console.log(coordToInt("b2"));