/**
 *  p5.sound extends p5 with <a href="http://caniuse.com/audio-api"
 *  target="_blank">Web Audio</a> functionality including audio input,
 *  playback, analysis and synthesis.
 *  <br/><br/>
 *  <a href="#/p5.SoundFile"><b>p5.SoundFile</b></a>: Load and play sound files.<br/>
 *  <a href="#/p5.Amplitude"><b>p5.Amplitude</b></a>: Get the current volume of a sound.<br/>
 *  <a href="#/p5.AudioIn"><b>p5.AudioIn</b></a>: Get sound from an input source, typically
 *    a computer microphone.<br/>
 *  <a href="#/p5.FFT"><b>p5.FFT</b></a>: Analyze the frequency of sound. Returns
 *    results from the frequency spectrum or time domain (waveform).<br/>
 *  <a href="#/p5.Oscillator"><b>p5.Oscillator</b></a>: Generate Sine,
 *    Triangle, Square and Sawtooth waveforms. Base class of
 *    <a href="#/p5.Noise">p5.Noise</a> and <a href="#/p5.Pulse">p5.Pulse</a>.
 *    <br/>
 *  <a href="#/p5.Env"><b>p5.Env</b></a>: An Envelope is a series
 *    of fades over time. Often used to control an object's
 *    output gain level as an "ADSR Envelope" (Attack, Decay,
 *    Sustain, Release). Can also modulate other parameters.<br/>
 *  <a href="#/p5.Delay"><b>p5.Delay</b></a>: A delay effect with
 *    parameters for feedback, delayTime, and lowpass filter.<br/>
 *  <a href="#/p5.Filter"><b>p5.Filter</b></a>: Filter the frequency range of a
 *    sound.
 *  <br/>
 *  <a href="#/p5.Reverb"><b>p5.Reverb</b></a>: Add reverb to a sound by specifying
 *    duration and decay. <br/>
 *  <b><a href="#/p5.Convolver">p5.Convolver</a>:</b> Extends
 *  <a href="#/p5.Reverb">p5.Reverb</a> to simulate the sound of real
 *    physical spaces through convolution.<br/>
 *  <b><a href="#/p5.SoundRecorder">p5.SoundRecorder</a></b>: Record sound for playback 
 *    / save the .wav file.
 *  <b><a href="#/p5.Phrase">p5.Phrase</a></b>, <b><a href="#/p5.Part">p5.Part</a></b> and
 *  <b><a href="#/p5.Score">p5.Score</a></b>: Compose musical sequences.
 *  <br/><br/>
 *  p5.sound is on <a href="https://github.com/therewasaguy/p5.sound/">GitHub</a>.
 *  Download the latest version 
 *  <a href="https://github.com/therewasaguy/p5.sound/blob/master/lib/p5.sound.js">here</a>.
 *  
 *  @module p5.sound
 *  @submodule p5.sound
 *  @for p5.sound
 *  @main
 */


/**
 *  p5.sound developed by Jason Sigal for the Processing Foundation, Google Summer of Code 2014. The MIT License (MIT).
 *  
 *  http://github.com/therewasaguy/p5.sound
 *
 *  Some of the many audio libraries & resources that inspire p5.sound:
 *   - TONE.js (c) Yotam Mann, 2014. Licensed under The MIT License (MIT). https://github.com/TONEnoTONE/Tone.js
 *   - buzz.js (c) Jay Salvat, 2013. Licensed under The MIT License (MIT). http://buzz.jaysalvat.com/
 *   - Boris Smus Web Audio API book, 2013. Licensed under the Apache License http://www.apache.org/licenses/LICENSE-2.0
 *   - wavesurfer.js https://github.com/katspaugh/wavesurfer.js
 *   - Web Audio Components by Jordan Santell https://github.com/web-audio-components
 *   - Wilm Thoben's Sound library for Processing https://github.com/processing/processing/tree/master/java/libraries/sound
 *   
 *   Web Audio API: http://w3.org/TR/webaudio/
 */

