"use strict";

var letters = "abcdefgh";
var board  = document.getElementById("board");
var selected = null;

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
    child.innerHTML += `<div class="notation">${i/8 + 1}</div>`;
}