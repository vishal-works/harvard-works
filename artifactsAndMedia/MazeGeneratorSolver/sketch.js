//Maze generator and solver
//Inspired by:
//- Daniel Shiffman's Maze generator : https://www.youtube.com/watch?v=HyK_Q5rrcr4
//- Daniel Shiffman's A* search : https://www.youtube.com/watch?v=aKYlikFAV4k
//- A* algorithm reference : https://en.wikipedia.org/wiki/A*_search_algorithm

///////////////////////////////////////////////
// RUN ON FULL SCREEN FOR BEST UI EXPERIENCE //
// BEST EXPERIENCED ON GOOGLE CHROME BROWSER //
// Generates Mazes based on recursive DFS    //
// Solves the maze using A* path finding alg.//
// GSD 6483 : Maze Generator                 //
// Vishal Vaidhyanathan                      //
///////////////////////////////////////////////

///////////////////////////////////////////////
//EXTERNAL CLASSES !!                        //
//There are two external classes referenced  //
//here. AStar.js and StarNode.js             //
//This is useful to keep things organized.   //
///////////////////////////////////////////////

//Declaring our global variables
let grid = []; //contains the collection of "Cells"
let rows,cols; //contains the no of rows and cols
let w,h; // the width and height of each cell
let current; // the current cell where the next step of algorithm happens
let stack = []; //stack of travelled cells

//Lets call these..."control variables". The help us drive the control logic of the UI
let play = 0; //controls wether there is animation or not
let solveMode = 0; //checks if we are in generate or solve maze mode
let startEnd = 0; //0 : start, 1: end (used to count the start and end points of the solve)
let start, end; //Cell objects that correspomnd to the start and end positions for solving
let solver; //This contains the A* algorithm

////////////////////////////////////////////////////////////////////////////////////////////
//Setup function : Initial setup for our sketch
////////////////////////////////////////////////////////////////////////////////////////////

function setup() {
  canvas = createCanvas(windowWidth - 50, windowHeight - 50); //We are creating a canvas with 50 offset for some style
  centerUI(canvas,0,0); //Calls a function that centers UI elements based on window. Useful to make our sketch responsive.

  //We have assigned UI elements to variables to use their dimensions in planning our UI layout
  xMaze = createSlider(5,25,15); //Controles the size of the grid (the number of cells in x and y)
  centerUI(xMaze,100,height/2 - 225);

  //It is easier to write UI listener functions implicitly when we wont need them later!
  xMaze.input(() => {
    play = 0; //we set the play to 0 here so that in case the grid size is changed while animation is going on, we want it to stop.
    generate.html(" G E N E R A T E "); //Using .html() is a nice handy trick to change html properties of elements. Here, we change the button text
    createGridData(xMaze.value(), xMaze.value());
  }); //The .input() function allows us to define a set of actions as the slider is controlled real-time.

  generate = createButton(" G E N E R A T E ") //This is the button that initiates the generation process.
  .mousePressed(() => {
    if(animate.checked()) { //Checking if we need to animate the generation or go step-by-step
      generate.html(" G E N E R A T E ");
      play = (play + 1) % 2; //A really handy trick to switch between 0 and 1. generally, we can use x = (x + n - 1) % n.
      if(play == 1){
        generate.html(" S T O P "); //Just a UI offering, we want to use the same button to start, stop and step generation.
      } else {
        generate.html(" C O N T I N U E ");
      } 
    } else {
      play = 0;
      generate.html(" S T E P ");
      generateMaze(); 
    }
    //What happens above is, we smartly use switching of control variables to run for all combinations of the animate checkbox and the generate button.
    //So, if the animate is checked, clicking the generate button will run our generateMaze function continuously. If animate is unchecked, we can use the
    //generate button as a step button! itll run the generateMaze function frame by frame, as the control variables "catch" the draw loop each frame.
    
  });
  generate.position(xMaze.x + xMaze.width + 50, xMaze.y - 35);
  generate.size(xMaze.width, 50);

  reset = createButton(" R E S E T ") //The reset button resets all variables. It is used to reset generation and try a new generation.
  .mousePressed(() => { //implicit definition of the click button function
    //resetting grid data and other variables
    createGridData(xMaze.value(), xMaze.value());
    play = 0;
    solveMode = 0;
    startEnd = 0;
    start = undefined;
    end = undefined;
    current = grid[0];
    generate.html(" G E N E R A T E "); //We are also resetting the button texts!
    solve.html(" S O L V E ");
  });
  reset.position(xMaze.x, xMaze.y + 80);
  reset.size(xMaze.width, 50);

  //This is the solve button. Follows the same logic as the generate button. Only difference is, you cant do step by step.
  solve = createButton(" S O L V E ")
  .mousePressed(() => {
    solveMode = (solveMode + 1) % 2;
    if(solveMode == 1){
      solve.html(" S T O P ");
    } else {
      solve.html(" C O N T I N U E ");
    } 
  });
  solve.position(xMaze.x + reset.width + 50, xMaze.y + 80);
  solve.size(xMaze.width, 50);

  //This is our checkbox to toggle animation
  animate = createCheckbox('', true);
  animate.position(generate.x + generate.width + 50, generate.y + 15);

  //creating grid data. Function definition is below
  createGridData(xMaze.value(), xMaze.value());
}

