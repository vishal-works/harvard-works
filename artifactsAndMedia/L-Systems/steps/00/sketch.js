// Let's define the components of the L-system
let axiom = 'A';
let rules = {
  'A': 'AB',
  'B': 'A',
};
let generations = 4;

// Generate a few generations of the L-system
let sequence = generateSequence(generations, axiom, rules);
console.log(sequence);


// ███████╗██╗   ██╗███╗   ██╗ ██████╗███████╗
// ██╔════╝██║   ██║████╗  ██║██╔════╝██╔════╝
// █████╗  ██║   ██║██╔██╗ ██║██║     ███████╗
// ██╔══╝  ██║   ██║██║╚██╗██║██║     ╚════██║
// ██║     ╚██████╔╝██║ ╚████║╚██████╗███████║
// ╚═╝      ╚═════╝ ╚═╝  ╚═══╝ ╚═════╝╚══════╝
//                                            

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
