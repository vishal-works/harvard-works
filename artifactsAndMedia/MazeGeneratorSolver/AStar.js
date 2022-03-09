//This is the main class that defines our A* search using the StarNode class instances as the nodes of searching.
class AStar {
    constructor(maze, sq_width, sq_height, start, end) {
        this.maze = maze; //gets the generated maze grid as a 2D grid of Cell instances
        this.rows = maze.length; //This gets the total number of rows in the grid
        this.cols = maze[0].length; //This gets the total number of cols in the grid
        this.sq_width = sq_width; //This is the width of each cell
        this.sq_height = sq_height; //This is the height of each cell
        this.grid = []; //Now we create a new grid variable in the A* search to replace the generated maze of Cell instances
        //with StarNode instances, taking the i and j values and the neighbor information of the cells. We get neighbor information in sketch.js itself.
        // Create the grid of A* points with the Cell ij values
        for (let i = 0; i < this.rows; i++) {
            this.grid.push([]);
            for (let j = 0; j < this.cols; j++) {
                this.grid[i].push(new StarNode(j,i));
            }
        }
        // We need variables to now keep track of our traversal. We will keep track in two ways, one: all nodes of paths currently explored in open_set,
        //and the final best cost path nodes in our closed_set.
        this.open_set = []; //the open set
        this.closed_set = []; //the closed set
        this.start = this.grid[start.j][start.i]; //We get the start and stop information from what the user clicks from sketch.js
        this.end = this.grid[end.j][end.i];
        this.open_set.push(this.start); //and we add the start node to our open set to start our search.
    }
    //In our case, the heuristic cost is defined as the euclidian distance between the current point and the end point of the maze. We want to lower
    //this distance while searching for the optimal path.
    heuristic(sq) {
        return dist(sq.x, sq.y, this.cols, this.rows);
    }
    //Now we write a function that calculates the cost for each node, checks if the cost is lower than the previous winner (node with lowest cost)
    //then we add this as the new winner. And every time we have a winner, we push it to the closed_set from the open set.
    get_next_move() {
        let current;
        if (this.open_set.length > 0) {
            let winner = 0;
            for (let i = 1; i < this.open_set.length; i++) {
                if (this.open_set[i].f < this.open_set[winner].f) { //checking the costs of current node and winner
                    winner = i; //if current is the new winner, update here
                }
            }
            // Pop the winner off the open set
            current = this.open_set.splice(winner,1)[0];
            this.closed_set.push(current); //add the winner to the closed set

            // Did you reach the end? then stop the draw() loop, or continue the search
            if (current == this.end) {
                noLoop(); //the noLoop function is a handy command to stop the draw() loop and end the sketch.
                console.log("Done!"); //Yay
            }

            // If we did not reach the end, Check all the current node's neighbors. This is the main algorithm of the search.
            for (let n of current.neighbors) {
                if (!this.closed_set.includes(n)) { //if the neighbor does not exist in our closed_set,
                    let temp_g = current.g + 1; //update the movement cost temporarily
                    let new_path = false; //A control variable that keeps track weather we are contining in the same path or trying a new path
                    if (this.open_set.includes(n)) { //If it exists in the open_set, check if the temp movement cost is lower than the neighbor
                        if (temp_g < n.g) {
                            n.g = temp_g; //then we update the movement cost of this neighbor and start a new path from here
                            new_path = true;
                        }
                    } else {
                        n.g = temp_g; //If it doesn't exist in the open_set, we directly update the movement cost of the neighbor, start a new path,
                        //and add it to the open set.
                        new_path = true;
                        this.open_set.push(n);
                    }

                    if (new_path) { //If it is a new path, then calculate the heuristic cost, and update the overall cost function and traverse!
                        n.h = this.heuristic(n);
                        n.f = n.g + n.h;
                        n.previous = current;
                    }
                } //If it is not a new path or if the closed set already contains the neighbor, then just keep checking for the next neighbor.
            }
         //If there is nothing in the open_set, then there is no solution  :(  
        } else {
            console.log("No solution...");
            return;
        }

        //Now we want to draw the path taken by the "current" node real-time to show the solving process as a frame by frame animation controlled
        //by the draw() loop. So we create a function to do this every frame.
        this.draw_path(current);
    }

    //This is the funciton that draws the path
    draw_path(c) {
        //Create the path
        let path = []; //creating an empty list for path. This reinitiates everytime this function is called. This means that the path is drawn
        //over and over again each frame based on it's new vertices.
        let tmp = c;
        path.push(tmp);
        //See! This is why we keep track of the previous StarNode!
        while (tmp.previous) { //While a previous exists, we add all of the previous cells of the current cell up to the beginning
            path.push(tmp.previous);
            tmp = tmp.previous;
        }
        // Now, to display the path, we can use the beginShape() command as it can dynamically be updated through a list of vertices (StarNodes)
        let w = this.sq_width; //width of cell
        let h = this.sq_height; //height of cell
        noFill(); //We just need a stroke
        //Setting stroke styles
        stroke(0, 100, 255);
        strokeWeight(5);
        strokeCap(ROUND);
        //Beginning our shape. For every node in path, draw a path in the middle of these cells
        beginShape();
        for (let n of path) {
            vertex(
                n.x * w + w / 2 + 50, //x vertex is calculated for the middle of the cell based on cell width
                n.y * h + h / 2 + 50 //y vertex is calculated for the middle of the cell based on cell height
            );
        }
        endShape();

        //resetting our styles
        strokeWeight(1);
        noStroke();

        //DONE! YAY
        
    }
}
