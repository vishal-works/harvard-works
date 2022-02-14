// // A Koch snowflake
// let axiom = 'F';
// let rules = {
//   'F': 'F+F--F+F',
//   '+': '+',
//   '-': '-'
// };
// let generations = 4;
// let segmentLength = 10;
// let angle = 60;

// // A quadratic Koch snowflake
// let axiom = 'F';
// let rules = {
//   'F': 'F+F-F-F+F',
//   '+': '+',
//   '-': '-'
// };
// let generations = 4;
// let segmentLength = 10;
// let angle = 90;

// // A quadratic Koch island
// let axiom = 'F-F-F-F';
// let rules = {
//   'F': 'F+FF-FF-F-F+F+FF-F-F+F+FF+FF-F',
//   '+': '+',
//   '-': '-'
// };
// let generations = 2;
// let segmentLength = 10;
// let angle = 90;

// // Islands and lakes!
// let axiom = 'F+F+F+F';
// let rules = {
//   'F': 'F+f-FF+F+FF+Ff+FF-f+FF-F-FF-Ff-FFF',
//   'f': 'ffffff',
//   '+': '+',
//   '-': '-'
// };
// let generations = 2;
// let segmentLength = 10;
// let angle = 90;

// // Sierpinski gasket!
// let axiom = 'A';
// let rules = {
//   'A': 'B-A-B',
//   'B': 'A+B+A',
//   '+': '+',
//   '-': '-'
// };
// let generations = 6;
// let segmentLength = 10;
// let angle = 60;

// // Hexagonal Gosper curve
// let axiom = 'L';
// let rules = {
//   'L': 'L+R++R-L--LL-R+',
//   'R': '-L+RR++R+L--L-R',
//   '+': '+',
//   '-': '-'
// };
// let generations = 5;
// let segmentLength = 10;
// let angle = 60;

// Tree
let axiom = '0';
let rules = {
  '1': '11',
  '0': '1[0]0',
  '[': '[',
  ']': ']'
};
let generations = 7;
let segmentLength = 3;
let angle = 0;




// Generate a few generations of the L-system
let sequence = generateSequence(generations, axiom, rules);
console.log(sequence);

let limit = 0;
let nodes = [];

// p5.js setup
function setup() {
  createCanvas(windowWidth, windowHeight);

  // nodes.push(new Draggable(windowWidth / 2, windowHeight / 2, 10));
  nodes.push(new Draggable(0.5 * windowWidth, windowHeight - 50, 10));
}

// p5.js draw
function draw() {
  background(255);

  for (let node of nodes) {
    node.update();
    node.render();
  }

  // Place and orient the transformation matrix
  translate(nodes[0].x, nodes[0].y);
  rotate(radians(-90));
  // rotate(radians(0));

  push();
  turtleDraw(sequence, limit);
  pop();

  angle -= 0.25;
  limit += 3;
}



// ███████╗██╗   ██╗███╗   ██╗ ██████╗███████╗
// ██╔════╝██║   ██║████╗  ██║██╔════╝██╔════╝
// █████╗  ██║   ██║██╔██╗ ██║██║     ███████╗
// ██╔══╝  ██║   ██║██║╚██╗██║██║     ╚════██║
// ██║     ╚██████╔╝██║ ╚████║╚██████╗███████║
// ╚═╝      ╚═════╝ ╚═╝  ╚═══╝ ╚═════╝╚══════╝
//                                            

// A function that parses a sentence and moves the turtle
function turtleDraw(seq, lim) {
  let top = min(seq.length, lim)
  for (let i = 0; i < top; i++) {
    moveTurtle(seq[i]);
  }
}

// Individual turtle actions per letter
function moveTurtle(letter) {
  switch (letter) {
    // Move forward drawing a line
    case 'F':
    case 'A':
    case 'B':
    case 'R':
    case 'L':
    case '1':
      line(0, 0, segmentLength, 0);
      translate(segmentLength, 0);
      break;

    // Draw shorter line
    case '0':
      line(0, 0, 0.5 * segmentLength, 0);
      break;

    // Move forward without drawing a line
    case 'f':
      translate(segmentLength, 0);
      break;

    // Rotate to the left
    case '+':
      rotate(radians(-angle));
      break;

    // Rotate to the right
    case '-':
      rotate(radians(angle));
      break;

    // Store position and rotate
    case '[':
      push();
      rotate(radians(-angle));
      break;

    // Restore position and rotate
    case ']':
      pop();
      rotate(radians(angle));
      break;

    // Do nothing if unknown letter
    default:
      break;
  }
}


// Computes a few generations of a L-system
function generateSequence(gens, init, rules) {
  let next = init;

  for (let i = 0; i < gens; i++) {
    next = applyRules(next, rules);
  }

  return next;
}

// Generates a new sentence by applying rules to a previous one
function applyRules(sentence, rules) {
  let newSentence = "";

  for (let i = 0; i < sentence.length; i++) {
    let letter = sentence[i];
    let child = rules[letter];
    newSentence += child;
  }

  return newSentence;
}




// When mouse is clicked, find the neares node and drag it.
function mousePressed() {
  for (let node of nodes) {
    if (node.isInside(mouseX, mouseY)) {
      node.dragged = true;
      break;
    }
  }
}

// When mouse is released, undrag all nodes.
function mouseReleased() {
  for (let node of nodes) {
    node.dragged = false;
  }
}

// A quick implementation of a circle that can be dragged with the mouse.
class Draggable {
  constructor(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.dragged = false;
  }

  update() {
    if (this.dragged) {
      this.x = mouseX;
      this.y = mouseY;
    }
  }

  render() {
    push();
    fill(255, 0, 0);
    noStroke();
    circle(this.x, this.y, 2 * this.r);
    pop();
  }

  isInside(x, y) {
    let d = dist(this.x, this.y, x, y);
    let inside = d <= this.r;
    return inside;
  }
}
