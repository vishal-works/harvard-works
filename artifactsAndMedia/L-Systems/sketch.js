// L-Systems Generator!
// Creating a GUI control box, to control our L-system drawings. For this, we use two libraries
// linked in the index.html file, namely : p5.gui.js and quicksettings.js
// documentation can be found here : https://bitcraftlab.github.io/p5.gui/

// Base L-System defining parameters for the GUI
var axiom = "F+F+F+F+F";
var rule_1 = '"F":"F+F--F+F"';
var rule_2 = '"+":"+"';
var rule_3 = '"-":"-"';
var rule_4 = '';
var rule_5 = '';
var rule_6 = '';

var generations = 4;
var generationsMax = 10;
var segmentLength = 6;
var angle = 72;
var angleMin = 0; //p5.gui.js can automatically identify this as a slider variable
var angleMax = 360;
var draw_animation = false;
var angle_animation = false;
var strokeColor = '#787878';
var backgroundColor = '#323232';


// GUI variables
var visible = true;
var gui_rules, gui_controls;

let limit = 0;
let nodes = [];

// p5.js setup
function setup() {
  createCanvas(windowWidth, windowHeight);

  // nodes.push(new Draggable(windowWidth / 2, windowHeight / 2, 10));
  nodes.push(new Draggable(0.7 * windowWidth, 0.6 * windowHeight, 10));


  // Create Layout GUI
  gui_rules = createGui('Define your systems here!'); // One layout to edit rules
  gui_controls = createGui('Control your systems here!').setPosition(250, 20); // Another layout to edit controls

  //p5.gui.js automatically identifies the type of UI element based on variable value. so we simply add them to our GUI.
  gui_rules.addGlobals('axiom', 'rule_1', 'rule_2', 'rule_3', 'rule_4', 'rule_5', 'rule_6'); //Adding UI elements
  gui_controls.addGlobals('backgroundColor', 'strokeColor', 'generations', 'segmentLength', 'angle', 'draw_animation', 'angle_animation'); // Adding UI elements

}

// p5.js draw
function draw() {
  
  background(backgroundColor);
  stroke(strokeColor);

  for (let node of nodes) {
    node.update();
    node.render();
  }

  // Place and orient the transformation matrix
  translate(nodes[0].x, nodes[0].y);
  rotate(radians(-90));
  // rotate(radians(0));

  // Creating the rules dictionary from UI input
  //joining all non-empty rule strings into a string form of a dictionary
  let all_rules = "{" + [rule_1, rule_2, rule_3, rule_4, rule_5, rule_6].filter(x => x.length > 0).join() + "}";
  // converting dictionary string form to dictionary
  // Putting inside an exception handling statement to prevent syntax error during typing of rules in the GUI
  let rules = {};
  if(all_rules) {
    try {
        rules = JSON.parse(all_rules);
    } catch(e) {
        console.log("incomplete/invalid rules!") // error in the above string (incorrect/incomplete input of rules in GUI)
    }
  }

  // Generate a few generations of the L-system
  let sequence = generateSequence(generations, axiom, rules);
  push();
  turtleDraw(sequence, limit);
  pop();

  // Handling animation based on choice
  if (draw_animation) {
    if (limit > sequence.length) {
      limit = 1;
    }
    limit += 3;
  }
  else if (angle_animation) {
    angle -= 0.2;
  }
  else {
    limit = sequence.length;
  }

}
// Making sure to handle events associated with resizing the window
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  gui_controls.setPosition(250, 20);
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