////////////////////////////////////////////////////////////////////////////////////////////
//Draw function : All the logic that runs frame by frame
////////////////////////////////////////////////////////////////////////////////////////////

function draw() {
  background(25); 

  //Setting label properties
  textSize(15);
  fill(255);
  textAlign(LEFT, CENTER);
  noStroke();

  //Labels for UI elements
  text("M A Z E   S I Z E", xMaze.x - 15, xMaze.y - 50);
  text(" A N I M A T E ", animate.x + 10, animate.y - 15);

  //UI rectangles
  noFill();
  stroke(255);
  maze = rect(50, 50, height - 100, height - 100);
  controls = rect(height - 100 + 50 + 50, height - 100 + 50 - 250, width - height - 50, 250);

  //Resetting our styles
  fill(255);

  //Setting title properties
  textSize(30);

  //Title texts
  text(" I N S T R U C T I O N S ", height - 100 + 50 + 50, 75);
  text(" C O N T R O L S ", height - 100 + 50 + 50 ,height - 100 -250);

  //instruction text
  textSize(20);
  textAlign(LEFT, CENTER);
  noStroke();
  text(" 1. Use the slider to adjust maze grid resolution ", height - 100 + 50 + 50, 130);
  text(" 2. The generate button generates a random maze ", height - 100 + 50 + 50, 180);
  text(" 3. You can pause the generation by clicking the same button again ", height - 100 + 50 + 50, 230);
  text(" 4. You can also turn off animation and go step-by-step ", height - 100 + 50 + 50, 280);
  text(" 5. Once the maze is generated, click on the Solve button to turn on solve mode ", height - 100 + 50 + 50, 330);
  text(" 6. While in solve mode, you need to choose 2 cells as your start and end points ", height - 100 + 50 + 50, 380);
  text(" 7. You can reset the generation many times by clicking on the reset button ", height - 100 + 50 + 50, 430);
  text(" 8. As soon as the solution is displayed, the program ends. Reload to start again! ", height - 100 + 50 + 50, 480);

  fill(255);

  //Showing grid for every frame (as we need the grid dynamically based on slider values)
  for (let i = 0; i < grid.length; i++) {
    grid[i].show(); //show is a function that draws our grid data on the canvas
  }

  //Procedurally generating maze. This is our first part.
  if(play == 1){
    generateMaze(); //The function that generates the Maze
  }

  //Solving maze : Once we generate the maze, we run the solving logic.
  if(solveMode == 1){
    solveMaze();
  }

  //Visualizing the cells (These are the two endpoints that we click for the solving)
  if(start){
    start.solveHighlight();
  }
  if(end){
    end.solveHighlight();
  }
}

////////////////////////////////////////////////////////////////////////////////////////////
//All our helper functions !
////////////////////////////////////////////////////////////////////////////////////////////

//A generic mousePressed function is defined here to capture which cell object we click
function mousePressed() {
  if(solveMode == 1) {
    getStartEnd(); //This is the function that finds the cell and assigns it as the start and end objects for the solving
  }
}
//This is the function that centers the UI elements based on element dimensions and window dimensions
//One useful aspect of this function is we can also pass the offset values to adjust our UI
function centerUI(element, xOffset, yOffset) {
  let x, y;

  if(element == canvas) {
    x = (windowWidth - width) / 2 + xOffset;
    y = (windowHeight - height) / 2 + yOffset;
  } else {
    x = windowWidth / 2 + xOffset;
    y = windowHeight / 2 + yOffset;
  }
  element.position(x, y);
}

