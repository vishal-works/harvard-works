///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Declaring our global variables

var generation; // Defines the index of a single melody (collection) of musical notes
var subGeneration; // Defines the index of a musical note in the melody
var aPattern, bPattern, cPattern, dPattern, ePattern; // Beat patterns
var a, b, c, d, e; // Beat sounds
var seqPattern; // Sequence pattern
var aPhrase, bPhrase, cPhrase, dPhrase, ePhrase; // Beat phrases (explained below)
var beatSequence; // a Part that plays all phrases

var axiom = ["F"]; // Defines the starting note
var nextMelody = []; // Defines a new collection of musical notes
var melody = [axiom, nextMelody]; // Current collection of musical notes
var bpm = 120; // Beats per minute

// Defines the L-system replacement rules for each note
// Rules are based on the Lydian scale
var rules = {
  "F": [ "C", "D", "E" ],
  "G": [ "F", "G", "B" ],
  "A": [ "F", "G", "E", "D"],
  "B": [ "G", "F", "E" ],
  "C": [ "E" ],
  "D": [ "F", "A", "B"],
  "E": [ "G", "A", "C" ]
};

// Defines the L-system beat generation rules for each note
var beatRules = {
  "F": [ [3,2], [2,4], [1,3] ],
  "G": [ [1,5], [2,2], [4,1] ],
  "A": [ [3,5], [4,3], [4,1],[4,0] ],
  "B": [ [0,5], [4,0], [2,0] ],
  "C": [ [0,3], [0,1] ],
  "D": [ [2,2], [1,1], [1,5] ],
  "E": [ [2,4], [2,1], [3,3] ]
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// The preload function is called when we need files loaded before setup() is called

function preload() {
  
  // Loading sound files
  
  a = loadSound('hat.mp3', () => {});
  b = loadSound('bass.mp3', () => {});
  c = loadSound('hit.mp3', () => {});
  d = loadSound('snare.mp3', () => {});
  e = loadSound('tap.mp3', () => {});
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// The setup function

function setup() {
  
  createCanvas(windowWidth, windowHeight); // Creating canvas 
  
  // Initiating our melody and musical note counters to 0
  generation = 0; 
  subGeneration = 0;

  // Initiating our beat patterns randomly (axiom)
  aPattern = [1, 0, 1, 0, 0, 1];
  bPattern = [0, 1, 0, 0, 0, 1];
  cPattern = [0, 0, 1, 0, 0, 0];
  dPattern = [1, 0, 0, 0, 1, 0];
  ePattern = [0, 0, 0, 1, 0, 0];
  seqPattern = [1, 2, 3, 4, 5, 6];

  // Creating phrases (how our clip is played) for our beats
  aPhrase = new p5.Phrase('a', (time) => {
    a.play(time);
  }, aPattern);

  bPhrase = new p5.Phrase('b', (time) => {
    b.play(time);
  }, bPattern);

  cPhrase = new p5.Phrase('c', (time) => {
    c.play(time);
  }, cPattern);

  dPhrase = new p5.Phrase('d', (time) => {
    d.play(time);
  }, dPattern);

  ePhrase = new p5.Phrase('e', (time) => {
    e.play(time);
  }, ePattern);

  // Creating a part with all the phrases

  beatSequence = new p5.Part();
  beatSequence.addPhrase(aPhrase);
  beatSequence.addPhrase(bPhrase);
  beatSequence.addPhrase(cPhrase);
  beatSequence.addPhrase(dPhrase);
  beatSequence.addPhrase(ePhrase);
  beatSequence.addPhrase('seq', sequence, seqPattern);
  beatSequence.setBPM(bpm/2);

  // Creating our music player with this SoundLoop
  music = new p5.SoundLoop(musicPlayer, 0.5);
  
  // Initiating Synth (which contains tones of notes based on pitch value) to play music
  synth = new p5.PolySynth();

  // Creating a button that plays / stops the current SoundLoop (music) and beat sequence
  play = createButton("Play / Stop music")
  .mousePressed(() => {
    if (music.isPlaying && beatSequence.isPlaying) {
      music.pause();
      beatSequence.pause();
    } else {
      music.maxIterations = Infinity;
      music.start();
      beatSequence.loop();
    }
  });
 
  // Creating a button that stops the SoundLoop and restarts on the current note
  jump = createButton("Step")
  .mousePressed(() => {
    music.stop();
    musicPlayer(0); // play from time = 0
  });

  // Creating a slider to control bpm
  bpmSlider = createSlider(100, 300, bpm);

  // Creating a slider to control pitch
  pitchSlider = createSlider(3, 6, 5);
  
  // Adjusting UI sizes and positions
  play.size(AUTO,35);
  play.position(width/2, height/8 + 65);

  jump.size(play.size().width,35);
  jump.position(width/2, height/8 + 75 + play.size().height);

  bpmSlider.position(width/2 - play.size().width/2 - bpmSlider.size().width/2 - 10, height/8 + 85);
  pitchSlider.position(width/2 - play.size().width/2 - bpmSlider.size().width/2 - 10, height/8 + 95 + play.size().height);
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// The draw function

function draw() {

  background(0); // Setting background to black
  bpm = bpmSlider.value();
  beatSequence.setBPM(bpm/2);

  // Setting label properties
  textSize(15);
  fill(255);
  textAlign(LEFT, CENTER);

  // Labels for sliders
  text("BPM", width/2 - bpmSlider.size().width * 1.2, height/8 + 75);
  text("Pitch", width/2 - bpmSlider.size().width * 1.2, height/8 + 85 + play.size().height);

  //UI rectangles
  noFill();
  stroke(255);
  rect(width/3, height/8 - 70, width/3, 95);
  rect(width/3, height/8 + 40, width/3, 125);

  //Resetting our styles
  fill(255);
  noStroke();

  // Marking the current playing subGeneration

  if (subGeneration >= 0) { // if there is any notes to play
    
    // Getting the X position of marker based on centered text width of the total melody
    let markerX = width / 2 - (30 * melody[generation].length)/2 + 30 * (subGeneration-1); 
    
    // Getting the Y position of marker based on centered text height
    let markerY = 30 + height/8 - (30 + 15) * (melody.length - generation);

    // Drawing our marker
    rect(markerX, markerY, 30, 35, 35);
  }

  // Displaying the current playing generation of melody

  // Setting text properties
  textSize(30);
  fill(40); // For the first line (current melody)
  textAlign(CENTER, CENTER);

  // Displaying the melody dynamically as it grows by joining newMelody 
  for (let i = 0; i < melody.length; i++) {

    if (i == melody.length - 1) {
      fill(255); // For the second line (generated melody)
    }
    let newMelody = melody[i]; // Getting the next melody
    text(newMelody.join(" "), width/2, height/8 - (30 + 10) * (melody.length - 1 - i)); // Displaying
  }

  // Drawing our beats
  drawBeats();
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Creating time sequence

const sequence = (time, beatIndex) => {
  setTimeout(() => {
  	drawBeats();
  	beatCursor(beatIndex);
  }, time*1000);
}

// Drawing a beat cursor

const beatCursor = (beatIndex) => {
	stroke(255);
  strokeWeight(3);
  noFill();
  rect((beatIndex-1)*width/18 + width/3, height/3, width/18, height/3);
  strokeWeight(1);
  fill(255);
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Function to draw beats

function drawBeats() {
  let left = width/3;
  let top = height/3;
  let bottom = 2 * height/3;

  // Drawing vertical lines
  stroke(40);
  for(let i = left; i < 2 * width/3 + width/60; i += width/18) {
    line(i, top, i, bottom);
  }

  // Drawing horizontal lines
  for(let i = top; i <= bottom; i += height/15) {
    line(left, i, 2 * width/3, i);
  }

  // Drawing beat ellipses
  fill(40);
  for(let i = 0; i < 6; i++) {

    //Pattern a
    if(aPattern[i] == 1) {
      ellipse((i + 0.5 ) * width/18 + width/3, height / 3 + height/30, 0.4* (width/18*height/15)**0.5);
    }

    //Pattern b
    if(bPattern[i] == 1) {
      ellipse((i + 0.5 ) * width/18 + width/3, height / 3 + height/30 + height/15, 0.4* (width/18*height/15)**0.5);
    }

    //Pattern c
    if(cPattern[i] == 1) {
      ellipse((i + 0.5 ) * width/18 + width/3, height / 3 + height/30 + 2 * height/15, 0.4* (width/18*height/15)**0.5);
    }

    //Pattern d
    if(dPattern[i] == 1) {
      ellipse((i + 0.5 ) * width/18 + width/3, height / 3 + height/30 + 3 * height/15, 0.4* (width/18*height/15)**0.5);
    }

    //Pattern e
    if(ePattern[i] == 1) {
      ellipse((i + 0.5 ) * width/18 + width/3, height / 3 + height/30 + 4 * height/15, 0.4* (width/18*height/15)**0.5);
    }
  }
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Main musicPLayer function that takes the current time (timeNow) as runtime and runs when the SoundLoop (music) is called

function musicPlayer(duration) {

  // If the current note exceeds the melody length, go to start of next melody
  if (subGeneration >= melody[generation].length) { 
    generation += 1;
    subGeneration = 0;
    melody.push([]); // Adding a new melody
    
    // Limit melody stack to 2 lines
    if (melody.length > 2) {
      generation -= 1;
      melody.shift(); // Shifts the melody by one element to the left, deleting the first one
    }
  }

  let currentNote = melody[generation][subGeneration] + pitchSlider.value(); // A pitch indicator is to be added to the note for the synth to play
  this.interval = 60/bpm; // Setting the current time interval based on bpm
  synth.play(currentNote, 0.8, duration, 60/bpm); // Play the currentNote from synth

  nextMelody = rules[melody[generation][subGeneration]]; // Grow a new melody based on rules
  let beatRule = beatRules[melody[generation][subGeneration]]; // Getting the beat sequence generating rules

  melody[generation + 1] = melody[generation + 1].concat(nextMelody); // Add the grown melody to the next melody

  // If the new melody is larger than 15, stop growing the melody
  if (melody[generation+1].length >= 15) {
    melody[generation+1] = melody[generation+1].slice(0, 15);
    if(subGeneration >= melody[generation].length) {
      subGeneration = 0;
      generation++;
      melody.push([]); // Add a new empty sequence

      // Maintaining melody stack length to 2
      if (melody.length > 2) {
        generation--;
        melody.shift(); // Shifts the melody by one element to the left, deleting the first one
      }
    }
  }

  subGeneration++; // Go to the next note

  // Generating beat sequence with beatRules
  for(let i = 0; i < beatRule.length; i++) {
    let row = beatRule[i][0];
    let index = beatRule[i][1];

    // Applying beat rules to modify beat sequence
    switch(row) {
      case 0:
        aPattern[index] = +!aPattern[index]; // Inverting the value at index
        break;
      case 1:
        bPattern[index] = +!bPattern[index]; // Inverting the value at index
        break;
      case 2:
        cPattern[index] = +!cPattern[index]; // Inverting the value at index
        break;
      case 3:
        dPattern[index] = +!dPattern[index]; // Inverting the value at index
        break;
      case 4:
        ePattern[index] = +!ePattern[index]; // Inverting the value at index
        break;
      default:
        // do nothing
    }

    // redraw beats
    drawBeats();
  }
}