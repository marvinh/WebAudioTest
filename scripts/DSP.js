
function Sine()
{
    this.inc = 0.0;
    this.phase = 0.0;
}

Sine.prototype.process = function () {
  this.wrap();
  const output = Math.sin(2.0*Math.PI*this.phase);
  this.phase += this.inc;
  return output;
}

Sine.prototype.reset = function () {
  this.phase = 0.0;
};

Sine.prototype.wrap = function () {
  if(this.phase > 1.0)
  {
    this.phase -= 1.0;
  }
  else if (this.phase < 0.0)
  {
    this.phase += 1.0;
  }
}

function DecayEnv()
{
    this.value = 1.0;
    this.stage = 1;
    this.sampleRate = 44100.0;
    this.decayCoeff = 0.1;
}

DecayEnv.prototype.setDecayRate = function (rate) {
    if(rate < .025)
    {
      rate = .025;
    }
    this.decayCoeff = 1.0/(this.sampleRate*rate);
};

DecayEnv.prototype.process = function () {
  switch (this.stage) {
    case 0:
      break;
    case 1:
      this.value -= this.decayCoeff
      if(this.value < 0.00001)
      {
        this.value = 0.0;
        this.stage = 0;
      }
      break;
  }
    return this.value;
};

DecayEnv.prototype.reset = function () {
  this.value = 1.0;
  this.stage = 1;
};

function PitchEnv()
{
  this.value = 0.0;
  this.phase = 0.0;
  this.stage = 1;
  this.sampleRate = 44100.0;

  this.curve = 1.0;
  this.coeff = 0.1;
}

PitchEnv.prototype.setRate = function (rate) {
    if(rate < .025)
    {
      rate = .025;
    }
    else if (rate > .25)
    {
      rate = .25;
    }
    this.coeff = 1.0/(this.sampleRate*rate);
};

PitchEnv.prototype.setCurve = function (curve) {
  this.curve = 1.0 + 9.0 * curve;
};


PitchEnv.prototype.process = function () {
  switch (this.stage) {
    case 0:
      break;
    case 1:
      this.value = 1.0 - Math.pow(1.0-this.phase,this.curve);
      this.phase += this.coeff;
      if(this.value >= 1.0)
      {
        this.phase = 0.0;
        this.stage = 0;
      }
      break;
  }
    return this.value;
};


PitchEnv.prototype.processPitch = function (f0,f1) {
  return f0 * f1 / ((f0 - f1)*this.process() + f1);
};

PitchEnv.prototype.reset = function () {
  this.value = 0.0;
  this.phase = 0.0;
  this.stage = 1;
};