//This is the function that creates our grid data based on the "gird size" xMaze slider value
function createGridData(x, y) {
  //Creating a grid of cells
  grid = [];

  w = (height - 100)/x; //We calculate the width with respect to the containing UI rectangle
  h = (height - 100)/y; //We calculate the height with respect to the containing UI rectangle

  cols = x; //x is the number of columns
  rows = y; //y us the number of rows

  //For each row and column, push a Cell object to our grid array. Cell object is defined below
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      var cell = new Cell(i, j);
      grid.push(cell);
    }
  }

  //Setting start position is initialised at the top left
  current = grid[0];
}

//This is our core function that defines our class "object". Here, the Cell object is defined like a function, but by using a 'this' pointer.
function Cell(i, j) {
  this.i = i; //col
  this.j = j; //row
  this.walls = [true, true, true, true]; //booleans for wether there is a wall or not
  this.visited = false; //wether we have travelled on this cell

  //A function to check for available neighbors and return a random one, if available. else return none.
  this.checkNeighbors = function() {
    let neighbors = []; //a temporary array to hold available neighbors

    //Assigning cardinal directions based on our ij values of the cell
    let top = grid[index(i, j - 1)]; 
    let right = grid[index(i + 1, j)];
    let bottom = grid[index(i, j + 1)];
    let left = grid[index(i - 1, j)];

    //checking which neighbor is unvisited, and adding them to our array if they exist.
    if (top && !top.visited) {
      neighbors.push(top);
    }
    if (right && !right.visited) {
      neighbors.push(right);
    }
    if (bottom && !bottom.visited) {
      neighbors.push(bottom);
    }
    if (left && !left.visited) {
      neighbors.push(left);
    }

    //if there are any neighbors available, then return one at random, else return none.
    //Here, 'undefined' is used to say none.
    if (neighbors.length > 0) {
      let r = floor(random(0, neighbors.length));
      return neighbors[r];
    } else {
      return undefined;
    }
  };

  //two functions to highlight this cell with different colours for marker cells.
  this.highlight = function() {
    let x = this.i * w + 50;
    let y = this.j * h + 50;
    noStroke();
    fill(30, 100, 255);
    rect(x, y, w, h);
    stroke(255);
  };

  this.solveHighlight = function() {
    let x = this.i * w + 50;
    let y = this.j * h + 50;
    noStroke();
    fill(0, 255, 0);
    rect(x, y, w, h);
    stroke(255);
  };

  //This is the function that takes this cell's attributes and draws the walls available
  this.show = function() {
    let x = this.i * w + 50;
    let y = this.j * h + 50;
    stroke(80);
    strokeWeight(3);

    //Checking which walls exist, and are to be drawn
    if (this.walls[0]) {
      line(x, y, x + w, y); //drawing them if they exist, as a line segment
    }
    if (this.walls[1]) {
      line(x + w, y, x + w, y + h);
    }
    if (this.walls[2]) {
      line(x + w, y + h, x, y + h);
    }
    if (this.walls[3]) {
      line(x, y + h, x, y);
    }

    //Resetting stroke weight
    strokeWeight(1);

    //This draws a box on the cell if it was travelled on. (visited)
    if (this.visited) {
      noStroke();
      fill(25);
      rect(x, y, w, h);
    }
    //And finally, we highlight the current cell which is our cursor
    current.highlight();
  };

  //A function to identify if the mouseX and mouseY are in this cell. it returns true if yes.
  this.clicked = function() {
    let x = this.i * w + 50 + w/2; //we calculate the center coordinates of the cell based on the ij values.
    let y = this.j * h + 50 + h/2;

    let dx = dist(mouseX, 0, x, 0);//then we calculate the x and y distances of this point from (mouseX,mouseY).
    let dy = dist(0, mouseY, 0, y);

    //checking if this cell is clicked
    if(dx < w/2 && dy < h/2) { //if the x and y distances are within the width and height of the cell, then return true.
      return true;
    }
  };
}
//Function that generates the maze. This uses all the Cell object functions and executes a recursive DFS algorithm.
//you can read more about this here : https://en.wikipedia.org/wiki/Maze_generation_algorithm#Recursive_implementation
function generateMaze() {
  //generating maze
  current.visited = true; //We first mark the current cell as visited
  current.highlight(); //And we highlight the cursor at this stage

  //Step1 : Getting a random available neighbour
  let next = current.checkNeighbors();
  if (next) { //If we get a neighbor, add to stack
    next.visited = true; //mark it as visited

    //Step2 : add to stack
    stack.push(current);

    //Step3 : remove the walls
    removeWalls(current, next); //A function that finds which wall is adjacent to the input cells and removes it

    //Step4 : make this neighbor the current cell and proceed.
    current = next;
  } else if (stack.length > 0) { //if there are no more available neighbors for the current cell, 
    current = stack.pop(); //go back to the previous position and remove it from the stack
  }
}

