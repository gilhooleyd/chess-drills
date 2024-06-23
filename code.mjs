"use strict";

import { FILES, toCoordString, fromCoordString, Position } from "./fen.mjs";
import { Chess } from "./chess.js";

var letters = "abcdefgh";
var board = document.getElementById("board");
var selected = null;

function coordToInt(c) {
  let o = fromCoordString(c);
  return FILES.indexOf(o.file) + (8 - o.rank) * 8;
}

function intToCoord(i) {
  return letters[i % 8] + String(8 - parseInt(i / 8));
}

function last(a) {
  return a[a.length-1];
}

function isImg(e) {
  return e.nodeName.toLowerCase() == "img";
}

function urlToPiece(url) {
  var color = url[url.length-6];
  var type = url[url.length-5];
  return { color, type};
}

function tryMove(data) {
  var from = coordToInt(data.from);
  var to = coordToInt(data.to);
  var to_img = last(board.children[to].children);
  if (to_img && isImg(to_img)) {
    to_img.remove();
  }
  var img = last(board.children[from].children);
  if (img.nodeName.toLowerCase() == "img") {
    board.children[to].appendChild(img);
  }
}

function canSelect(e) {
  var t = chess.turn();
  var img = last(e.children);
  if (!img || !isImg(img)) {
    return false;
  }
  var piece = urlToPiece(img.src);
  return piece.color == t;
}

// Create the board squares.
var color = "black";
for (var i = 0; i < 64; i++) {
  board.innerHTML += `<div id="${intToCoord(i)}" class="${color}"></div>`;
  if ((i + 1) % 8 == 0) {
    continue;
  }
  if (color == "black") {
    color = "white";
  } else {
    color = "black";
  }
}

// Add the event listener.
for (var i = 0; i < board.children.length; i++) {
  var child = board.children[i];
  child.addEventListener("click", function (e) {
    if (selected) {
      var s = selected;
      selected.classList.remove("selected");
      selected = null;

      for (var e of document.querySelectorAll(".possible-move")) {
        e.classList.remove("possible-move");
      }
      for (var e of document.querySelectorAll(".last-move")) {
        e.classList.remove("last-move");
      }
      var data = {from: s.id, to: this.id};
      chess.move(data)
      tryMove(data);
      board.children[coordToInt(data.from)].classList.add("last-move");
      board.children[coordToInt(data.to)].classList.add("last-move");

    } else {
      if (!canSelect(this)) {
        return;
      }
      selected = this;
      this.classList.add("selected");

      var moves = chess.moves({square: selected.id});
      for (var move of moves) {
        if (move.length > 2) {move = move.slice(1);}
        board.children[coordToInt(move)].classList.add("possible-move");
        console.log(move);
      }
    }

  });
  if (i >= 64 - 8) {
    child.innerHTML += `<div class="notation notation-letter">${
      letters[i % 8]
    }</div>`;
  }
}

for (var i = 0; i < 64; i += 8) {
  var child = board.children[i];
  child.innerHTML += `<div class="notation">${8 - i / 8}</div>`;
}

// Load from the parameters.
const urlParams = new URLSearchParams(window.location.search);
const chess = new Chess(atob(urlParams.get("d")));

// Add the initial pieces.
for (const item of chess.board().flat()) {
  if (item == null) {
    continue;
  }
  const { square, type, color } = item;
  board.children[
    coordToInt(square)
  ].innerHTML += `<img src="img/${color}${type.toUpperCase()}.png">`;
}
