p5.sound.js v0.1.8 2015-02-27
- p5.SoundFile.jump() does not impact the start/end time for future .play() or .loop()

p5.sound.js v0.1.7 2015-01-26
- p5.SoundFile.play() accepts timeFromNow as first parameter
- Improvements to p5.Part / scheduling. Sequencing callbacks send a time, which should be used to schedule with precision.

p5.sound.js v0.1.6 2014-12-26
- amplitude modulation for p5.Noise and p5.SoundFile
- updating to latest version of Tone (0.3.0)
- fixes for new Tone Signal math
- musical timing (p5.Metro) fix for Firefox
- revamp the p5.Panner: defaults to stereo, 3D version (and web audio panner) is not used
- p5.Noise inherits from p5.Oscillator prototype
- improvements to p5.Env

p5.sound.js v0.1.5 2014-12-05
- p5.Oscillator defauts to 0.5 amp
- using Tone.Signal for signal math, and Tone.Clock for Transport. 
- updates to Sequencing objects (p5.Part, p5.Phrase, p5.Score) including documentation for reference pages
- p5.Panner class
- various bug fixes


p5.sound.js v0.14 2014-08-18
- added changelog
- Recording: add p5.SoundRecorder class. SoundFile has a .saveSound() method to save as .wav
- Sequencer: p5.Part, p5.Phrase, p5.Score, setBPM() etc (in development)
- p5.Oscillator defauts to 0 amp (better for envelopes)
- osc.start(time, freq) instead of osc.start(freq, time)
- p5.Signal class introduced to manage .add, .mult and .scale of audio signals. p5.Oscillator and p5.Env get .add, .mult and .scale methods
- removing the .mod method for oscillator
- new way to modulate: pass the oscillator or envelope as the parameter, i.e. ```carrier.freq(mod)```, or ```carrier.freq(mod.scale(-1, 1, 400, 600))``` (converts to a p5.Signal)

p5.sound.js v0.122 2014-08-11
- adding p5.Delay, p5.Filter, p5.Reverb

p5.sound.js v0.121 2014-08-07
- FFT.getFreq --> getEnergy
- FFT.getEnergy accepts preset ranges for 'bass', 'lowMid', 'mid', 'treble'
- FFT returns Array instead of Uint8Array

p5.sound.js v0.120 2014-08-06
- Objects become p5.Objects

p5.sound.js v0.1 2014-08-04
- fft.analyze() returns Uint8Array (0 to 255) instead of a float32 Array
