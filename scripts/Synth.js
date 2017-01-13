
var osc;
var aenv;
var penv;

osc = new Sine();
aenv = new DecayEnv();
penv = new PitchEnv();



var audioContext = new (window.AudioContext || window.webkitAudioContext)();

window.addEventListener('touchstart', function() {

	// create empty buffer
	var buffer = audioContext.createBuffer(1, 1, 22050);
	var src = audioContext.createBufferSource();
	src.buffer = buffer;

	// connect to output (your speakers)
	src.connect(audioContext.destination);

	// play the file
	src.start();

}, false);

source = audioContext.createBufferSource();
var scriptNode = audioContext.createScriptProcessor(4096, 0, 1);
var kickButton = document.getElementById('kickButton');

var sampleRate = audioContext.sampleRate;
osc.inc = 60.0 / sampleRate;
aenv.sampleRate = sampleRate;
penv.sampleRate = sampleRate;

aenv.setDecayRate(.5);
aenv.stage = 0;
penv.setRate(.25);
penv.setCurve(1);

var start = 10000.0 / sampleRate;
var end = 60.0 / sampleRate;

// Give the node a function to process audio events
scriptNode.onaudioprocess = function(audioProcessingEvent) {
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
          outputData[sample] = 0.0;
        }
    }
  }
}




source.connect(scriptNode);
scriptNode.connect(audioContext.destination);
source.start();


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
