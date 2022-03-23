var dataGeneration = function(sketch) {
  let microphoneIn, recorder, audioFile, frequencyBins, input, spectogramCanvas;
  let sketchController = 0;
  let spectogramX = 0;
  let spectogramStep = 1;

  sketch.setup = function() {
    spectogramCanvas = sketch.createCanvas(256, 256);
    spectogramCanvas.parent('dataCollection');
    sketch.background(0);

    microphoneIn = new p5.AudioIn();
    microphoneIn.start();

    frequencyBins = new p5.FFT(0.5, 256);

    recorder = new p5.SoundRecorder();
    recorder.setInput(microphoneIn);

    audioFile = new p5.SoundFile();

    recButton = sketch.createButton('Record');
    recButton.parent('dataCollection');
    recButton.position(spectogramCanvas.width + 10, 10);

    loadButton = sketch.createButton('Load');
    loadButton.parent('dataCollection');
    loadButton.position(spectogramCanvas.width + 10, 40);
    loadButton.size(recButton.width, recButton.height);

    playButton = sketch.createButton('Play');
    playButton.parent('dataCollection');
    playButton.position(spectogramCanvas.width + 10, 70);
    playButton.size(recButton.width, recButton.height);

    generateButton = sketch.createButton('Create');
    generateButton.parent('dataCollection');
    generateButton.position(spectogramCanvas.width + 10, 100);
    generateButton.size(recButton.width, recButton.height);

    clearButton = sketch.createButton('Clear');
    clearButton.parent('dataCollection');
    clearButton.position(spectogramCanvas.width + 10, spectogramCanvas.height - 40);
    clearButton.size(recButton.width, recButton.height);

    saveButton = sketch.createButton('Save');
    saveButton.parent('dataCollection');
    saveButton.position(spectogramCanvas.width + 10, spectogramCanvas.height - 70);
    saveButton.size(recButton.width, recButton.height);

    recButton.mousePressed(sketch.recordAudio);
    loadButton.mousePressed(sketch.loadAudio);
    playButton.mousePressed(sketch.playAudio);
    clearButton.mousePressed(sketch.clearAudio);

    frequencyBins.setInput(audioFile);

    generateButton.mousePressed(sketch.generateSpectogram);
    saveButton.mousePressed(sketch.saveSpectogram);

  }

  sketch.draw = function() {
    if(sketchController == 3) {
      sketch.spectogram();
    } 
  }

  sketch.recordAudio = function() {
    if(sketchController == 0 && microphoneIn.enabled) {
      sketchController = 1;
      recButton.html("Stop");
      recorder.record(audioFile);
    }
    else if(sketchController == 1) {
      sketchController = 2;
      recButton.html("Record");
      recorder.stop();
    }
    else {
      console.log("File already exists! Clear to record a new file");
    }
  }

  sketch.loadAudio = function() {
    if(sketchController == 0) {
      input = sketch.createFileInput(sketch.handleFile);
      input.position(loadButton.position().x, loadButton.position().y)
    }
    else {
      console.log("File already exists! Clear to load a new file");
    }
  }

  sketch.playAudio = function() {
    if(sketchController >= 2) {
      audioFile.play();
    }
    else {
      console.log("No file to play. Record/load a file to play");
    }
  }

  sketch.clearAudio = function() {
    if(sketchController >= 2) {
      loadButton.html("Load");
      if(input){
        input.remove();
      }
      audioFile = new p5.SoundFile();
      microphoneIn = new p5.AudioIn();
      microphoneIn.start();

      frequencyBins = new p5.FFT(0.5, 256);

      recorder = new p5.SoundRecorder();
      recorder.setInput(microphoneIn);
      sketchController = 0;
      sketch.background(0);
    }
  }

  sketch.generateSpectogram = function() {
    if(sketchController >= 2) {
      sketchController = 3;
      audioFile.play();
    }
    else {
      console.log("No file to generate. Record/load a file to play");
    }
  }

  sketch.spectogram = function() {
    sketch.noStroke();
    let bins = frequencyBins.analyze();
    for (let i = 0; i < bins.length; i++) {
      let drawY = sketch.map(i, 0, bins.length, sketch.height, 0);
      let rectHeight = sketch.height / bins.length;
      let lerp = sketch.map(bins[i], 0,255,0,1);
      let c = sketch.lerpColor(sketch.color(0,0,255), sketch.color(0,255,0), lerp);
      sketch.fill(c);
      sketch.rect(spectogramX, drawY, spectogramStep, rectHeight);
    }
    spectogramX += spectogramStep;
    if (spectogramX > sketch.width) {
      spectogramX = 0;
      spectogramStep = 1;
      sketchController = 2;
    }
  }

  sketch.saveSpectogram = function() {
    if(sketchController >= 2) {
      sketch.saveCanvas(spectogramCanvas, 'spectogram', 'png');
    }
    else {
      console.log("No spectogram to save. Generate one to save");
    }
  }

  sketch.handleFile = function(file) {
    if (file.type === 'audio') {
      sketchController = 2;
      loadButton.html("Loaded!");
      audioFile = sketch.loadSound(file);
    } else {
      console.log("invalid file input. Please input a audio file");
    }
  }
};

var dataPrediction = function(sketch){
  let predictionCanvas;
  
  sketch.setup = function() {
    predictionCanvas = sketch.createCanvas(256,256);
    predictionCanvas.parent("prediction");
    sketch.background(150);
  }
  sketch.draw = function() {
    
  }
};

new p5(dataGeneration, document.getElementById('dataCollection'));

new p5(dataPrediction, document.getElementById('prediction'));