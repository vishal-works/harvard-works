// Let's define the components of the L-system
let axiom = 'A';
let rules = {
  'A': 'AB',
  'B': 'A',
};
let generations = 6;
let segmentLength = 20;
let angle = 60;

// Generate a few generations of the L-system
let sequence = generateSequence(generations, axiom, rules);
console.log(sequence);

// p5.js setup
function setup() {
  createCanvas(windowWidth, windowHeight);
}

// p5.js draw
function draw() {
  background(255);
  
  // Place and orient the transformation matrix
  translate(50, 0.5 * windowHeight);
  rotate(radians(0));
  
  turtleDraw(sequence);
}



// ███████╗██╗   ██╗███╗   ██╗ ██████╗███████╗
// ██╔════╝██║   ██║████╗  ██║██╔════╝██╔════╝
// █████╗  ██║   ██║██╔██╗ ██║██║     ███████╗
// ██╔══╝  ██║   ██║██║╚██╗██║██║     ╚════██║
// ██║     ╚██████╔╝██║ ╚████║╚██████╗███████║
// ╚═╝      ╚═════╝ ╚═╝  ╚═══╝ ╚═════╝╚══════╝
//                                            

// A function that parses a sentence and moves the turtle
function turtleDraw(seq) {
  for (let i = 0; i < seq.length; i++) {
    moveTurtle(seq[i]);
  }
}

// Individual turtle actions per letter
function moveTurtle(letter) {
  switch(letter) {
    // Move forward drawing a line
    case 'A':
      line(0, 0, segmentLength, 0);
      translate(segmentLength, 0);
      break;
      
    // Move forward without drawing a line
    case 'B':
      translate(segmentLength, 0);
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
