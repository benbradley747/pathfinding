//Const variables that are used to determine the type of a display element.
//These consts are used as IDs for the div elements in the draw_area.
const EMPTY = "empty";
const WALL = "wall";
const START = "start";
const END = "end";
const ALL = "all";

//Width and height measured in cells inside of the draw_area.
const clientWidth = 17;
const clientHeight = 13;

//Building the 2D array that contains the display elements.
var grid = new Array(clientWidth);
build2DArray(grid);

//Building the 2D array that contains the logic elements.
var cellGrid = new Array(clientWidth);
build2DArray(cellGrid);

var algorSelected = false;
var currentAlgor = "";

var startPlaced = false;
var placingStart = false;
var endPlaced = false;
var placingEnd = false;
var placingWall = false;

//Display variable that represents the contents of the console window.
var disp = document.getElementById("display");

//Unitialized variables used during pathfinding.
var startpoint;
var endpoint;

// GRID INIT
initGrid();

  //Pathfinding algorithms/////////////////////////
  function astar() {
    var openList = [];
    var closedList = [];
    openList.push(start);
  }

  function djikstra()
  {

  }

  function sample()
  {
    var mainCellList = [];
    endpoint.counter = 0;
    mainCellList.push(endpoint);
    var iterator = 0;
    var assignCounter = setInterval(findPath, 50)
    function findPath()
    {
      var cur = mainCellList[iterator];
      var surrounding = mainCellList[iterator].surrounding();
      for (var i = 0; i < surrounding.length; i++)
      {
        for (var j = 0; j < mainCellList.length; j++)
        {
          if ((surrounding[i].col != mainCellList[j].col || surrounding[i].row != mainCellList[j].row) && mainCellList.indexOf(surrounding[i]) == -1)
          {
            surrounding[i].counter = cur.counter + 1;
            mainCellList.push(surrounding[i]);
            var div = grid[mainCellList[mainCellList.length - 1].col][mainCellList[mainCellList.length - 1].row];
            div.innerHTML = cur.counter + 1;
            if (div.style.backgroundColor == "white")
              div.style.backgroundColor = getColorCode(cur.counter + 1);
            div.style.fontFamily = "Courier New";
            div.onmouseover = null;
            div.onmouseout = null;
          }
        }
      }
      if (mainCellList.indexOf(startpoint) == -1) 
      {
        iterator++;
      }
      else
      {
        clearInterval(assignCounter);
        samplePart2();
      }
    }
    function samplePart2()
    {
      var cur = startpoint;
      var displayPath = setInterval(sample_loop, 150)
      function sample_loop()
      {
        var paths = [];
        paths = cur.surrounding();
        for (var i = 0; i < paths.length; i++)
        {
          if (paths[i].counter == Number.MAX_SAFE_INTEGER)
          {
            paths.splice(i, 1);
            i = -1;
          }
        }
        var next_node = paths[0];
        for (var i = 0; i < paths.length; i++)
        {
          if (paths[i].counter <= next_node.counter)
          {
            next_node = paths[i];
          }
        }
        cur = next_node;
        if (next_node.type != "end")
        {
          next_node.markVisited();
        }
        else
        {
          clearInterval(displayPath);
        }
      }
    }
  }


  /////////////////////////////////////////////////

  /*
  Fills the draw area with a grid of interactive divs.
  */
  function initGrid() {
    var e = document.getElementById("draw_area");
    for (var y = 0; y < clientHeight; y++) {
      var row = document.createElement("div");
      row.className = "row";
      row.style.maxHeight = 47;
      row.style.verticalAlign = "top";
      for (var x = 0; x < clientWidth; x++) {
        var cell = document.createElement("div");
        cell.style.width = "45px";
        cell.style.height = "45px";
        cell.style.borderStyle = "solid";
        cell.style.borderColor = "#808080";
        cell.style.borderWidth = "thin";
        cell.style.background = "white";
        cell.style.textALign = "center";
        cell.id = EMPTY;
        cell.style.display = "inline-block";
        cell.style.verticalAlign = "top";
        cell.onclick = function() { placeNewCell(this); };
        setHighlight(cell);
        row.appendChild(cell);
        grid[x][y] = cell;
        cellGrid[x][y] = new Cell(x, y);
        cellGrid[x][y].setCounter = Number.MAX_SAFE_INTEGER;
      }
      e.appendChild(row);
    }
    //Used for debugging
    //console.log(cellGrid);
  }

  /*
    Takes an array as an argument and builds a 2D array. 
  */
  function build2DArray(arr) {
    for (var i = 0; i < arr.length; i++) {
      arr[i] = new Array(clientHeight);
    }
  }

  /*
    Syncs up div grid with cellGrid, used to push changes in the cellGrid to the UI
  */
  function pushToUI()
  {
    for (var i = 0; i < clientWidth; i++)
    {
      for (var j = 0; j < clientHeight; j++)
      {
        if (cellGrid[i][j].type == "wall")
        {
          grid[i][j].id = WALL;
          grid[i][j].style.background = "#808080";
        }
        if (cellGrid[i][j].type == "passage")
        {
          grid[i][j].id = EMPTY;
          grid[i][j].style.background = "white";
        }
      }
    }
  }

  /*
    Searches all cells in the grid and clears them based on an arugment.
  */
  function clearCells(toBeCleared) {
    for (var i = 0; i < clientWidth; i++) {
      for (var j = 0; j < clientHeight; j++) {
        var curDiv = grid[i][j];
        var curCell = cellGrid[i][j];
        if (toBeCleared != ALL) {
          if (curDiv.id == toBeCleared) {
            curDiv.style.background = "white";
            curDiv.id = EMPTY;
            curDiv.innerHTML = "";
            setHighlight(curDiv);
            curCell.setPassage();
            curCell.visited = false;
          }
        } else {
          if (curDiv.id == WALL || curDiv.id == START || curDiv.id == END || curDiv.id == EMPTY) {
            curDiv.style.background = "white";
            curDiv.id = EMPTY;
            curDiv.innerHTML = "";
            curCell.setPassage();
            curCell.counter = Number.MAX_SAFE_INTEGER;
            curCell.visited = false;
            curDiv.onmouseover = function () { this.style.backgroundColor = "#D3D3D3"; };
            curDiv.onmouseout = function  () { this.style.backgroundColor = getBackgroundColor(this); };
          }
        }
      }
    }
  }

  /*
    Clears all cells in the grid by calling 'searchCells()' with ALL as an argument
  */
  function clearAll() {
    clearCells(ALL);
  }
  
  /*
    Edits a cell on both grids and turns it into either a start or end point, or a wall.
  */
  function placeNewCell(thisCell) {
    var tempLoc = getLocation(thisCell);
    var col = tempLoc[0];
    var row = tempLoc[1];
    if (placingWall) {
      thisCell.style.background = "#808080";
      thisCell.id = WALL;
      cellGrid[col][row].setWall();
    } else if (placingStart) {
      clearCells(START);
      thisCell.style.background = "#3A5F0B";
      thisCell.id = START;
      cellGrid[col][row].setStart();
      startpoint = cellGrid[col][row];
      startPlaced = true;
    } else if (placingEnd) {
      clearCells(END);
      thisCell.style.background = "#9B1C31";
      thisCell.id = END;
      cellGrid[col][row].setEnd();
      endpoint = cellGrid[col][row];
      endPlaced = true;
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
        statusMsg += ", please place an end point"
      }

      node = document.createTextNode(statusMsg);
      content.style.color = "red";

    } else if (algorSelected && startPlaced && endPlaced) {
      statusMsg += "Beginning visualization..."
      node = document.createTextNode(statusMsg); 
      content.style.color = "green";

      //TODO - logic by cellGrid not by grid
      if (currentAlgor == "A*") 
      {
        astar();
      }

      if (currentAlgor == "Dijkstra")
      {
        djikstra();
      }

      if (currentAlgor == "Sample")
      {
        sample();
      }
      startPlaced = false;
      endPlaced = false;
    }
    content.appendChild(node);
    disp.appendChild(content);
    document.getElementById("console_area").scrollTop = disp.scrollHeight;
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
    clearAll();
    var statusMsg ="";
    var final = "";
    var node;
    var content = document.createElement("p");
    content.setAttribute("id", "msg");

    statusMsg += "Generating Random Maze...";
    node = document.createTextNode(statusMsg);
    content.appendChild(node);
    disp.appendChild(content);
    document.getElementById("console_area").scrollTop = disp.scrollHeight;

    runningRandGenerator = true;

    //Start with a Grid full of Cells in state Blocked.
    for (var i = 0; i < clientWidth; i++) {
      for (var j = 0; j < clientHeight; j++) {
        var curDiv = grid[i][j];
        var curCell = cellGrid[i][j];
        curDiv.style.background = "#808080";
        curDiv.id = WALL;
        setHighlight(curDiv);
        curCell.setWall();
      }
    }

    //Pick a random Cell, set it to state Passage and Compute its frontier cells. 
    var allFrontierCells = [];
    var cur = cellGrid[Math.floor(Math.random() * clientWidth/2) * 2][Math.floor(Math.random() * clientHeight/2) * 2];
    cur.setPassage();
    setHighlight(cur);
    var frontierTemp = cur.frontiers();
    for (var i = 0; i < frontierTemp.length; i++)
    {
      allFrontierCells.push(frontierTemp[i]);
    }

    /* While the list of frontier cells is not empty:
          1. Pick a random frontier cell from the list of frontier cells.
          2. Pick a random neighbor and connect the frontier cell with the neighbor by setting the cell in-between to state Passage. 
             Compute the frontier cells of the chosen frontier cell and add them to the frontier list. 
             Remove the chosen frontier cell from the list of frontier cells.
    */
    while (allFrontierCells.length != 0)
    {
      var curNeighbor;
      cur = allFrontierCells[Math.floor(Math.random() * allFrontierCells.length)];
      var tempNeighbors = [];
      tempNeighbors = cur.neighbors();
      curNeighbor = tempNeighbors[Math.floor(Math.random() * tempNeighbors.length)];

      allFrontierCells.splice(allFrontierCells.indexOf(cur), 1);
      frontierTemp = cur.frontiers();
      for (var i = 0; i < frontierTemp.length; i++)
      {
        if (allFrontierCells.indexOf(frontierTemp[i]) == -1)
          allFrontierCells.push(frontierTemp[i]);
      }

      if (cur.row == curNeighbor.row)
      {
        var passage = cellGrid[((cur.col + curNeighbor.col)/2)][cur.row];
      }
      if (curNeighbor.col == cur.col)
      {
        var passage = cellGrid[cur.col][((cur.row + curNeighbor.row)/2)];
      }
      cur.setPassage();
      passage.setPassage();
    }
    pushToUI();
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
    document.getElementById("console_area").scrollTop = disp.scrollHeight;
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
    Sets the selected algorithm.
  */
  function setAlgor(algor) {
    algorSelected = true;
    selectAlgorithm(algor);
  }

  /*
    Function to get grid column and row for a given div in the div grid
  */
  function getLocation(div) {
    var cellCol;
    var cellRow;
    var cur = grid[0][0];
    var neighborArr = [];
    for (var i = 0; i < clientWidth; i++)
    {
      for (var j = 0; j < clientHeight; j++)
      {
        cur = grid[i][j];
        if (div === cur)
        {
          cellCol = i;
          cellRow = j;
          return [cellCol, cellRow];
        }
      }
    }
  }

  /*
    Sets the background color of a cell based on its id. Used with the setHighlight() function
    to create a highlighted cursor effect on the grid.
  */
  function getBackgroundColor(thisCell) {
    if (thisCell.id == EMPTY) {
      var loc = getLocation(thisCell);
      if (cellGrid[loc[0]][loc[1]].visited == true)
      {
        return "#b5d6ff";
      }
      return "white";
    } else if (thisCell.id == WALL) {
      return "#808080";
    } else if (thisCell.id == START) {
      return "#3A5F0B";
    } else {
      return "#9B1C31";
    }
  }

  /*
    Changes the onmouseover and onmouseout properties of a cell it takes as an argument.
    Used to create a highlighted cursor effect on the grid.
  */
  function setHighlight(thisCell) {
    thisCell.onmouseover = function () { this.style.backgroundColor = "#D3D3D3"; };
    thisCell.onmouseout = function  () { this.style.backgroundColor = getBackgroundColor(thisCell); };
  }

  /*
    Takes an integer as an arugment and converts it to hex color code based
    on the size of the integer in the form of a string. Used for the pathfinding 
    visualization.

    Shades in increasing order :
    
    ORANGE v1
    #FFAF7A
    #FF9D5C
    #FF8B3D
    #FF781F
    #FF6600
    
  */
  function getColorCode(counter) {
    if (counter <= 5)
      return "#FFAF7A";
    else if (counter > 5 && counter <= 10)
      return "#FF9D5C";
    else if (counter > 10 && counter <= 15)
      return "#FF8B3D";
    else if (counter > 15 && counter <= 20)
      return "#FF781F";
    else
      return "#FF6600";
  }
