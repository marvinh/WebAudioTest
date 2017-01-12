
var osc;
var aenv;
var penv;

osc = new Sine();
aenv = new DecayEnv();
penv = new PitchEnv();



var audioContext = new AudioContext();
source = audioContext.createBufferSource();
var scriptNode = audioContext.createScriptProcessor(4096, 0, 1);
var kickButton = document.getElementById("kickButton");
var initButton = document.getElementById("init");
osc.inc = 60.0/audioContext.sampleRate;
aenv.sampleRate = audioContext.sampleRate;
penv.sampleRate = audioContext.sampleRate;

aenv.setDecayRate(.5);

penv.setRate(.25);
penv.setCurve(.0);

var start = 10000.0/audioContext.sampleRate;
var end = 60.0/audioContext.sampleRate;

source.noteOn(0);

// Give the node a function to process audio events
scriptNode.onaudioprocess = function(audioProcessingEvent) {
  // The input buffer is the song we loaded earlier
  //var inputBuffer = audioProcessingEvent.inputBuffer;
  // The output buffer contains the samples that will be modified and played
  var outputBuffer = audioProcessingEvent.outputBuffer;

  if(aenv.stage != 0)
  {
  // Loop through the output channels (in this case there is only one)
    for (var channel = 0; channel < outputBuffer.numberOfChannels; channel++)
    {
        var outputData = outputBuffer.getChannelData(channel);
        // Loop through the 4096 samples
        for (var sample = 0; sample < outputBuffer.length; sample++)
        {
          // make output equal to the same as the input
          //outputData[sample] = inputData[sample];
          // add noise to each output sample
          outputData[sample] = osc.process() * aenv.process();
          osc.inc = penv.processPitch(start,end);
        }
    }
  }
  else
  {
    for (var channel = 0; channel < outputBuffer.numberOfChannels; channel++)
    {
        var outputData = outputBuffer.getChannelData(channel);
        // Loop through the 4096 samples
        for (var sample = 0; sample < outputBuffer.length; sample++)
        {
          // make output equal to the same as the input
          //outputData[sample] = inputData[sample];
          // add noise to each output sample
          outputData[sample] = 0.0;
        }
    }
  }
}

initButton.onclick = function() {
  source.connect(scriptNode);
  scriptNode.connect(audioContext.destination);
  source.start();
}

// When the buffer source stops playing, disconnect everything
source.onended = function() {
  source.disconnect(scriptNode);
  scriptNode.disconnect(audioContext.destination);
}

kickButton.onclick = function() {
  console.log('kick button fired');
  penv.reset();
  aenv.reset();
}