define(function (require) {
  'use strict';

  /**
   * Web Audio SHIMS and helper functions to ensure compatability across browsers
   */

  // If window.AudioContext is unimplemented, it will alias to window.webkitAudioContext.
  window.AudioContext = window.AudioContext || window.webkitAudioContext;

  // Create the Audio Context
  var audiocontext = new window.AudioContext();

  /**
   * <p>Returns the Audio Context for this sketch. Useful for users
   * who would like to dig deeper into the <a target='_blank' href=
   * 'http://webaudio.github.io/web-audio-api/'>Web Audio API
   * </a>.</p>
   *
   * @method getAudioContext
   * @return {Object}    AudioContext for this sketch
   */
  p5.prototype.getAudioContext = function(){
    return audiocontext;
  };

  // Polyfills & SHIMS (inspired by tone.js and the AudioContext MonkeyPatch https://github.com/cwilso/AudioContext-MonkeyPatch/ (c) 2013 Chris Wilson, Licensed under the Apache License) //

  if (typeof audiocontext.createGain !== 'function'){
    window.audioContext.createGain = window.audioContext.createGainNode;
  }
  if (typeof audiocontext.createDelay !== 'function'){
    window.audioContext.createDelay = window.audioContext.createDelayNode;
  }
  if (typeof window.AudioBufferSourceNode.prototype.start !== 'function'){
    window.AudioBufferSourceNode.prototype.start = window.AudioBufferSourceNode.prototype.noteGrainOn;
  }
  if (typeof window.AudioBufferSourceNode.prototype.stop !== 'function'){
    window.AudioBufferSourceNode.prototype.stop = window.AudioBufferSourceNode.prototype.noteOff;
  }
  if (typeof window.OscillatorNode.prototype.start !== 'function'){
    window.OscillatorNode.prototype.start = window.OscillatorNode.prototype.noteOn;
  }
  if (typeof window.OscillatorNode.prototype.stop !== 'function'){
    window.OscillatorNode.prototype.stop = window.OscillatorNode.prototype.noteOff; 
  }
  if (!window.AudioContext.prototype.hasOwnProperty('createScriptProcessor')){
    window.AudioContext.prototype.createScriptProcessor = window.AudioContext.prototype.createJavaScriptNode;
  }

  // Polyfill for AudioIn, also handled by p5.dom createCapture
  navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;


  /**
   * Determine which filetypes are supported (inspired by buzz.js)
   * The audio element (el) will only be used to test browser support for various audio formats
   */
  var el = document.createElement('audio');

  p5.prototype.isSupported = function() {
    return !!el.canPlayType;
  };
  var isOGGSupported = function() {
    return !!el.canPlayType && el.canPlayType('audio/ogg; codecs="vorbis"');
  };
  var isMP3Supported = function() {
    return !!el.canPlayType && el.canPlayType('audio/mpeg;');
  };
  var isWAVSupported = function() {
    return !!el.canPlayType && el.canPlayType('audio/wav; codecs="1"');
  };
  var isAACSupported = function() {
    return !!el.canPlayType && (el.canPlayType('audio/x-m4a;') || el.canPlayType('audio/aac;'));
  };
  var isAIFSupported = function() {
    return !!el.canPlayType && el.canPlayType('audio/x-aiff;');
  };
  p5.prototype.isFileSupported = function(extension) {
    switch(extension.toLowerCase())
    {
      case 'mp3':
        return isMP3Supported();
      case 'wav':
        return isWAVSupported();
      case 'ogg':
        return isOGGSupported();
      case 'aac', 'm4a', 'mp4':
        return isAACSupported();
      case 'aif', 'aiff':
        return isAIFSupported();
      default:
        return false;
    }
  };

  // if it is iOS, we have to have a user interaction to start Web Audio
  // http://paulbakaus.com/tutorials/html5/web-audio-on-ios/
  var iOS = ( navigator.userAgent.match(/(iPad|iPhone|iPod)/g) ? true : false );

  if (iOS) {
    window.addEventListener('touchstart', function() {

    // create empty buffer
    var buffer = audiocontext.createBuffer(1, 1, 22050);
    var source = audiocontext.createBufferSource();
    source.buffer = buffer;

    // connect to output (your speakers)
    source.connect(audiocontext.destination);

    // play the file
    source.start(0);

    }, false);

    // TO DO: fake touch event so that audio will just start
  }

});