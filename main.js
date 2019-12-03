var grid = [];

const EMPTY = "empty";
const WALL = "wall";
const START = "start";
const END = "end";
const clientHeight = 13;
const clientWidth = 17;

var algorSelected = false;
var currentAlgor = "";

var startPlaced = false;
var placingStart = false;
var endPlaced = false;
var placingEnd = false;
var placingWall = false;

var disp = document.getElementById("display");
var runningRandGenerator = false;

// GRID INIT
initGrid();

  /*
  Fills the draw area with a grid of interactive divs. Used on
  load and for clearing the grid.
  */
  function initGrid() {
    var e = document.getElementById("draw_area");
    for (var i = 0; i < clientHeight; i++) {
      var row = document.createElement("div");
      row.className = "row";

      for (var x = 1; x <= clientWidth; x++) {
        var cell = document.createElement("div");
        cell.style.width = "45px";
        cell.style.height = "45px";
        cell.style.borderStyle = "solid";
        cell.style.borderWidth = "thin";
        cell.id = EMPTY;
        cell.style.display = "inline-block";
        cell.onclick = function() {placeNewCell(this); };
        row.appendChild(cell);
        grid.push(cell);
      }
      e.appendChild(row);
    }

  //console.log(grid);
  }

  /*
  Clears all cells in the grid.
  */
  function clearAll() {
    for (var i = 0; i < grid.length; i++) {
      var cur = grid[i];
      
      if (cur.id == WALL || cur.id == START || cur.id == END) {
        cur.style.background = "white";
        cur.id = EMPTY;
      }
    }
  }

  /*
    Clears only walls in the grid.
  */
  function clearWalls() {
    for (var i = 0; i < grid.length; i++) {
      var cur = grid[i];

      if (cur.id == WALL) {
        cur.style.background = "white";
        cur.id = EMPTY;
      }
    }
  }

  /*
    Clears only the start point in the grid (only one can be placed at a time).
  */
  function clearStart() {
    for (var i = 0; i < grid.length; i++) {
      var cur = grid[i];

      if (cur.id == START) {
        cur.style.background = "white";
        cur.id = EMPTY;
      }
    }
  }

  /*
    Clears only the end point in the grid (only on can be placed at a time).
  */
  function clearEnd() {
    for (var i = 0; i < grid.length; i++) {
      var cur = grid[i];

      if (cur.id == END) {
        cur.style.background = "white";
        cur.id = EMPTY;
      }
    }
  }
  
  /*
    Edits a cell on the grid and turns it into either a start or end point, or a wall.
  */
  function placeNewCell(thisCell) {
    if (placingWall) {
      thisCell.style.background = "#808080";
      thisCell.id = WALL;
    } else if (placingStart) {
      clearStart();
      thisCell.style.background = "#3A5F0B";
      thisCell.id = START;
      startPlaced = true;
      placingStart = false;
    } else if (placingEnd) {
      clearEnd();
      thisCell.style.background = "#9B1C31";
      thisCell.id = END;
      endPlaced = true;
      placingEnd = false;
    }
  }

  /*
  Main run function for pathfinding. 
  */
  function run() {
    var statusMsg = "";
    var final = "";
    var node;
    var content = document.createElement("p");
    content.setAttribute("id", "msg");

    if (!algorSelected || !startPlaced || !endPlaced) {
      statusMsg += "Could not start visualization"

      if (!algorSelected) {
        statusMsg += ", please select an algorithm"
      }

      if (!startPlaced) {
        statusMsg += ", please place a start point"
      }

      if (!endPlaced) {
        statusMsg += ", please place and end point"
      }

      node = document.createTextNode(statusMsg);
      content.style.color = "red";

    } else if (algorSelected && startPlaced && endPlaced) {
      statusMsg += "Beginning visualization..."
      node = document.createTextNode(statusMsg);
      content.style.color = "green";
    }

    content.appendChild(node);
    disp.appendChild(content);
  }

  /*
  Algorithm selection indication.
  */
  function selectAlgorithm(msg) {
    if (msg == "A*") {
      createConsoleMsg("A* algorithm selected");
      currentAlgor = msg;
    }
    else if (msg == "Dijkstra") {
      createConsoleMsg("Dijkstra's algorithm selected");
      currentAlgor = msg;
    }
    else if (msg == "Sample") {
      createConsoleMsg("Sample algorithm selected");
      currentAlgor = msg;
    }
  }

  /*
    Generates a random maze.
  */
  function generateRand() {
    var statusMsg ="";
    var final = "";
    var node;
    var content = document.createElement("p");
    content.setAttribute("id", "msg");

    statusMsg += "Generating Random Maze...";
    node = document.createTextNode(statusMsg);
    content.appendChild(node);
    disp.appendChild(content);

    runningRandGenerator = true;
  }

  /*
    Creates a message and displays it in the console.
  */
  function createConsoleMsg(msg) {
    var statusMsg = msg;
    var node;
    var content = document.createElement("p");
    content.setAttribute("id", "msg");

    node = document.createTextNode(statusMsg);
    content.appendChild(node);
    disp.appendChild(content);
  }

  /*
    Modifies booleans for use with the Start and End point buttons as well
    as the place walls button.
  */
  function setStart() {
    placingStart = true;
    placingEnd = false;
    placingWall = false;
  }

  function setEnd() {
    placingStart = false;
    placingEnd = true;
    placingWall = false;
  }

  function useWall() {
    placingStart = false;
    placingEnd = false;
    placingWall = true;
  }

  /*
    Sets the seleceted algorithm.
  */
  function setAlgor(algor) {
    algorSelected = true;
    selectAlgorithm(algor);
  }