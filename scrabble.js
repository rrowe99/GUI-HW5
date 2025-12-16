/*
  Author: Richard Rowe - richard_rowe@student.uml.edu
  Course: COMP 4610 – GUI I
  Assignment: HW5 – Scrabble Drag & Drop
*/

let totalScore = 0;

$(document).ready(function () {
  dealTiles();
  makeDroppable();
});

/* ---------------- TILE DEALING ---------------- */

function getRandomTile() {
  let letters = Object.keys(ScrabbleTiles);
  let letter;

  do {
    letter = letters[Math.floor(Math.random() * letters.length)];
  } while (
    ScrabbleTiles[letter]["number-remaining"] === 0 ||
    letter === "_"   // ← SKIP BLANK TILE
  );

  ScrabbleTiles[letter]["number-remaining"]--;
  return letter;
}

function dealTiles() {
  let currentTiles = $("#rack .tile").length;

  for (let i = currentTiles; i < 7; i++) {
    let letter = getRandomTile();

    let img = $("<img>")
      .attr("src", `Scrabble_Tiles/Scrabble_Tile_${letter}.jpg`)
      .addClass("tile")
      .data("letter", letter)
      .draggable({
        revert: "invalid",
        containment: "document"
      });

    $("#rack").append(img);
  }
}

/* ---------------- DRAG & DROP ---------------- */

function makeDroppable() {
  $(".square").droppable({
  accept: ".tile",
  drop: function (event, ui) {
    if ($(this).children(".tile").length === 0) {
        ui.draggable.css({
        top: 0,
        left: 0,
        zIndex: 20
    });
    $(this).append(ui.draggable);
}
}
});

$("#rack").droppable({
    accept: ".tile",
    drop: function (event, ui) {
        $(this).append(ui.draggable);
        ui.draggable.css({ top: 0, left: 0 });
    }
});
}

/* ---------------- ADJACENCY CHECK ---------------- */

function validPlacement() {
  let placed = $(".square .tile");
  if (placed.length <= 1) return true;

  let indices = [];
  placed.each(function () {
    indices.push($(this).parent().index());
  });

  indices.sort((a, b) => a - b);

  for (let i = 1; i < indices.length; i++) {
    if (indices[i] !== indices[i - 1] + 1) {
      return false;
    }
  }
  return true;
}

/* ---------------- SCORING ---------------- */

function calculateScore() {
  let roundScore = 0;
  let wordMultiplier = 1;

  $(".square").each(function () {
    let tile = $(this).find(".tile");
    if (tile.length) {
      let letter = tile.data("letter");
      let value = ScrabbleTiles[letter].value;

      if ($(this).hasClass("double-letter")) value *= 2;
      if ($(this).hasClass("triple-letter")) value *= 3;
      if ($(this).hasClass("double-word")) wordMultiplier *= 2;
      if ($(this).hasClass("triple-word")) wordMultiplier *= 3;

      roundScore += value;
    }
  });

  return roundScore * wordMultiplier;
}

/* ---------------- BUTTONS ---------------- */

$("#submitWord").click(function () {
  if (!validPlacement()) {
    alert("Tiles must be placed next to each other!");
    return;
  }

  let score = calculateScore();
  totalScore += score;

  $("#score").text("Score: " + totalScore);

  $(".square").empty();
  dealTiles();
});

$("#restart").click(function () {
  location.reload();
});