//function that gives 1D index from i and j of cells. Useful to locate cells in the grid array
function index(i, j) {
  if (i < 0 || j < 0 || i > cols - 1 || j > rows - 1) { //checking invalid values
    return -1;
  }
  return i + j * cols;
}

//A function that finds which wall is adjacent to the input cells and removes it
function removeWalls(a, b) {
  let x = a.i - b.i; //finding x distance
  if (x === 1) { //remove the corresponding left/right walls based on adjacency
    a.walls[3] = false;
    b.walls[1] = false;
  } else if (x === -1) {
    a.walls[1] = false;
    b.walls[3] = false;
  }
  let y = a.j - b.j; //finding y distance
  if (y === 1) { //remove the corresponding top/bottom walls based on adjacency
    a.walls[0] = false;
    b.walls[2] = false;
  } else if (y === -1) {
    a.walls[2] = false;
    b.walls[0] = false;
  }
}

//This is a function for the solving workflow. It gets a clicked cell object from the UI, and assigns it to start and end.
//Here, we meed two cells, one to start and one to end. So we use control variable startEnd, that counts this and manages the
//assigning logic
function getStartEnd() {
  if(startEnd == 0){ //if no cells are selected
    for (let i = 0; i < grid.length; i++) {
      if(grid[i].clicked()) { //check which is clicked
        start = grid[i];
        startEnd = 1;
        current = start;
      }
    }
  } 
  else if(startEnd == 1){ //if start cell is selected
    for (let i = 0; i < grid.length; i++) {
      if(grid[i].clicked()) {//check which is clicked
        end = grid[i];
        startEnd = 2;
      }
    }
    //Once we did that, we define a 2D grid based on the current status of our grid to pass it to
    //the AStar algorithm in the AStar.js script.
    let solveGrid = [];
    for (let j = 0; j < rows; j++) {
      solveGrid.push([]); //pushing an empty row to make it 2D
      for (let i = 0; i < cols; i++) {
        solveGrid[j].push(grid[j * rows + i]); //adding the corresponding cell from 1D array grid
      }
    }
    
    solver = new AStar(solveGrid, w, h, start, end); //creating our AStar algorithm object to solve our maze
  
    //Passing information about the generated maze cells based on their walls. If there is no wall in a side, we add the adjacent cell as neighbor.
    for (let i = 0; i < solver.rows; i++) {
      for (let j = 0; j < solver.cols; j++) {
        console.log(i,j);
        if (i > 0 && solver.maze[i][j].walls[0] === false) { //top
          solver.grid[i][j].neighbors.push(solver.grid[i-1][j]);
        }
        if (j < solver.cols-1 && solver.maze[i][j].walls[1] === false) { //right
          solver.grid[i][j].neighbors.push(solver.grid[i][j+1]);
        }
        if (i < solver.rows-1 && solver.maze[i][j].walls[2] === false) { //bottom
          solver.grid[i][j].neighbors.push(solver.grid[i+1][j]);
        }
        if (j > 0 && solver.maze[i][j].walls[3] === false) { //left
          solver.grid[i][j].neighbors.push(solver.grid[i][j-1]);
        }
      }
    }
  }
}

//The final function that runs the AStar algorithm and draws its path!
function solveMaze() {
  if(startEnd == 2) { //checking if we have both start and end.
    //generating solution
    solver.get_next_move();
  }
}