//This is our class that defines one single "Star" node, which is a node in an A* search space graph.
//It is very much like our Cell class in the generation part. This will follow a similar structure
//and will be used for the maze solving part of this code
class StarNode {
    constructor(x, y) {
        this.x = x; //Tells the x position
        this.y = y; //Tells the y position
        //For A* search, every node is associated with a "cost" based on which the traversal happens.
        //This "cost" is a function f(x) that is a sum of two values, g(x) and h(x) called the movement
        //cost and heuristic respectively. movement cost determines the cost of moving from starting point
        //to the gurrent cell, and heuristic determines the cost to move from the current cell to destination.
        this.f = 0; //Our full cost function
        this.g = 0; //movement cost g(x)
        this.h = 0; //Heuristic cost h(x)

        this.neighbors = []; //Neighbors of this node
        
        this.previous = undefined; //Previous node (to track traversal). In the begining it is undefined as the current node is the first node.
    }

    //This is a function to update the movement cost as we traverse
    set_g(new_g) {
        this.g = new_g;
        this.reset_f();
    }
    //This is a function to update the heuristic cost as we traverse
    set_h(new_h) {
        this.h = new_h;
        this.reset_f();
    }
    //This is a function to update the full cost function as we traverse. f(x) = g(x) + h(x)
    reset_f() {
        this.f = this.g + this.h;
    }
}