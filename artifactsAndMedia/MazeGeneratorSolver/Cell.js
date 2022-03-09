//This is our core class that defines our class "object".
class Cell {
    constructor(i, j) {
        this.i = i; //col
        this.j = j; //row
        this.walls = [true, true, true, true]; //booleans for wether there is a wall or not
        this.visited = false; //wether we have travelled on this cell
    }
    //A function to check for available neighbors and return a random one, if available. else return none.
    checkNeighbors() {
      let neighbors = []; //a temporary array to hold available neighbors
  
      //Assigning cardinal directions based on our ij values of the cell
      let top = grid[index(this.i, this.j - 1)]; 
      let right = grid[index(this.i + 1, this.j)];
      let bottom = grid[index(this.i, this.j + 1)];
      let left = grid[index(this.i - 1, this.j)];
  
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
    }
  
    //two functions to highlight this cell with different colours for marker cells.
    highlight() {
      let x = this.i * w + 50;
      let y = this.j * h + 50;
      noStroke();
      fill(30, 100, 255);
      rect(x, y, w, h);
      stroke(255);
    }
  
    solveHighlight() {
      let x = this.i * w + 50;
      let y = this.j * h + 50;
      noStroke();
      fill(0, 255, 0);
      rect(x, y, w, h);
      stroke(255);
    }
  
    //This is the function that takes this cell's attributes and draws the walls available
    show() {
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
    }
  
    //A function to identify if the mouseX and mouseY are in this cell. it returns true if yes.
    clicked() {
      let x = this.i * w + 50 + w/2; //we calculate the center coordinates of the cell based on the ij values.
      let y = this.j * h + 50 + h/2;
  
      let dx = dist(mouseX, 0, x, 0);//then we calculate the x and y distances of this point from (mouseX,mouseY).
      let dy = dist(0, mouseY, 0, y);
  
      //checking if this cell is clicked
      if(dx < w/2 && dy < h/2) { //if the x and y distances are within the width and height of the cell, then return true.
        return true;
      }
    }
}